"use client";

import Image from "next/image";
import { useState } from "react";

const produits = [
  { id: 1, nom: "Gâteau chocolat 20 personnes", prix: 15000 },
  { id: 2, nom: "Gâteau vanille 10 personnes", prix: 8000 },
  { id: 3, nom: "Cake marbré", prix: 5000 },
];

function formatPrix(prix: number) {
  return prix.toLocaleString("fr-FR") + " FCFA";
}

function LogoNyosi() {
  return (
    <Image
      src="/logo.png"
      alt="Nyosi"
      width={80}
      height={30}
      priority
    />
  );
}

export default function BoutiqueMarie() {
  const [produitChoisi, setProduitChoisi] = useState<(typeof produits)[0] | null>(null);
  const [formulaireVisible, setFormulaireVisible] = useState(false);
  const [commande, setCommande] = useState({
    prenom: "",
    quartier: "",
    date: "",
    telephone: "",
  });
  const [commandeEnvoyee, setCommandeEnvoyee] = useState(false);
  const [erreur, setErreur] = useState("");

  function ouvrirFormulaire(produit: (typeof produits)[0]) {
    setProduitChoisi(produit);
    setFormulaireVisible(true);
    setCommandeEnvoyee(false);
    setErreur("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  /* ── PAGE CONFIRMATION ── */
  if (commandeEnvoyee && produitChoisi) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md p-6 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-black mb-2">Commande reçue !</h2>
          <p className="text-gray-700 mb-4">
            Merci <strong>{commande.prenom}</strong> ! Ta commande de{" "}
            <strong>{produitChoisi.nom}</strong> ({formatPrix(produitChoisi.prix)}) a bien été
            reçue.
          </p>
          <p className="text-gray-600 mb-2">
            📍 Livraison à : <strong>{commande.quartier}</strong>
          </p>
          <p className="text-gray-600 mb-4">
            📅 Date souhaitée : <strong>{commande.date}</strong>
          </p>
          <div className="bg-[#FCB001]/10 border border-[#FCB001]/30 rounded-xl p-4 mb-5">
            <p className="text-black font-semibold">💳 Paiement à la livraison</p>
            <p className="text-gray-600 text-sm mt-1">
              Tu règles en cash ou Mobile Money quand Marie livre ton gâteau. 🍰
            </p>
          </div>
          <p className="text-gray-500 text-sm mb-5">
            Marie te contactera au <strong>{commande.telephone}</strong> pour confirmer.
          </p>
          <button
            onClick={fermerFormulaire}
            className="w-full bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold py-3 rounded-xl text-base transition-colors"
          >
            Retour à la boutique
          </button>
        </div>

        {/* Badge Nyosi */}
        <div className="mt-8 flex items-center gap-2 opacity-60">
          <LogoNyosi />
          <span className="text-xs text-gray-500">nyosi.cm</span>
        </div>
      </div>
    );
  }

  /* ── PAGE BOUTIQUE ── */
  return (
    <div className="min-h-screen bg-white">

      {/* Barre Nyosi en haut */}
      <div className="bg-[#FCB001] px-4 py-2 flex items-center justify-between">
        <LogoNyosi />
        <span className="text-xs text-black/60 font-medium">nyosi.cm</span>
      </div>

      {/* En-tête boutique */}
      <header className="bg-black text-white px-4 pt-8 pb-6">
        <p className="text-[#FCB001] text-sm font-semibold mb-1">🍰 Pâtisserie artisanale</p>
        <h1 className="text-3xl font-bold mb-2">Marie Gâteaux</h1>
        <p className="text-gray-300 text-base leading-relaxed">
          Gâteaux faits maison à Yaoundé. Commandez pour vos anniversaires, baptêmes et
          cérémonies. Livraison dans tout Yaoundé. 🎂
        </p>
      </header>

      {/* Formulaire de commande (modal bottom sheet) */}
      {formulaireVisible && produitChoisi && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Votre commande</h2>
              <button
                onClick={fermerFormulaire}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Rappel produit */}
            <div className="bg-[#FCB001]/10 border border-[#FCB001]/40 rounded-xl p-3 mb-5 flex items-center justify-between">
              <span className="text-gray-800 font-medium text-sm">{produitChoisi.nom}</span>
              <span className="text-black font-bold text-sm">
                {formatPrix(produitChoisi.prix)}
              </span>
            </div>

            <form onSubmit={validerCommande} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Votre prénom
                </label>
                <input
                  type="text"
                  placeholder="Ex : Audrey"
                  value={commande.prenom}
                  onChange={(e) => setCommande({ ...commande, prenom: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Quartier de livraison
                </label>
                <input
                  type="text"
                  placeholder="Ex : Bastos, Melen, Omnisports…"
                  value={commande.quartier}
                  onChange={(e) => setCommande({ ...commande, quartier: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Date souhaitée
                </label>
                <input
                  type="date"
                  value={commande.date}
                  onChange={(e) => setCommande({ ...commande, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  placeholder="Ex : 6XX XXX XXX"
                  value={commande.telephone}
                  onChange={(e) => setCommande({ ...commande, telephone: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                />
              </div>

              {/* Paiement */}
              <div className="border border-[#FCB001]/40 rounded-xl p-4 bg-[#FCB001]/5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Mode de paiement</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paiement"
                    defaultChecked
                    className="accent-[#FCB001] w-5 h-5"
                  />
                  <span className="text-gray-900 font-medium">💵 Payer à la livraison</span>
                </label>
                <p className="text-xs text-gray-500 mt-2 ml-8">
                  Cash ou Mobile Money à la réception de votre gâteau.
                </p>
              </div>

              {erreur && (
                <p className="text-red-500 text-sm text-center">{erreur}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold py-4 rounded-xl text-base transition-colors mt-1"
              >
                Confirmer ma commande 🎂
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Liste des produits */}
      <main className="px-4 py-6">
        <h2 className="text-base font-bold text-gray-800 mb-4 uppercase tracking-wide">
          Nos gâteaux
        </h2>
        <div className="flex flex-col gap-4">
          {produits.map((produit) => (
            <div
              key={produit.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex items-center justify-between gap-3"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base leading-tight">
                  {produit.nom}
                </p>
                <p className="text-black font-bold text-lg mt-1">
                  {formatPrix(produit.prix)}
                </p>
              </div>
              <button
                onClick={() => ouvrirFormulaire(produit)}
                className="bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold px-4 py-3 rounded-xl text-sm transition-colors whitespace-nowrap"
              >
                Commander
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Pied de page */}
      <footer className="text-center text-gray-400 text-xs py-8 px-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <LogoNyosi />
        </div>
        <p className="mt-1">nyosi.cm</p>
      </footer>
    </div>
  );
}
