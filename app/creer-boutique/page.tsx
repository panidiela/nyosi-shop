"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
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

export default function CreerBoutique() {
  const router = useRouter();
  const [form, setForm] = useState({
    nom: "",
    categorie: "",
    whatsapp: "",
    facebook: "",
    description: "",
    ville: "",
    quartier: "",
  });
  const [erreur, setErreur] = useState("");

  function set(champ: keyof typeof form, valeur: string) {
    setForm((f) => ({ ...f, [champ]: valeur }));
  }

  function continuer(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom.trim()) return setErreur("Le nom de la boutique est obligatoire.");
    if (!form.categorie) return setErreur("Choisis une catégorie.");
    if (!form.whatsapp.trim()) return setErreur("Le numéro WhatsApp est obligatoire.");
    if (!form.ville.trim()) return setErreur("La ville est obligatoire.");
    if (!form.quartier.trim()) return setErreur("Le quartier est obligatoire.");
    setErreur("");
    localStorage.setItem("nyosi_draft_boutique", JSON.stringify(form));
    router.push("/ajouter-produits");
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Barre */}
      <div className="bg-[#FCB001] px-4 py-3 flex items-center justify-between">
        <Image src="/logo.png" alt="Nyosi" width={80} height={30} priority />
        <span className="text-xs text-black/60 font-medium">Étape 1 / 2</span>
      </div>

      {/* En-tête */}
      <header className="bg-black text-white px-4 pt-8 pb-6">
        <p className="text-[#FCB001] text-sm font-semibold mb-1">⚡ 2 minutes chrono</p>
        <h1 className="text-2xl font-bold mb-2">Ta boutique</h1>
        <p className="text-gray-300 text-sm">
          Remplis les infos de ta boutique. Tu ajouteras tes produits à l&apos;étape suivante.
        </p>
      </header>

      <main className="px-4 py-6">
        <form onSubmit={continuer} className="flex flex-col gap-5">

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
              placeholder="Ex : facebook.com/mariegateaux"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Ville <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex : Yaoundé"
                value={form.ville}
                onChange={(e) => set("ville", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Quartier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex : Bastos"
                value={form.quartier}
                onChange={(e) => set("quartier", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
              />
            </div>
          </div>

          {erreur && (
            <p className="text-red-500 text-sm text-center">{erreur}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold py-4 rounded-xl text-base transition-colors mt-1"
          >
            Continuer — Ajouter mes produits →
          </button>

          <p className="text-center text-gray-400 text-xs pb-4">
            Gratuit. Aucune carte bancaire requise.
          </p>
        </form>
      </main>
    </div>
  );
}
