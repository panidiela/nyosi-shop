"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    const data = localStorage.getItem(`nyosi_boutique_${slug}`);
    if (data) setBoutique(JSON.parse(data));
    setChargement(false);
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
  function validerCommande(e: React.FormEvent) {
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

  /* ── CHARGEMENT ── */
  if (chargement) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">Chargement…</p>
    </div>
  );

  /* ── INTROUVABLE ── */
  if (!boutique) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6">
        <Image src="/logo.png" alt="Nyosi" width={120} height={46} priority />
      </div>
      <h1 className="text-xl font-bold text-black mb-3">Boutique introuvable</h1>
      <p className="text-gray-500 text-sm max-w-xs mb-6">
        Cette boutique n&apos;existe pas encore ou n&apos;est pas disponible sur cet appareil.
      </p>
      <a href="/creer-boutique" className="bg-[#FCB001] text-black font-bold px-6 py-4 rounded-2xl text-base">
        Créer ma boutique
      </a>
    </div>
  );

  const produits = boutique.produits ?? [];

  /* ── CONFIRMATION ── */
  if (ecran === "confirmation") return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-sm w-full text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-bold text-black mb-1">Commande enregistrée !</h2>
        <div className="bg-[#FCB001] rounded-xl px-4 py-3 my-4 inline-block">
          <p className="text-black font-bold text-xl tracking-wider">{numeroCommande}</p>
        </div>
        <p className="text-gray-700 text-sm mb-4">
          Merci <strong>{commande.nom}</strong> ! Votre commande chez{" "}
          <strong>{boutique.nom}</strong> a bien été enregistrée.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left text-sm text-gray-600 space-y-1">
          <p>📍 Livraison : {commande.quartier}, {commande.ville}</p>
          <p>📅 Date : {commande.date}</p>
          <p>🕐 Heure : {commande.heure}</p>
          {panier.map((l) => (
            <p key={l.produit.nom}>
              • {l.produit.nom} × {l.quantite} — {formatPrix(parseInt(l.produit.prix, 10) * l.quantite)}
            </p>
          ))}
          <p className="font-bold text-black pt-1">Total : {formatPrix(totalPanier)}</p>
        </div>

        <div className="bg-black rounded-xl px-4 py-3 mb-5">
          <p className="text-[#FCB001] text-sm font-semibold">
            💳 Paiement à la livraison
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Le commerçant vous contactera si nécessaire.
          </p>
        </div>

        <button
          onClick={() => { setEcran("boutique"); setPanier([]); }}
          className="w-full bg-[#FCB001] text-black font-bold py-3 rounded-xl text-base"
        >
          Retour à la boutique
        </button>
      </div>
    </div>
  );

  /* ── FORMULAIRE COMMANDE ── */
  if (ecran === "commande") return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#FCB001] px-4 py-3 flex items-center gap-3">
        <button onClick={() => setEcran("boutique")} className="text-black font-bold text-xl">←</button>
        <Image src="/logo.png" alt="Nyosi" width={70} height={26} priority />
        <span className="text-black font-semibold text-sm ml-1">Ma commande</span>
      </div>

      <div className="bg-black text-white px-4 py-4">
        <p className="text-[#FCB001] text-sm font-semibold mb-2">Récapitulatif</p>
        {panier.map((l) => (
          <div key={l.produit.nom} className="flex justify-between text-sm text-gray-300 mb-1">
            <span>{l.produit.nom} × {l.quantite}</span>
            <span className="font-semibold text-white">
              {formatPrix(parseInt(l.produit.prix, 10) * l.quantite)}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-600 mt-2 pt-2 flex justify-between">
          <span className="text-white font-bold">Total</span>
          <span className="text-[#FCB001] font-bold text-lg">{formatPrix(totalPanier)}</span>
        </div>
      </div>

      <main className="px-4 py-6">
        <form onSubmit={validerCommande} className="flex flex-col gap-5">

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vos informations</p>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text" placeholder="Ex : Audrey Mballa"
              value={commande.nom} onChange={(e) => setChamp("nom", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel" placeholder="Ex : 6XX XXX XXX"
              value={commande.telephone} onChange={(e) => setChamp("telephone", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
            />
          </div>

          <div className="border-t border-gray-100 pt-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Livraison</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Ville <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" placeholder="Ex : Yaoundé"
                  value={commande.ville} onChange={(e) => setChamp("ville", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Quartier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" placeholder="Ex : Bastos"
                  value={commande.quartier} onChange={(e) => setChamp("quartier", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Adresse ou point de repère <span className="text-red-500">*</span>
              </label>
              <input
                type="text" placeholder="Ex : Près de la pharmacie Biyem-Assi"
                value={commande.adresse} onChange={(e) => setChamp("adresse", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={commande.date} onChange={(e) => setChamp("date", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Heure <span className="text-red-500">*</span>
                </label>
                <select
                  value={commande.heure} onChange={(e) => setChamp("heure", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001] bg-white appearance-none"
                >
                  <option value="">Heure</option>
                  {heuresDisponibles.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Instructions
                <span className="ml-1 text-gray-400 font-normal">(optionnel)</span>
              </label>
              <textarea
                placeholder="Ex : Appelle avant de venir. Je suis au 3ème étage."
                value={commande.instructions} onChange={(e) => setChamp("instructions", e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001] resize-none"
              />
            </div>
          </div>

          {/* Paiement */}
          <div className="border border-[#FCB001]/40 rounded-xl p-4 bg-[#FCB001]/5">
            <p className="text-sm font-bold text-gray-700 mb-2">Paiement</p>
            <label className="flex items-center gap-3">
              <input type="radio" defaultChecked className="accent-[#FCB001] w-5 h-5" />
              <span className="text-gray-900 font-medium">💵 Payer à la livraison</span>
            </label>
            <p className="text-xs text-gray-500 mt-2 ml-8">Cash ou Mobile Money à la réception.</p>
          </div>

          {erreurCommande && (
            <p className="text-red-500 text-sm text-center">{erreurCommande}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold py-4 rounded-xl text-base transition-colors"
          >
            Confirmer ma commande
          </button>

          <p className="text-center text-gray-400 text-xs pb-4">
            Le commerçant vous contactera si nécessaire.
          </p>
        </form>
      </main>
    </div>
  );

  /* ── BOUTIQUE ── */
  return (
    <div className="min-h-screen bg-white pb-32">

      {/* Barre Nyosi */}
      <div className="bg-[#FCB001] px-4 py-2 flex items-center justify-between">
        <a href="/"><Image src="/logo.png" alt="Nyosi" width={80} height={30} priority /></a>
        <span className="text-xs text-black/60 font-medium">nyosi.cm</span>
      </div>

      {/* En-tête */}
      <header className="bg-black text-white px-4 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Image src="/logo-icon.png" alt="" width={16} height={16} />
          <p className="text-[#FCB001] text-sm font-semibold">{boutique.categorie}</p>
        </div>
        <h1 className="text-3xl font-bold mb-1">{boutique.nom}</h1>
        <p className="text-gray-400 text-sm">
          📍 {boutique.quartier ? `${boutique.quartier}, ` : ""}{boutique.ville}
        </p>
        {boutique.description && (
          <p className="text-gray-300 text-sm mt-3 leading-relaxed">{boutique.description}</p>
        )}
      </header>

      {boutique.facebook && (
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <span className="text-sm text-gray-500">Facebook :</span>
          <span className="text-sm text-black font-medium">{boutique.facebook}</span>
        </div>
      )}

      {/* Produits */}
      {produits.length > 0 && (
        <section className="px-4 pt-6 pb-2">
          <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-4">
            Nos produits
          </h2>
          <div className="flex flex-col gap-4">
            {produits.map((produit, i) => {
              const q = qte(produit);
              return (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

                  {/* Photo ou placeholder */}
                  {produit.photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={produit.photo}
                      alt={produit.nom}
                      className="w-full aspect-[4/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-gray-100 flex flex-col items-center justify-center gap-1 text-gray-300">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span className="text-xs">Photo produit</span>
                    </div>
                  )}

                  {/* Infos produit */}
                  <div className="p-4">
                    <p className="font-bold text-gray-900 text-base leading-tight">{produit.nom}</p>
                    {produit.description && (
                      <p className="text-gray-500 text-sm mt-0.5">{produit.description}</p>
                    )}
                    <p className="text-black font-bold text-lg mt-1 mb-3">{formatPrix(produit.prix)}</p>

                    {q === 0 ? (
                      <button
                        onClick={() => changerQuantite(produit, 1)}
                        className="w-full bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold py-3 rounded-xl text-sm transition-colors"
                      >
                        Ajouter au panier
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                        <button
                          onClick={() => changerQuantite(produit, -1)}
                          className="w-10 h-10 bg-black text-[#FCB001] font-bold rounded-xl text-xl flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="font-bold text-black text-lg">{q}</span>
                        <button
                          onClick={() => changerQuantite(produit, 1)}
                          className="w-10 h-10 bg-[#FCB001] text-black font-bold rounded-xl text-xl flex items-center justify-center"
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
      <section className="px-4 py-6 flex flex-col gap-3">
        <button
          onClick={partagerBoutique}
          className="w-full bg-black text-[#FCB001] font-bold py-4 rounded-2xl text-base active:opacity-80 flex items-center justify-center gap-2"
        >
          <Image src="/logo-icon.png" alt="" width={18} height={18} />
          {partageEtat === "copie" ? "Lien copié !" : "Partager la boutique"}
        </button>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">Contact</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <p className="text-black font-bold">{boutique.whatsapp}</p>
              <p className="text-gray-500 text-xs">WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 px-4">
        <Image src="/logo.png" alt="Nyosi" width={60} height={23} className="mx-auto mb-1" />
        <p className="text-gray-400 text-xs">Boutique créée avec Nyosi · nyosi.cm</p>
      </footer>

      {/* Barre panier flottante */}
      {nbArticles > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white border-t border-gray-100 shadow-lg">
          <button
            onClick={() => { setEcran("commande"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="w-full bg-[#FCB001] text-black font-bold py-4 rounded-2xl text-base flex items-center justify-between px-5"
          >
            <span>Commander</span>
            <span className="bg-black text-[#FCB001] rounded-xl px-3 py-1 text-sm font-bold">
              {nbArticles} article{nbArticles > 1 ? "s" : ""} · {formatPrix(totalPanier)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
