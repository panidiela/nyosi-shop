"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { lireBoutique, sauvegarderCommande } from "@/lib/boutique";

type Produit = { nom: string; prix: string; description: string; photo?: string };
type Boutique = {
  slug: string; nom: string; categorie: string; whatsapp: string;
  facebook: string; description: string; ville: string; quartier: string;
  produits: Produit[];
};
type LignePanier = { produit: Produit; quantite: number };
type EcranActuel = "boutique" | "commande" | "confirmation";

function formatPrix(prix: string | number) {
  const n = typeof prix === "string" ? parseInt(prix, 10) : prix;
  if (isNaN(n)) return prix + " FCFA";
  return n.toLocaleString("fr-FR") + " FCFA";
}

function genererNumeroCommande() {
  const compteur = parseInt(localStorage.getItem("nyosi_order_counter") ?? "0", 10) + 1;
  localStorage.setItem("nyosi_order_counter", String(compteur));
  return `NY-${String(compteur).padStart(4, "0")}`;
}

const heuresDisponibles = Array.from({ length: 14 }, (_, i) => {
  const h = i + 7;
  return `${String(h).padStart(2, "0")}:00`;
});

export default function PageBoutique() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [boutique, setBoutique] = useState<Boutique | null>(null);
  const [chargement, setChargement] = useState(true);
  const [panier, setPanier] = useState<LignePanier[]>([]);
  const [ecran, setEcran] = useState<EcranActuel>("boutique");
  const [numeroCommande, setNumeroCommande] = useState("");
  const [partageEtat, setPartageEtat] = useState<"idle" | "copie">("idle");

  const [commande, setCommande] = useState({
    nom: "", telephone: "", ville: "", quartier: "",
    adresse: "", date: "", heure: "", instructions: "",
  });
  const [erreurCommande, setErreurCommande] = useState("");

  useEffect(() => {
    lireBoutique(slug).then((b) => {
      setBoutique(b);
      setChargement(false);
    });
  }, [slug]);

  /* ── PANIER ── */
  const totalPanier = panier.reduce(
    (acc, l) => acc + parseInt(l.produit.prix, 10) * l.quantite, 0
  );
  const nbArticles = panier.reduce((acc, l) => acc + l.quantite, 0);

  function changerQuantite(produit: Produit, delta: number) {
    setPanier((prev) => {
      const existant = prev.find((l) => l.produit.nom === produit.nom);
      if (!existant) {
        if (delta > 0) return [...prev, { produit, quantite: 1 }];
        return prev;
      }
      const nvQte = existant.quantite + delta;
      if (nvQte <= 0) return prev.filter((l) => l.produit.nom !== produit.nom);
      return prev.map((l) => l.produit.nom === produit.nom ? { ...l, quantite: nvQte } : l);
    });
  }

  function qte(produit: Produit) {
    return panier.find((l) => l.produit.nom === produit.nom)?.quantite ?? 0;
  }

  function setChamp(champ: keyof typeof commande, val: string) {
    setCommande((c) => ({ ...c, [champ]: val }));
  }

  /* ── VALIDATION COMMANDE ── */
  async function validerCommande(e: React.FormEvent) {
    e.preventDefault();
    if (!commande.nom.trim()) return setErreurCommande("Le nom complet est obligatoire.");
    if (!commande.telephone.trim()) return setErreurCommande("Le téléphone est obligatoire.");
    if (!commande.ville.trim()) return setErreurCommande("La ville est obligatoire.");
    if (!commande.quartier.trim()) return setErreurCommande("Le quartier est obligatoire.");
    if (!commande.adresse.trim()) return setErreurCommande("L'adresse ou point de repère est obligatoire.");
    if (!commande.date) return setErreurCommande("La date de livraison est obligatoire.");
    if (!commande.heure) return setErreurCommande("L'heure de livraison est obligatoire.");
    setErreurCommande("");
    const num = genererNumeroCommande();
    setNumeroCommande(num);

    // Enregistrement dans Supabase (silencieux si non configuré)
    await sauvegarderCommande({
      boutique_slug: slug,
      numero: num,
      client_nom: commande.nom,
      client_telephone: commande.telephone,
      ville: commande.ville,
      quartier: commande.quartier,
      adresse: commande.adresse,
      date_livraison: commande.date,
      heure_livraison: commande.heure,
      instructions: commande.instructions,
      total: totalPanier,
      lignes: panier.map((l) => ({
        produit_nom: l.produit.nom,
        produit_prix: parseInt(l.produit.prix, 10),
        quantite: l.quantite,
        sous_total: parseInt(l.produit.prix, 10) * l.quantite,
      })),
    });

    setEcran("confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function partagerBoutique() {
    const lien = window.location.href;
    const texte = `Voici ma boutique Nyosi. Commande ici : ${lien}`;
    if (navigator.share) {
      try { await navigator.share({ title: boutique?.nom ?? "Boutique Nyosi", text: texte }); }
      catch { /* annulé */ }
    } else {
      navigator.clipboard.writeText(lien).then(() => {
        setPartageEtat("copie");
        setTimeout(() => setPartageEtat("idle"), 3000);
      });
    }
  }

  const inputCls = "w-full border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base text-[#1A1A1A] placeholder-[#667781] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]";

  /* ── CHARGEMENT ── */
  if (chargement) return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#667781] text-sm">Chargement…</p>
      </div>
    </div>
  );

  /* ── INTROUVABLE ── */
  if (!boutique) return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-xs w-full">
        <div className="w-16 h-16 rounded-full bg-[#F0F2F5] flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#667781" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <Image src="/logo.png" alt="Nyosi" width={80} height={31} priority className="mx-auto mb-4" />
        <h1 className="text-lg font-bold text-[#1A1A1A] mb-2">Boutique introuvable</h1>
        <p className="text-[#667781] text-sm mb-6">
          Cette boutique n&apos;existe pas encore ou n&apos;est pas disponible sur cet appareil.
        </p>
        <a href="/creer-boutique" className="block w-full bg-[#25D366] text-white font-bold px-6 py-4 rounded-2xl text-base text-center">
          Créer ma boutique
        </a>
      </div>
    </div>
  );

  const produits = boutique.produits ?? [];

  /* ── CONFIRMATION ── */
  if (ecran === "confirmation") return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-sm w-full text-center">

        {/* Grand check vert animé */}
        <div className="w-24 h-24 rounded-full bg-[#25D366] flex items-center justify-center mx-auto mb-5 pop-in">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">Commande confirmée !</h2>

        <div className="bg-[#075E54] rounded-xl px-6 py-3 my-4 inline-block">
          <p className="text-white font-bold text-xl tracking-widest">{numeroCommande}</p>
        </div>

        <p className="text-[#667781] text-sm mb-5">
          Merci <strong className="text-[#1A1A1A]">{commande.nom}</strong> ! Votre commande chez{" "}
          <strong className="text-[#1A1A1A]">{boutique.nom}</strong> a bien été enregistrée.
        </p>

        <div className="bg-[#F0F2F5] rounded-xl p-4 mb-4 text-left text-sm text-[#667781] space-y-1.5">
          <p>📍 Livraison : {commande.quartier}, {commande.ville}</p>
          <p>📅 Date : {commande.date}</p>
          <p>🕐 Heure : {commande.heure}</p>
          <div className="border-t border-[#E8E8E4] my-2"></div>
          {panier.map((l) => (
            <p key={l.produit.nom} className="text-[#1A1A1A]">
              • {l.produit.nom} × {l.quantite} — {formatPrix(parseInt(l.produit.prix, 10) * l.quantite)}
            </p>
          ))}
          <p className="font-bold text-[#075E54] pt-1 text-base">Total : {formatPrix(totalPanier)}</p>
        </div>

        <div className="bg-[#075E54] rounded-xl px-4 py-3 mb-5">
          <p className="text-white text-sm font-semibold">💳 Paiement à la livraison</p>
          <p className="text-white/60 text-xs mt-1">Le commerçant vous contactera si nécessaire.</p>
        </div>

        <button
          onClick={() => { setEcran("boutique"); setPanier([]); }}
          className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-3 rounded-xl text-base"
        >
          Retour à la boutique
        </button>
      </div>
    </div>
  );

  /* ── FORMULAIRE COMMANDE (bottom sheet style) ── */
  if (ecran === "commande") return (
    <div className="min-h-screen bg-[#F0F2F5]">

      {/* Header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => setEcran("boutique")}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <Image src="/logo.png" alt="Nyosi" width={70} height={26} priority className="brightness-0 invert" />
        <span className="text-white font-semibold text-sm">Ma commande</span>
      </div>

      {/* Récapitulatif panier */}
      <div className="bg-[#075E54] px-4 pt-2 pb-6">
        <p className="text-[#25D366] text-xs font-semibold uppercase tracking-wide mb-3">Récapitulatif</p>
        {panier.map((l) => (
          <div key={l.produit.nom} className="flex justify-between text-sm text-white/70 mb-1.5">
            <span>{l.produit.nom} × {l.quantite}</span>
            <span className="font-semibold text-white">
              {formatPrix(parseInt(l.produit.prix, 10) * l.quantite)}
            </span>
          </div>
        ))}
        <div className="border-t border-white/20 mt-3 pt-3 flex justify-between">
          <span className="text-white font-bold">Total</span>
          <span className="text-[#25D366] font-bold text-lg">{formatPrix(totalPanier)}</span>
        </div>
      </div>

      {/* Formulaire dans une carte blanche */}
      <main className="px-4 -mt-3 pb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 sheet-slide-up">
          <form onSubmit={validerCommande} className="flex flex-col gap-5">

            <p className="text-xs font-bold text-[#667781] uppercase tracking-widest">Vos informations</p>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text" placeholder="Ex : Audrey Mballa"
                value={commande.nom} onChange={(e) => setChamp("nom", e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel" placeholder="Ex : 6XX XXX XXX"
                value={commande.telephone} onChange={(e) => setChamp("telephone", e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="border-t border-[#E8E8E4] pt-4">
              <p className="text-xs font-bold text-[#667781] uppercase tracking-widest mb-4">Livraison</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" placeholder="Ex : Yaoundé"
                    value={commande.ville} onChange={(e) => setChamp("ville", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                    Quartier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" placeholder="Ex : Bastos"
                    value={commande.quartier} onChange={(e) => setChamp("quartier", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Adresse ou point de repère <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" placeholder="Ex : Près de la pharmacie Biyem-Assi"
                  value={commande.adresse} onChange={(e) => setChamp("adresse", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={commande.date} onChange={(e) => setChamp("date", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                    Heure <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={commande.heure} onChange={(e) => setChamp("heure", e.target.value)}
                    className={inputCls + " appearance-none"}
                  >
                    <option value="">Heure</option>
                    {heuresDisponibles.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Instructions
                  <span className="ml-1 text-[#667781] font-normal text-xs">(optionnel)</span>
                </label>
                <textarea
                  placeholder="Ex : Appelle avant de venir. Je suis au 3ème étage."
                  value={commande.instructions} onChange={(e) => setChamp("instructions", e.target.value)}
                  rows={3}
                  className={inputCls + " resize-none"}
                />
              </div>
            </div>

            <div className="border border-[#25D366]/30 rounded-xl p-4 bg-[#25D366]/5">
              <p className="text-sm font-bold text-[#1A1A1A] mb-2">Paiement</p>
              <label className="flex items-center gap-3">
                <input type="radio" defaultChecked className="accent-[#25D366] w-5 h-5" />
                <span className="text-[#1A1A1A] font-medium">💵 Payer à la livraison</span>
              </label>
              <p className="text-xs text-[#667781] mt-2 ml-8">Cash ou Mobile Money à la réception.</p>
            </div>

            {erreurCommande && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm text-center">{erreurCommande}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-xl text-base transition-colors"
            >
              Confirmer ma commande
            </button>

            <p className="text-center text-[#667781] text-xs pb-2">
              Le commerçant vous contactera si nécessaire.
            </p>
          </form>
        </div>
      </main>
    </div>
  );

  /* ── BOUTIQUE ── */
  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-32">

      {/* Header vert */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <a href="/"><Image src="/logo.png" alt="Nyosi" width={80} height={30} priority className="brightness-0 invert" /></a>
        <span className="text-white/50 text-xs font-medium">nyosi.cm</span>
      </div>

      {/* En-tête boutique */}
      <div className="bg-[#075E54] px-4 pt-5 pb-10">
        <p className="text-[#25D366] text-xs font-semibold uppercase tracking-wide mb-2">{boutique.categorie}</p>
        <h1 className="text-white text-3xl font-bold mb-1">{boutique.nom}</h1>
        <p className="text-white/60 text-sm">
          📍 {boutique.quartier ? `${boutique.quartier}, ` : ""}{boutique.ville}
        </p>
        {boutique.description && (
          <p className="text-white/70 text-sm mt-3 leading-relaxed">{boutique.description}</p>
        )}
      </div>

      {/* Carte de bienvenue */}
      <div className="px-4 -mt-5">
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 card-fade-in">
          <p className="text-[#1A1A1A] font-semibold text-base mb-1">
            Bonjour 👋 Commandez directement sans m&apos;écrire.
          </p>
          <p className="text-[#667781] text-sm">Livraison disponible.</p>
        </div>

        {/* 3 mini-badges info */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg mb-0.5">⭐</p>
            <p className="text-[#1A1A1A] text-xs font-bold">Fiable</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg mb-0.5">📍</p>
            <p className="text-[#1A1A1A] text-xs font-bold">{boutique.ville}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg mb-0.5">🚚</p>
            <p className="text-[#1A1A1A] text-xs font-bold">À la livraison</p>
          </div>
        </div>

        {/* Facebook si présent */}
        {boutique.facebook && (
          <div className="bg-white rounded-xl px-4 py-3 mb-4 flex items-center gap-2 shadow-sm">
            <span className="text-blue-600 font-bold text-sm">f</span>
            <span className="text-[#1A1A1A] text-sm">{boutique.facebook}</span>
          </div>
        )}

        {/* Produits */}
        {produits.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold text-[#667781] uppercase tracking-widest mb-3">
              Nos produits
            </h2>
            <div className="flex flex-col gap-3">
              {produits.map((produit, i) => {
                const q = qte(produit);
                return (
                  <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden card-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>

                    {produit.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={produit.photo}
                        alt={produit.nom}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-[#F0F2F5] flex flex-col items-center justify-center gap-1 text-[#E8E8E4]">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                      </div>
                    )}

                    <div className="p-4">
                      <p className="font-bold text-[#1A1A1A] text-base leading-tight">{produit.nom}</p>
                      {produit.description && (
                        <p className="text-[#667781] text-sm mt-0.5">{produit.description}</p>
                      )}
                      <p className="text-[#25D366] font-bold text-lg mt-1 mb-3">{formatPrix(produit.prix)}</p>

                      {q === 0 ? (
                        <button
                          onClick={() => changerQuantite(produit, 1)}
                          className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-3 rounded-xl text-sm transition-colors"
                        >
                          Ajouter au panier
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-[#F0F2F5] rounded-xl px-3 py-2">
                          <button
                            onClick={() => changerQuantite(produit, -1)}
                            className="w-10 h-10 bg-[#075E54] text-white font-bold rounded-xl text-xl flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="font-bold text-[#1A1A1A] text-lg">{q}</span>
                          <button
                            onClick={() => changerQuantite(produit, 1)}
                            className="w-10 h-10 bg-[#25D366] text-white font-bold rounded-xl text-xl flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Contact & Partager */}
        <section className="flex flex-col gap-3 mb-4">
          <button
            onClick={partagerBoutique}
            className="w-full bg-[#075E54] text-white font-bold py-4 rounded-2xl text-base active:opacity-80 flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {partageEtat === "copie" ? "Lien copié !" : "Partager cette boutique"}
          </button>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.524 5.832L.524 22.5l4.8-.96C6.949 22.487 9.425 23 12 23c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21c-2.394 0-4.617-.734-6.458-1.985l-.463-.277-2.842.567.594-2.768-.3-.482C1.65 14.596 1 13.367 1 12 1 5.924 5.924 1 12 1s11 4.924 11 11-4.924 11-11 11z"/>
              </svg>
            </div>
            <div>
              <p className="text-[#1A1A1A] font-bold">{boutique.whatsapp}</p>
              <p className="text-[#667781] text-xs">WhatsApp</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-4">
          <Image src="/logo.png" alt="Nyosi" width={56} height={22} className="mx-auto mb-1" />
          <p className="text-[#667781] text-xs">Boutique créée avec Nyosi · nyosi.cm</p>
        </footer>
      </div>

      {/* Barre panier flottante */}
      {nbArticles > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white border-t border-[#E8E8E4] shadow-xl">
          <button
            onClick={() => { setEcran("commande"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-2xl text-base flex items-center justify-between px-5"
          >
            <span>Commander</span>
            <span className="bg-white/20 rounded-xl px-3 py-1 text-sm font-bold">
              {nbArticles} article{nbArticles > 1 ? "s" : ""} · {formatPrix(totalPanier)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
