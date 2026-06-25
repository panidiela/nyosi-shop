import { supabase } from "./supabase";
import { getUtilisateur } from "./auth";

export type Produit = {
  nom: string;
  prix: string;
  description: string;
  photo: string;
};

export type Boutique = {
  slug: string;
  nom: string;
  categorie: string;
  whatsapp: string;
  facebook: string;
  description: string;
  ville: string;
  quartier: string;
  produits: Produit[];
};

export type LigneCommande = {
  produit_nom: string;
  produit_prix: number;
  quantite: number;
  sous_total: number;
};

export type Commande = {
  boutique_slug: string;
  numero: string;
  client_nom: string;
  client_telephone: string;
  ville: string;
  quartier: string;
  adresse: string;
  date_livraison: string;
  heure_livraison: string;
  instructions: string;
  total: number;
  lignes: LigneCommande[];
};

/* ─────────────────────────────────────────
   SAUVEGARDER UNE BOUTIQUE
   1. Supabase (si configuré)
   2. localStorage (toujours, comme backup)
───────────────────────────────────────── */
export type ResultatSauvegarde = {
  ok: boolean;
  source: "supabase" | "local";
  erreur?: string;
};

export async function sauvegarderBoutique(boutique: Boutique): Promise<ResultatSauvegarde> {
  // localStorage — toujours (backup instantané)
  localStorage.setItem(`nyosi_boutique_${boutique.slug}`, JSON.stringify(boutique));

  if (!supabase) {
    // Supabase non configuré → localStorage seulement
    return { ok: true, source: "local" };
  }

  try {
    const user = await getUtilisateur();

    // Upsert la boutique (crée ou met à jour si le slug existe déjà)
    const { error: errBoutique } = await supabase
      .from("boutiques")
      .upsert(
        {
          slug: boutique.slug,
          nom: boutique.nom,
          categorie: boutique.categorie,
          whatsapp: boutique.whatsapp,
          facebook: boutique.facebook ?? "",
          description: boutique.description ?? "",
          ville: boutique.ville,
          quartier: boutique.quartier,
          ...(user ? { user_id: user.id } : {}),
        },
        { onConflict: "slug" }
      );

    if (errBoutique) {
      console.error("[Nyosi] Supabase boutique error:", errBoutique);
      return { ok: false, source: "local", erreur: errBoutique.message };
    }

    // Supprimer les anciens produits et réinsérer
    const { error: errDelete } = await supabase
      .from("produits")
      .delete()
      .eq("boutique_slug", boutique.slug);

    if (errDelete) {
      console.error("[Nyosi] Supabase delete produits error:", errDelete);
      return { ok: false, source: "local", erreur: errDelete.message };
    }

    if (boutique.produits.length > 0) {
      const { error: errProduits } = await supabase.from("produits").insert(
        boutique.produits.map((p, i) => ({
          boutique_slug: boutique.slug,
          nom: p.nom,
          prix: p.prix,
          description: p.description ?? "",
          photo: p.photo ?? "",
          ordre: i,
        }))
      );
      if (errProduits) {
        console.error("[Nyosi] Supabase insert produits error:", errProduits);
        return { ok: false, source: "local", erreur: errProduits.message };
      }
    }

    return { ok: true, source: "supabase" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[Nyosi] Supabase indisponible, localStorage utilisé.", e);
    return { ok: false, source: "local", erreur: msg };
  }
}

/* ─────────────────────────────────────────
   LIRE UNE BOUTIQUE PAR SLUG
   1. Supabase (si configuré)
   2. localStorage (fallback)
───────────────────────────────────────── */
export async function lireBoutique(slug: string): Promise<Boutique | null> {
  // Essai Supabase
  if (supabase) {
    try {
      const { data: b, error } = await supabase
        .from("boutiques")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && b) {
        const { data: produits } = await supabase
          .from("produits")
          .select("*")
          .eq("boutique_slug", slug)
          .order("ordre", { ascending: true });

        const boutique: Boutique = {
          slug: b.slug,
          nom: b.nom,
          categorie: b.categorie,
          whatsapp: b.whatsapp,
          facebook: b.facebook ?? "",
          description: b.description ?? "",
          ville: b.ville,
          quartier: b.quartier,
          produits: (produits ?? []).map((p) => ({
            nom: p.nom,
            prix: p.prix,
            description: p.description ?? "",
            photo: p.photo ?? "",
          })),
        };

        // Met à jour localStorage avec les données fraîches
        localStorage.setItem(`nyosi_boutique_${slug}`, JSON.stringify(boutique));
        return boutique;
      }
    } catch (e) {
      console.warn("[Nyosi] Supabase indisponible, lecture localStorage.", e);
    }
  }

  // Fallback localStorage
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(`nyosi_boutique_${slug}`);
    if (data) return JSON.parse(data) as Boutique;
  }

  return null;
}

/* ─────────────────────────────────────────
   SAUVEGARDER UNE COMMANDE
   1. Supabase (si configuré)
   2. Silencieux si Supabase absent (la commande existe côté UI)
───────────────────────────────────────── */
export async function sauvegarderCommande(commande: Commande): Promise<void> {
  if (!supabase) return;

  try {
    const { data: order, error: errOrder } = await supabase
      .from("orders")
      .insert({
        boutique_slug: commande.boutique_slug,
        numero: commande.numero,
        client_nom: commande.client_nom,
        client_telephone: commande.client_telephone,
        ville: commande.ville,
        quartier: commande.quartier,
        adresse: commande.adresse,
        date_livraison: commande.date_livraison,
        heure_livraison: commande.heure_livraison,
        instructions: commande.instructions ?? "",
        total: commande.total,
        statut: "en_attente",
      })
      .select()
      .single();

    if (errOrder || !order) {
      console.warn("[Nyosi] Supabase order error:", errOrder?.message);
      return;
    }

    if (commande.lignes.length > 0) {
      await supabase.from("order_items").insert(
        commande.lignes.map((l) => ({
          order_id: order.id,
          produit_nom: l.produit_nom,
          produit_prix: l.produit_prix,
          quantite: l.quantite,
          sous_total: l.sous_total,
        }))
      );
    }
  } catch (e) {
    console.warn("[Nyosi] Supabase commande non enregistrée:", e);
  }
}
