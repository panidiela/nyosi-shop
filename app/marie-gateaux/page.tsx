"use client";

import Image from "next/image";
import { useState } from "react";

const produits = [
  { id: 1, nom: "Gâteau chocolat 20 personnes", prix: 15000, description: "Parfum chocolat noir, idéal pour anniversaires." },
  { id: 2, nom: "Gâteau vanille 10 personnes", prix: 8000, description: "Moelleux à la vanille, décoré à la crème." },
  { id: 3, nom: "Cake marbré", prix: 5000, description: "Marbré chocolat-vanille, parfait pour le goûter." },
];

function formatPrix(prix: number) {
  return prix.toLocaleString("fr-FR") + " FCFA";
}

const inputCls = "w-full border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base text-[#1A1A1A] placeholder-[#667781] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]";

export default function BoutiqueMarie() {
  const [produitChoisi, setProduitChoisi] = useState<(typeof produits)[0] | null>(null);
  const [formulaireVisible, setFormulaireVisible] = useState(false);
  const [commande, setCommande] = useState({ prenom: "", quartier: "", date: "", telephone: "" });
  const [commandeEnvoyee, setCommandeEnvoyee] = useState(false);
  const [erreur, setErreur] = useState("");

  function ouvrirFormulaire(produit: (typeof produits)[0]) {
    setProduitChoisi(produit);
    setFormulaireVisible(true);
    setCommandeEnvoyee(false);
    setErreur("");
  }

  function fermerFormulaire() {
    setFormulaireVisible(false);
    setProduitChoisi(null);
    setCommande({ prenom: "", quartier: "", date: "", telephone: "" });
    setErreur("");
  }

  function validerCommande(e: React.FormEvent) {
    e.preventDefault();
    if (!commande.prenom || !commande.quartier || !commande.date || !commande.telephone) {
      setErreur("Merci de remplir tous les champs.");
      return;
    }
    setCommandeEnvoyee(true);
    setErreur("");
  }

  /* ── CONFIRMATION ── */
  if (commandeEnvoyee && produitChoisi) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md p-6 max-w-sm w-full text-center">

          <div className="w-24 h-24 rounded-full bg-[#25D366] flex items-center justify-center mx-auto mb-5 pop-in">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <Image src="/logo.png" alt="Nyosi" width={80} height={31} priority className="mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Commande enregistrée !</h2>
          <p className="text-[#667781] text-sm mb-5">
            Merci <strong className="text-[#1A1A1A]">{commande.prenom}</strong> !{" "}
            Ta commande de <strong className="text-[#1A1A1A]">{produitChoisi.nom}</strong> ({formatPrix(produitChoisi.prix)}) a bien été reçue.
          </p>

          <div className="bg-[#F0F2F5] rounded-xl p-4 mb-4 text-left text-sm text-[#667781] space-y-1.5">
            <p>📍 Livraison : <strong className="text-[#1A1A1A]">{commande.quartier}</strong></p>
            <p>📅 Date : <strong className="text-[#1A1A1A]">{commande.date}</strong></p>
            <p className="font-bold text-[#25D366] text-base pt-1">{formatPrix(produitChoisi.prix)}</p>
          </div>

          <div className="bg-[#075E54] rounded-xl px-4 py-3 mb-5">
            <p className="text-white text-sm font-semibold">💳 Paiement à la livraison</p>
            <p className="text-white/60 text-xs mt-1">
              Marie te contactera au {commande.telephone} pour confirmer.
            </p>
          </div>

          <button
            onClick={fermerFormulaire}
            className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-3 rounded-xl text-base"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  /* ── BOUTIQUE ── */
  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-8">

      {/* Header vert */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <a href="/"><Image src="/logo.png" alt="Nyosi" width={80} height={30} priority className="brightness-0 invert" /></a>
        <span className="text-white/50 text-xs font-medium">nyosi.cm</span>
      </div>

      {/* En-tête boutique */}
      <div className="bg-[#075E54] px-4 pt-5 pb-10">
        <p className="text-[#25D366] text-xs font-semibold uppercase tracking-wide mb-2">🍰 Pâtisserie artisanale</p>
        <h1 className="text-white text-3xl font-bold mb-1">Marie Gâteaux</h1>
        <p className="text-white/60 text-sm leading-relaxed">
          Gâteaux faits maison à Yaoundé. Anniversaires, baptêmes et cérémonies. Livraison dans tout Yaoundé.
        </p>
      </div>

      {/* Carte de bienvenue */}
      <div className="px-4 -mt-5">
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 card-fade-in">
          <p className="text-[#1A1A1A] font-semibold text-base mb-1">
            Bonjour 👋 Commandez directement sans m&apos;écrire.
          </p>
          <p className="text-[#667781] text-sm">Livraison disponible à Yaoundé.</p>
        </div>

        {/* 3 mini-badges */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg mb-0.5">⭐</p>
            <p className="text-[#1A1A1A] text-xs font-bold">Fiable</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg mb-0.5">📍</p>
            <p className="text-[#1A1A1A] text-xs font-bold">Yaoundé</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg mb-0.5">🚚</p>
            <p className="text-[#1A1A1A] text-xs font-bold">À la livraison</p>
          </div>
        </div>

        {/* Produits */}
        <h2 className="text-xs font-bold text-[#667781] uppercase tracking-widest mb-3">
          Nos gâteaux
        </h2>
        <div className="flex flex-col gap-3 mb-6">
          {produits.map((produit, i) => (
            <div
              key={produit.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden card-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Placeholder photo */}
              <div className="w-full aspect-[4/3] bg-[#F0F2F5] flex flex-col items-center justify-center gap-1">
                <span className="text-4xl">🎂</span>
              </div>

              <div className="p-4">
                <p className="font-bold text-[#1A1A1A] text-base leading-tight">{produit.nom}</p>
                <p className="text-[#667781] text-sm mt-0.5">{produit.description}</p>
                <p className="text-[#25D366] font-bold text-lg mt-1 mb-3">{formatPrix(produit.prix)}</p>

                <button
                  onClick={() => ouvrirFormulaire(produit)}
                  className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  Commander
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-4 flex items-center gap-3 mb-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.524 5.832L.524 22.5l4.8-.96C6.949 22.487 9.425 23 12 23c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21c-2.394 0-4.617-.734-6.458-1.985l-.463-.277-2.842.567.594-2.768-.3-.482C1.65 14.596 1 13.367 1 12 1 5.924 5.924 1 12 1s11 4.924 11 11-4.924 11-11 11z"/>
            </svg>
          </div>
          <div>
            <p className="text-[#1A1A1A] font-bold">6XX XXX XXX</p>
            <p className="text-[#667781] text-xs">WhatsApp — Marie Gâteaux</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4">
          <Image src="/logo.png" alt="Nyosi" width={56} height={22} className="mx-auto mb-1" />
          <p className="text-[#667781] text-xs">Boutique créée avec Nyosi · nyosi.cm</p>
        </footer>
      </div>

      {/* Bottom sheet formulaire */}
      {formulaireVisible && produitChoisi && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[92vh] overflow-y-auto sheet-slide-up">

            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#E8E8E4]"></div>
            </div>

            <div className="px-5 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#1A1A1A]">Votre commande</h2>
                <button
                  onClick={fermerFormulaire}
                  className="w-8 h-8 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[#667781] text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Rappel produit */}
              <div className="bg-[#F0F2F5] border border-[#E8E8E4] rounded-xl p-3 mb-5 flex items-center justify-between">
                <span className="text-[#1A1A1A] font-semibold text-sm">{produitChoisi.nom}</span>
                <span className="text-[#25D366] font-bold text-sm">{formatPrix(produitChoisi.prix)}</span>
              </div>

              <form onSubmit={validerCommande} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Votre prénom</label>
                  <input
                    type="text" placeholder="Ex : Audrey"
                    value={commande.prenom}
                    onChange={(e) => setCommande({ ...commande, prenom: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Quartier de livraison</label>
                  <input
                    type="text" placeholder="Ex : Bastos, Melen, Omnisports…"
                    value={commande.quartier}
                    onChange={(e) => setCommande({ ...commande, quartier: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Date souhaitée</label>
                  <input
                    type="date"
                    value={commande.date}
                    onChange={(e) => setCommande({ ...commande, date: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Numéro de téléphone</label>
                  <input
                    type="tel" placeholder="Ex : 6XX XXX XXX"
                    value={commande.telephone}
                    onChange={(e) => setCommande({ ...commande, telephone: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div className="border border-[#25D366]/30 rounded-xl p-4 bg-[#25D366]/5">
                  <p className="text-sm font-bold text-[#1A1A1A] mb-2">Paiement</p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="paiement" defaultChecked className="accent-[#25D366] w-5 h-5" />
                    <span className="text-[#1A1A1A] font-medium">💵 Payer à la livraison</span>
                  </label>
                  <p className="text-xs text-[#667781] mt-2 ml-8">Cash ou Mobile Money à la réception.</p>
                </div>

                {erreur && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-red-600 text-sm text-center">{erreur}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-xl text-base transition-colors mt-1"
                >
                  Confirmer ma commande
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
