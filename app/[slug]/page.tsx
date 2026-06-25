"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Produit = {
  nom: string;
  prix: string;
  description: string;
};

type Boutique = {
  slug: string;
  nom: string;
  categorie: string;
  whatsapp: string;
  facebook: string;
  description: string;
  ville: string;
  produits: Produit[];
};

function formatPrix(prix: string) {
  const n = parseInt(prix, 10);
  if (isNaN(n)) return prix + " FCFA";
  return n.toLocaleString("fr-FR") + " FCFA";
}

export default function PageBoutique() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [boutique, setBoutique] = useState<Boutique | null>(null);
  const [chargement, setChargement] = useState(true);
  const [partageEtat, setPartageEtat] = useState<"idle" | "copie">("idle");

  useEffect(() => {
    const data = localStorage.getItem(`nyosi_boutique_${slug}`);
    if (data) {
      setBoutique(JSON.parse(data));
    }
    setChargement(false);
  }, [slug]);

  async function partagerBoutique() {
    const lien = window.location.href;
    const texte = `Voici ma boutique Nyosi. Commande ici : ${lien}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: boutique?.nom ?? "Boutique Nyosi", text: texte });
      } catch {
        // annulé par l'utilisateur
      }
    } else {
      navigator.clipboard.writeText(lien).then(() => {
        setPartageEtat("copie");
        setTimeout(() => setPartageEtat("idle"), 3000);
      });
    }
  }

  function commanderProduit(produit: Produit) {
    if (!boutique) return;
    const numero = boutique.whatsapp.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Bonjour, je veux commander : ${produit.nom} à ${formatPrix(produit.prix)} dans votre boutique Nyosi "${boutique.nom}".`
    );
    window.open(`https://wa.me/${numero}?text=${message}`, "_blank");
  }

  /* ── CHARGEMENT ── */
  if (chargement) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">Chargement…</p>
      </div>
    );
  }

  /* ── BOUTIQUE INTROUVABLE ── */
  if (!boutique) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-6">
          <Image src="/logo.png" alt="Nyosi" width={120} height={46} priority />
        </div>
        <h1 className="text-xl font-bold text-black mb-3">Boutique introuvable</h1>
        <p className="text-gray-500 text-sm max-w-xs mb-6">
          Cette boutique n&apos;existe pas encore ou n&apos;est pas disponible sur cet appareil.
        </p>
        <a
          href="/creer-boutique"
          className="bg-[#FCB001] text-black font-bold px-6 py-4 rounded-2xl text-base"
        >
          Créer ma boutique
        </a>
      </div>
    );
  }

  const produits = boutique.produits ?? [];

  /* ── PAGE BOUTIQUE ── */
  return (
    <div className="min-h-screen bg-white">

      {/* Barre Nyosi */}
      <div className="bg-[#FCB001] px-4 py-2 flex items-center justify-between">
        <a href="/">
          <Image src="/logo.png" alt="Nyosi" width={80} height={30} priority />
        </a>
        <span className="text-xs text-black/60 font-medium">nyosi.cm</span>
      </div>

      {/* En-tête boutique */}
      <header className="bg-black text-white px-4 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Image src="/logo-icon.png" alt="" width={16} height={16} />
          <p className="text-[#FCB001] text-sm font-semibold">{boutique.categorie}</p>
        </div>
        <h1 className="text-3xl font-bold mb-1">{boutique.nom}</h1>
        <p className="text-gray-400 text-sm">📍 {boutique.ville}</p>
        {boutique.description && (
          <p className="text-gray-300 text-sm mt-3 leading-relaxed">{boutique.description}</p>
        )}
      </header>

      {/* Facebook */}
      {boutique.facebook && (
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <span className="text-sm text-gray-500">Page Facebook :</span>
          <span className="text-sm text-black font-medium">{boutique.facebook}</span>
        </div>
      )}

      {/* ── PRODUITS ── */}
      {produits.length > 0 && (
        <section className="px-4 pt-6 pb-2">
          <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-4">
            Nos produits
          </h2>
          <div className="flex flex-col gap-4">
            {produits.map((produit, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-base leading-tight">{produit.nom}</p>
                  {produit.description && (
                    <p className="text-gray-500 text-sm mt-0.5 leading-snug">{produit.description}</p>
                  )}
                  <p className="text-black font-bold text-lg mt-1">{formatPrix(produit.prix)}</p>
                </div>
                <button
                  onClick={() => commanderProduit(produit)}
                  className="bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold px-4 py-3 rounded-xl text-sm transition-colors whitespace-nowrap shrink-0"
                >
                  Commander
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── ACTIONS ── */}
      <section className="px-4 py-6 flex flex-col gap-3">

        {/* Partager */}
        <button
          onClick={partagerBoutique}
          className="w-full bg-black text-[#FCB001] font-bold py-4 rounded-2xl text-base transition-colors active:opacity-80 flex items-center justify-center gap-2"
        >
          <Image src="/logo-icon.png" alt="" width={18} height={18} />
          {partageEtat === "copie"
            ? "Lien copié. Colle-le sur WhatsApp ou Facebook."
            : "Partager la boutique"}
        </button>

        {/* Contact */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-3">
            Contact du vendeur
          </p>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <p className="text-black font-bold text-base">{boutique.whatsapp}</p>
              <p className="text-gray-500 text-xs">WhatsApp</p>
            </div>
          </div>
          {boutique.facebook && (
            <div className="flex items-center gap-3 mt-3">
              <span className="text-2xl">📘</span>
              <div>
                <p className="text-black font-bold text-sm break-all">{boutique.facebook}</p>
                <p className="text-gray-500 text-xs">Facebook</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pied de page */}
      <footer className="text-center py-8 px-4">
        <div className="flex items-center justify-center mb-1">
          <Image src="/logo.png" alt="Nyosi" width={60} height={23} />
        </div>
        <p className="text-gray-400 text-xs mt-1">Boutique créée avec Nyosi · nyosi.cm</p>
      </footer>
    </div>
  );
}
