"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getBoutiqueActuelle,
  getSlugActuel,
  mettreAJourBoutique,
  type BoutiqueInfo,
} from "@/lib/dashboard";

const inputCls = "w-full border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base text-[#1A1A1A] placeholder-[#667781] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]";

export default function BoutiquePage() {
  const [slug, setSlug] = useState("");
  const [boutique, setBoutique] = useState<BoutiqueInfo | null>(null);
  const [form, setForm] = useState({
    nom: "", description: "", facebook: "", whatsapp: "", ville: "", quartier: "",
  });
  const [chargement, setChargement] = useState(true);
  const [enCours, setEnCours] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const s = getSlugActuel() ?? "";
    setSlug(s);
    if (!s) { setChargement(false); return; }
    getBoutiqueActuelle().then((b) => {
      if (b) {
        setBoutique(b);
        setForm({
          nom: b.nom, description: b.description ?? "",
          facebook: b.facebook ?? "", whatsapp: b.whatsapp,
          ville: b.ville, quartier: b.quartier,
        });
      }
      setChargement(false);
    });
  }, []);

  function set(champ: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [champ]: val }));
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom.trim()) return setErreur("Le nom est obligatoire.");
    if (!form.whatsapp.trim()) return setErreur("Le numéro WhatsApp est obligatoire.");
    if (!form.ville.trim()) return setErreur("La ville est obligatoire.");
    setErreur("");
    setEnCours(true);
    const ok = await mettreAJourBoutique(slug, {
      nom: form.nom, description: form.description,
      facebook: form.facebook, whatsapp: form.whatsapp,
      ville: form.ville, quartier: form.quartier,
    });
    setEnCours(false);
    if (ok) {
      setBoutique((b) => b ? { ...b, ...form } : b);
      setSucces(true);
      setTimeout(() => setSucces(false), 3000);
    } else {
      setErreur("Erreur lors de l'enregistrement. Réessaie.");
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5]">

      {/* Header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">Ma boutique</h1>
          <p className="text-white/60 text-xs">{boutique?.nom ?? "—"}</p>
        </div>
      </div>

      <div className="bg-[#075E54] px-4 pt-2 pb-8">
        <p className="text-white/70 text-sm">Modifie les informations visibles par tes clients.</p>
      </div>

      <main className="px-4 -mt-3 pb-6">
        {chargement ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-[3px] border-[#25D366] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !boutique ? (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center mt-2">
            <p className="text-[#667781] text-sm">Boutique introuvable.</p>
            <Link href="/dashboard" className="block mt-4 text-[#075E54] font-semibold underline text-sm">
              Retour
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-5 sheet-slide-up">

            {/* Badge catégorie non modifiable */}
            <div className="mb-4 bg-[#F0F2F5] rounded-xl px-4 py-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667781" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-[#667781] text-xs">
                Catégorie : <strong className="text-[#1A1A1A]">{boutique.categorie}</strong> · Lien : <strong className="text-[#075E54]">{slug}</strong>
              </p>
            </div>

            <form onSubmit={enregistrer} className="flex flex-col gap-5">

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Nom de la boutique <span className="text-red-500">*</span>
                </label>
                <input type="text" value={form.nom} onChange={(e) => set("nom", e.target.value)} className={inputCls} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Description courte
                  <span className="ml-1 text-[#667781] font-normal text-xs">(optionnel)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                  placeholder="Ex : Gâteaux faits maison pour anniversaires."
                  className={inputCls + " resize-none"}
                />
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
                  placeholder="Ex : facebook.com/maboutique"
                  value={form.facebook}
                  onChange={(e) => set("facebook", e.target.value)}
                  className={inputCls}
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
                    Quartier
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

              {/* Photo boutique — placeholder */}
              <div className="bg-[#F0F2F5] rounded-xl px-4 py-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#667781" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <p className="text-[#667781] text-xs">
                  Photo de couverture — disponible bientôt (Phase 3)
                </p>
              </div>

              {erreur && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-red-600 text-sm">{erreur}</p>
                </div>
              )}

              {succes && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 pop-in">
                  <p className="text-[#075E54] text-sm font-semibold text-center">
                    ✓ Modifications enregistrées !
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={enCours}
                className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-xl text-base disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {enCours ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Enregistrer les modifications
                  </>
                )}
              </button>

              <a
                href={`/${slug}`}
                className="block text-center text-sm text-[#075E54] underline"
              >
                Voir ma boutique →
              </a>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
