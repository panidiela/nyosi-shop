import { supabase } from "./supabase";

export type StatutCommande = "en_attente" | "confirmee" | "livree" | "annulee";

export type ArticleCommande = {
  id: string;
  order_id: string;
  produit_nom: string;
  produit_prix: number;
  quantite: number;
  sous_total: number;
};

export type CommandeDetail = {
  id: string;
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
  statut: StatutCommande;
  created_at: string;
  order_items: ArticleCommande[];
};

export type ProduitDB = {
  id: string;
  boutique_slug: string;
  nom: string;
  prix: string;
  description: string;
  photo: string;
  ordre: number;
};

export type BoutiqueInfo = {
  slug: string;
  nom: string;
  categorie: string;
  whatsapp: string;
  facebook: string;
  description: string;
  ville: string;
  quartier: string;
};

/* ── Slug actuel ──────────────────────────────────────────────────────
   Identifie la boutique active du commerçant sur cet appareil.
   Prêt pour multi-boutique : chaque fonction prend un slug explicite.
   Dans le futur, un écran "choisir boutique" remplacera cette clé.
──────────────────────────────────────────────────────────────────── */
export function getSlugActuel(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nyosi_current_slug");
}

export function setSlugActuel(slug: string) {
  localStorage.setItem("nyosi_current_slug", slug);
}

/* ── Boutique ─────────────────────────────────────────────────────── */

export async function getBoutiqueActuelle(): Promise<BoutiqueInfo | null> {
  const slug = getSlugActuel();
  if (!slug) return null;
  return getBoutiqueParSlug(slug);
}

export async function getBoutiqueParSlug(slug: string): Promise<BoutiqueInfo | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("boutiques")
        .select("slug, nom, categorie, whatsapp, facebook, description, ville, quartier")
        .eq("slug", slug)
        .single();
      if (!error && data) return data as BoutiqueInfo;
    } catch { /* Supabase indisponible */ }
  }
  // Fallback localStorage
  if (typeof window !== "undefined") {
    const local = localStorage.getItem(`nyosi_boutique_${slug}`);
    if (local) {
      const b = JSON.parse(local);
      return {
        slug: b.slug, nom: b.nom, categorie: b.categorie,
        whatsapp: b.whatsapp, facebook: b.facebook ?? "",
        description: b.description ?? "", ville: b.ville, quartier: b.quartier,
      };
    }
  }
  return null;
}

export async function mettreAJourBoutique(
  slug: string,
  data: Partial<Omit<BoutiqueInfo, "slug" | "categorie">>
): Promise<boolean> {
  // Met à jour localStorage aussi
  if (typeof window !== "undefined") {
    const local = localStorage.getItem(`nyosi_boutique_${slug}`);
    if (local) {
      localStorage.setItem(`nyosi_boutique_${slug}`, JSON.stringify({ ...JSON.parse(local), ...data }));
    }
  }
  if (!supabase) return true;
  try {
    const { error } = await supabase.from("boutiques").update(data).eq("slug", slug);
    return !error;
  } catch {
    return false;
  }
}

/* ── Produits ─────────────────────────────────────────────────────── */

export async function getProduits(slug: string): Promise<ProduitDB[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("produits")
        .select("*")
        .eq("boutique_slug", slug)
        .order("ordre", { ascending: true });
      if (!error && data) return data as ProduitDB[];
    } catch { /* Supabase indisponible */ }
  }
  // Fallback localStorage
  if (typeof window !== "undefined") {
    const local = localStorage.getItem(`nyosi_boutique_${slug}`);
    if (local) {
      const b = JSON.parse(local);
      return (b.produits ?? []).map(
        (p: { nom: string; prix: string; description?: string; photo?: string }, i: number) => ({
          id: `local-${i}`, boutique_slug: slug,
          nom: p.nom, prix: p.prix,
          description: p.description ?? "", photo: p.photo ?? "", ordre: i,
        })
      );
    }
  }
  return [];
}

export async function ajouterProduit(
  slug: string,
  produit: { nom: string; prix: string; description: string; photo: string; ordre: number }
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("produits").insert({ boutique_slug: slug, ...produit });
    return !error;
  } catch {
    return false;
  }
}

export async function mettreAJourProduit(
  produitId: string,
  data: Partial<Pick<ProduitDB, "nom" | "prix" | "description" | "photo">>
): Promise<boolean> {
  if (!supabase || produitId.startsWith("local-")) return false;
  try {
    const { error } = await supabase.from("produits").update(data).eq("id", produitId);
    return !error;
  } catch {
    return false;
  }
}

export async function supprimerProduit(produitId: string): Promise<boolean> {
  if (!supabase || produitId.startsWith("local-")) return false;
  try {
    const { error } = await supabase.from("produits").delete().eq("id", produitId);
    return !error;
  } catch {
    return false;
  }
}

/* ── Commandes ────────────────────────────────────────────────────── */

export async function getCommandes(slug: string): Promise<CommandeDetail[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("boutique_slug", slug)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as CommandeDetail[];
  } catch {
    return [];
  }
}

export async function mettreAJourStatut(
  orderId: string,
  statut: StatutCommande
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("orders").update({ statut }).eq("id", orderId);
    return !error;
  } catch {
    return false;
  }
}
