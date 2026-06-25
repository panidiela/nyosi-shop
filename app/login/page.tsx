"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { connecter, getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const inputCls =
  "w-full border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base text-[#1A1A1A] placeholder-[#667781] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifiant: "", motDePasse: "" });
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
    if (!form.identifiant.trim()) return setErreur("Entrez votre téléphone ou email.");
    if (!form.motDePasse) return setErreur("Entrez votre mot de passe.");
    setErreur("");
    setEnCours(true);
    const { erreur: err } = await connecter(form.identifiant, form.motDePasse);
    setEnCours(false);
    if (err) return setErreur(err);
    router.replace("/dashboard");
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
        <p className="text-[#25D366] text-sm font-semibold mb-1">Bienvenue 👋</p>
        <h1 className="text-white text-2xl font-bold mb-1">Connexion</h1>
        <p className="text-white/60 text-sm">Accède à ta boutique.</p>
      </div>

      <main className="px-4 -mt-5 pb-8">
        <div className="bg-white rounded-2xl shadow-md p-5 sheet-slide-up">
          <form onSubmit={soumettre} className="flex flex-col gap-5">

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Téléphone ou email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="email"
                placeholder="Ex : 6 77 12 34 56 ou email@example.com"
                value={form.identifiant}
                onChange={(e) => set("identifiant", e.target.value)}
                autoComplete="username"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={afficherMdp ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.motDePasse}
                  onChange={(e) => set("motDePasse", e.target.value)}
                  autoComplete="current-password"
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
              ) : "Se connecter"}
            </button>

            <div className="text-center">
              <p className="text-[#667781] text-sm">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-[#075E54] font-semibold underline">
                  Créer un compte gratuitement
                </Link>
              </p>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
