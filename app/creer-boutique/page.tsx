"use client";

import Image from "next/image";
import { useState } from "react";

const categories = [
  "Alimentation & Gâteaux",
  "Mode & Vêtements",
  "Beauté & Cosmétiques",
  "Artisanat & Décoration",
  "Électronique & Accessoires",
  "Santé & Bien-être",
  "Autre",
];

type Produit = {
  nom: string;
  prix: string;
  description: string;
};

const produitVide = (): Produit => ({ nom: "", prix: "", description: "" });

function slugify(nom: string) {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export default function CreerBoutique() {
  const [form, setForm] = useState({
    nom: "",
    categorie: "",
    whatsapp: "",
    facebook: "",
    description: "",
    ville: "",
  });
  const [produits, setProduits] = useState<Produit[]>([produitVide()]);
  const [erreur, setErreur] = useState("");
  const [boutiqueCree, setBoutiqueCree] = useState(false);
  const [lienCopie, setLienCopie] = useState(false);
  const [partageEtat, setPartageEtat] = useState<"idle" | "copie">("idle");
  const [slug, setSlug] = useState("");
  const [origine, setOrigine] = useState("nyosi-shop.vercel.app");

  const lien = `${origine}/${slug || slugify(form.nom) || "ma-boutique"}`;

  function set(champ: keyof typeof form, valeur: string) {
    setForm((f) => ({ ...f, [champ]: valeur }));
  }

  function setProduit(index: number, champ: keyof Produit, valeur: string) {
    setProduits((prev) => prev.map((p, i) => (i === index ? { ...p, [champ]: valeur } : p)));
  }

  function ajouterProduit() {
    if (produits.length < 3) {
      setProduits((prev) => [...prev, produitVide()]);
    }
  }

  function supprimerProduit(index: number) {
    if (produits.length > 1) {
      setProduits((prev) => prev.filter((_, i) => i !== index));
    }
  }

  function valider(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom.trim()) {
      setErreur("Le nom de la boutique est obligatoire.");
      return;
    }
    if (!form.categorie) {
      setErreur("Choisis une catégorie.");
      return;
    }
    if (!form.whatsapp.trim()) {
      setErreur("Le numéro WhatsApp est obligatoire.");
      return;
    }
    if (!form.ville.trim()) {
      setErreur("La ville ou le quartier est obligatoire.");
      return;
    }
    const premierProduit = produits[0];
    if (!premierProduit.nom.trim()) {
      setErreur("Ajoute au moins un produit avec un nom.");
      return;
    }
    if (!premierProduit.prix.trim()) {
      setErreur("Ajoute le prix de ton premier produit.");
      return;
    }
    setErreur("");

    const s = slugify(form.nom);
    const produitsValides = produits.filter((p) => p.nom.trim() && p.prix.trim());
    const boutique = { ...form, slug: s, produits: produitsValides };
    localStorage.setItem(`nyosi_boutique_${s}`, JSON.stringify(boutique));
    setSlug(s);
    setOrigine(window.location.host);

    setBoutiqueCree(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function copierLien() {
    navigator.clipboard.writeText(`https://${lien}`).then(() => {
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2500);
    });
  }

  async function partagerLien() {
    const texte = `Voici ma boutique Nyosi. Commande ici : https://${lien}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: form.nom, text: texte });
      } catch {
        // annulé par l'utilisateur
      }
    } else {
      navigator.clipboard.writeText(`https://${lien}`).then(() => {
        setPartageEtat("copie");
        setTimeout(() => setPartageEtat("idle"), 3000);
      });
    }
  }

  /* ── ÉCRAN CONFIRMATION ── */
  if (boutiqueCree) {
    return (
      <div className="min-h-screen bg-[#FCB001] flex flex-col items-center justify-center px-5 py-10 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full">
          <div className="flex justify-center mb-5">
            <Image src="/logo.png" alt="Nyosi" width={100} height={38} priority />
          </div>
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-black mb-1">{form.nom}</h2>
          <p className="text-gray-500 text-sm mb-5">{form.categorie} · {form.ville}</p>

          <p className="text-gray-700 text-sm mb-3 font-medium">Ton lien boutique :</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 break-all">
            <span className="text-black font-bold text-sm">{lien}</span>
          </div>

          <button
            onClick={partagerLien}
            className="w-full bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold py-4 rounded-xl text-base transition-colors mb-3 flex items-center justify-center gap-2"
          >
            <Image src="/logo-icon.png" alt="" width={20} height={20} />
            {partageEtat === "copie"
              ? "Lien copié. Tu peux le coller sur WhatsApp ou Facebook."
              : "Partager mon lien"}
          </button>

          <button
            onClick={copierLien}
            className="w-full bg-white border-2 border-black text-black font-bold py-3 rounded-xl text-base transition-colors mb-4 active:bg-gray-100"
          >
            {lienCopie ? "✓ Lien copié !" : "📋 Copier mon lien"}
          </button>

          <div className="bg-black rounded-xl px-4 py-4 mb-5 flex items-start gap-3">
            <Image src="/logo-icon.png" alt="" width={18} height={18} className="mt-0.5 shrink-0" />
            <p className="text-[#FCB001] font-semibold text-sm leading-relaxed">
              Ta boutique est prête. Partage ce lien sur WhatsApp et Facebook.
            </p>
          </div>

          <p className="text-gray-400 text-xs">
            nyosi.cm — Ta boutique, ton lien, tes clients.
          </p>
        </div>
      </div>
    );
  }

  /* ── FORMULAIRE ── */
  return (
    <div className="min-h-screen bg-white">

      {/* Barre du haut */}
      <div className="bg-[#FCB001] px-4 py-3 flex items-center justify-between">
        <Image src="/logo.png" alt="Nyosi" width={80} height={30} priority />
        <span className="text-xs text-black/60 font-medium">nyosi.cm</span>
      </div>

      {/* En-tête */}
      <header className="bg-black text-white px-4 pt-8 pb-6">
        <p className="text-[#FCB001] text-sm font-semibold mb-1">⚡ 2 minutes chrono</p>
        <h1 className="text-2xl font-bold mb-2">Crée ta boutique</h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          Remplis le formulaire ci-dessous. Tu recevras un lien à partager sur WhatsApp et Facebook.
        </p>
      </header>

      <main className="px-4 py-6">
        <form onSubmit={valider} className="flex flex-col gap-5">

          {/* ── SECTION 1 : infos boutique ── */}
          <div className="flex flex-col gap-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              1 — Ta boutique
            </p>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Nom de la boutique <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex : Marie Gâteaux, Mode Chez Sandra…"
                value={form.nom}
                onChange={(e) => set("nom", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                value={form.categorie}
                onChange={(e) => set("categorie", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001] bg-white appearance-none"
              >
                <option value="">-- Choisis une catégorie --</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Numéro WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Ex : 6XX XXX XXX"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Page Facebook
                <span className="ml-1 text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                placeholder="Ex : facebook.com/mariegateaux ou MarieGateaux"
                value={form.facebook}
                onChange={(e) => set("facebook", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Description courte
                <span className="ml-1 text-gray-400 font-normal">(optionnel)</span>
              </label>
              <textarea
                placeholder="Ex : Gâteaux faits maison pour anniversaires et cérémonies."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Ville ou quartier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex : Yaoundé, Douala, Bastos…"
                value={form.ville}
                onChange={(e) => set("ville", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
              />
            </div>
          </div>

          {/* ── SÉPARATEUR ── */}
          <div className="border-t border-gray-100 pt-2" />

          {/* ── SECTION 2 : produits ── */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                2 — Tes produits
              </p>
              <p className="text-sm text-gray-500">
                Ajoute entre 1 et 3 produits. Tu pourras en ajouter d&apos;autres plus tard.
              </p>
            </div>

            {produits.map((produit, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-4 flex flex-col gap-3 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-700">
                    Produit {index + 1}
                    {index === 0 && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  {produits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => supprimerProduit(index)}
                      className="text-gray-400 text-sm underline"
                    >
                      Supprimer
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Nom du produit {index === 0 && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Gâteau chocolat 20 personnes"
                    value={produit.nom}
                    onChange={(e) => setProduit(index, "nom", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Prix en FCFA {index === 0 && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Ex : 15000"
                    value={produit.prix}
                    onChange={(e) => setProduit(index, "prix", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Description courte <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Pour 20 personnes, parfum chocolat noir"
                    value={produit.description}
                    onChange={(e) => setProduit(index, "description", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                  />
                </div>
              </div>
            ))}

            {produits.length < 3 && (
              <button
                type="button"
                onClick={ajouterProduit}
                className="w-full border-2 border-dashed border-[#FCB001] text-black font-semibold py-3 rounded-2xl text-sm active:bg-[#FCB001]/10 transition-colors"
              >
                + Ajouter un produit ({produits.length}/3)
              </button>
            )}
          </div>

          {/* ── APERÇU LIEN ── */}
          {form.nom.trim() && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">Ton lien boutique sera :</p>
              <p className="text-black font-bold text-sm break-all">{lien}</p>
            </div>
          )}

          {/* Erreur */}
          {erreur && (
            <p className="text-red-500 text-sm text-center">{erreur}</p>
          )}

          {/* Bouton */}
          <button
            type="submit"
            className="w-full bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold py-4 rounded-xl text-base transition-colors mt-1"
          >
            <span className="flex items-center justify-center gap-2">
              Créer ma boutique
              <Image src="/logo-icon.png" alt="" width={20} height={20} />
            </span>
          </button>

          <p className="text-center text-gray-400 text-xs pb-4">
            Gratuit. Aucune carte bancaire requise.
          </p>
        </form>
      </main>
    </div>
  );
}
