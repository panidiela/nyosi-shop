"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { inscrire, getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const inputCls =
  "w-full border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base text-[#1A1A1A] placeholder-[#667781] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nomComplet: "",
    telephone: "",
    email: "",
    motDePasse: "",
    confirmation: "",
  });
  const [afficherMdp, setAfficherMdp] = useState(false);
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [verification, setVerification] = useState(true);

  /* Si déjà connecté → dashboard */
  useEffect(() => {
    if (!supabase) { setVerification(false); return; }
    getSession().then((s) => {
      if (s) router.replace("/dashboard");
      else setVerification(false);
    });
  }, [router]);

  function set(champ: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [champ]: val }));
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nomComplet.trim()) return setErreur("Le nom complet est obligatoire.");
    if (!form.telephone.trim()) return setErreur("Le numéro de téléphone est obligatoire.");
    if (!form.motDePasse) return setErreur("Le mot de passe est obligatoire.");
    if (form.motDePasse.length < 6) return setErreur("Le mot de passe doit contenir au moins 6 caractères.");
    if (form.motDePasse !== form.confirmation) return setErreur("Les mots de passe ne correspondent pas.");

    setErreur("");
    setEnCours(true);

    const { erreur: err } = await inscrire(
      form.nomComplet,
      form.telephone,
      form.email,
      form.motDePasse
    );

    setEnCours(false);

    if (err) return setErreur(err);

    /* Connexion automatique réussie → création boutique */
    router.replace("/creer-boutique");
  }

  if (verification) {
    return (
      <div className="min-h-screen bg-[#075E54] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-[#25D366] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5]">

      {/* Header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center justify-center sticky top-0 z-10">
        <Image src="/logo-blanc.png" alt="Nyosi" width={90} height={35} priority className="h-8 w-auto object-contain" />
      </div>

      {/* Hero */}
      <div className="bg-[#075E54] px-4 pt-5 pb-10 text-center">
        <p className="text-[#25D366] text-sm font-semibold mb-1">⚡ 2 minutes</p>
        <h1 className="text-white text-2xl font-bold mb-1">Créer mon compte</h1>
        <p className="text-white/60 text-sm">Gratuit. Aucune carte bancaire.</p>
      </div>

      <main className="px-4 -mt-5 pb-8">
        <div className="bg-white rounded-2xl shadow-md p-5 sheet-slide-up">
          <form onSubmit={soumettre} className="flex flex-col gap-5">

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex : Marie Ngono"
                value={form.nomComplet}
                onChange={(e) => set("nomComplet", e.target.value)}
                autoComplete="name"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                inputMode="tel"
                placeholder="Ex : 6 77 12 34 56"
                value={form.telephone}
                onChange={(e) => set("telephone", e.target.value)}
                autoComplete="tel"
                className={inputCls}
              />
              <p className="text-xs text-[#667781] mt-1">
                Utilisé pour te connecter si tu n&apos;as pas d&apos;email.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Email
                <span className="ml-1 text-[#667781] font-normal text-xs">(optionnel)</span>
              </label>
              <input
                type="email"
                inputMode="email"
                placeholder="Ex : marie@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
                className={inputCls}
              />
            </div>

            <div className="border-t border-[#E8E8E4] pt-5">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={afficherMdp ? "text" : "password"}
                    placeholder="Au moins 6 caractères"
                    value={form.motDePasse}
                    onChange={(e) => set("motDePasse", e.target.value)}
                    autoComplete="new-password"
                    className={inputCls + " pr-12"}
                  />
                  <button
                    type="button"
                    onClick={() => setAfficherMdp(!afficherMdp)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667781] p-1"
                  >
                    {afficherMdp ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  type={afficherMdp ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmation}
                  onChange={(e) => set("confirmation", e.target.value)}
                  autoComplete="new-password"
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
              disabled={enCours}
              className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-xl text-base disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {enCours ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Créer mon compte
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-[#667781] text-xs">
              Gratuit · Sans carte bancaire · Résiliable à tout moment
            </p>

            <div className="text-center border-t border-[#E8E8E4] pt-4">
              <p className="text-[#667781] text-sm">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-[#075E54] font-semibold underline">
                  Se connecter
                </Link>
              </p>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
