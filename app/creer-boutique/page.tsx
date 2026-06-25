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

  const inputCls = "w-full border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base text-[#1A1A1A] placeholder-[#667781] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]";

  return (
    <div className="min-h-screen bg-[#F0F2F5]">

      {/* Barre header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Image src="/logo-blanc.png" alt="Nyosi" width={80} height={30} priority className="h-7 w-auto object-contain" />
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-6 h-1.5 rounded-full bg-white"></span>
            <span className="w-6 h-1.5 rounded-full bg-white/30"></span>
          </div>
          <span className="text-white/70 text-xs font-medium">Étape 1 / 2</span>
        </div>
      </div>

      {/* En-tête */}
      <div className="bg-[#075E54] px-4 pt-5 pb-8">
        <p className="text-[#25D366] text-sm font-semibold mb-1">⚡ 2 minutes chrono</p>
        <h1 className="text-white text-2xl font-bold mb-1">Ta boutique</h1>
        <p className="text-white/60 text-sm">
          Remplis les infos. Tu ajouteras tes produits à l&apos;étape suivante.
        </p>
      </div>

      <main className="px-4 -mt-3 pb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <form onSubmit={continuer} className="flex flex-col gap-5">

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Nom de la boutique <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex : Marie Gâteaux, Mode Chez Sandra…"
                value={form.nom}
                onChange={(e) => set("nom", e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                value={form.categorie}
                onChange={(e) => set("categorie", e.target.value)}
                className={inputCls + " appearance-none"}
              >
                <option value="">-- Choisis une catégorie --</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Numéro WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Ex : 6XX XXX XXX"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Page Facebook
                <span className="ml-1 text-[#667781] font-normal text-xs">(optionnel)</span>
              </label>
              <input
                type="text"
                placeholder="Ex : facebook.com/mariegateaux"
                value={form.facebook}
                onChange={(e) => set("facebook", e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Description courte
                <span className="ml-1 text-[#667781] font-normal text-xs">(optionnel)</span>
              </label>
              <textarea
                placeholder="Ex : Gâteaux faits maison pour anniversaires et cérémonies."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className={inputCls + " resize-none"}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Ville <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Yaoundé"
                  value={form.ville}
                  onChange={(e) => set("ville", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Quartier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Bastos"
                  value={form.quartier}
                  onChange={(e) => set("quartier", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {erreur && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm text-center">{erreur}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-xl text-base transition-colors mt-1 flex items-center justify-center gap-2"
            >
              Continuer — Ajouter mes produits
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <p className="text-center text-[#667781] text-xs pb-2">
              Gratuit. Aucune carte bancaire requise.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
