"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession, ecouterAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const onglets = [
  {
    href: "/dashboard",
    label: "Accueil",
    exact: true,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/commandes",
    label: "Commandes",
    exact: false,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/produits",
    label: "Produits",
    exact: false,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/boutique",
    label: "Boutique",
    exact: false,
    icone: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <circle cx="12" cy="13" r="3"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    /* Si Supabase n'est pas configuré : accès libre (compat MVP localStorage) */
    if (!supabase) {
      setChargement(false);
      return;
    }

    /* Vérification initiale de la session */
    getSession().then((session) => {
      if (!session) {
        router.replace("/login");
      } else {
        setChargement(false);
      }
    });

    /* Écoute les déconnexions en temps réel */
    const arreter = ecouterAuth((user) => {
      if (!user) router.replace("/login");
    });

    return arreter;
  }, [router]);

  function estActif(onglet: { href: string; exact: boolean }) {
    if (onglet.exact) return pathname === onglet.href;
    return pathname.startsWith(onglet.href);
  }

  if (chargement) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-[#25D366] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      {children}

      {/* Navigation fixe en bas */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E4] z-50">
        <div className="flex">
          {onglets.map((o) => {
            const actif = estActif(o);
            return (
              <Link
                key={o.href}
                href={o.href}
                className={`flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors ${
                  actif ? "text-[#075E54]" : "text-[#667781]"
                }`}
              >
                <span className={actif ? "opacity-100" : "opacity-60"}>{o.icone}</span>
                <span className={`text-[10px] font-semibold tracking-wide ${actif ? "text-[#075E54]" : "text-[#667781]"}`}>
                  {o.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
