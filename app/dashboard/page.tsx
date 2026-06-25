"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getBoutiqueActuelle,
  getProduits,
  getCommandes,
  getSlugActuel,
  setSlugActuel,
  type BoutiqueInfo,
  type CommandeDetail,
  type ProduitDB,
} from "@/lib/dashboard";

function formatPrix(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

/* ── Écran accès ── */
function EcranAcces({ onAcces }: { onAcces: (slug: string) => void }) {
  const [valeur, setValeur] = useState("");
  const [erreur, setErreur] = useState("");

  function acceder(e: React.FormEvent) {
    e.preventDefault();
    const s = valeur.trim().toLowerCase().replace(/^.*\//, "");
    if (!s) return setErreur("Entrez le lien ou le nom de votre boutique.");
    setSlugActuel(s);
    onAcces(s);
  }

  return (
    <div className="min-h-screen bg-[#075E54] flex flex-col items-center justify-center px-6">
      <Image src="/logo.png" alt="Nyosi" width={100} height={39} priority className="brightness-0 invert mb-8" />
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-sm">
        <h1 className="text-xl font-bold text-[#1A1A1A] mb-1">Accéder à mon bureau</h1>
        <p className="text-[#667781] text-sm mb-5">
          Entre le lien de ta boutique pour accéder à ton tableau de bord.
        </p>
        <form onSubmit={acceder} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
              Lien ou slug de ta boutique
            </label>
            <input
              type="text"
              placeholder="Ex : marie-gateaux"
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
              className="w-full border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base text-[#1A1A1A] placeholder-[#667781] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]"
            />
            {erreur && <p className="text-red-500 text-xs mt-1">{erreur}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-xl text-base"
          >
            Accéder à mon bureau
          </button>
          <a
            href="/creer-boutique"
            className="block text-center text-sm text-[#667781] underline"
          >
            Je n&apos;ai pas encore de boutique →
          </a>
        </form>
      </div>
    </div>
  );
}

/* ── Stat chip ── */
function Stat({ label, valeur, couleur = "text-[#1A1A1A]" }: { label: string; valeur: string | number; couleur?: string }) {
  return (
    <div className="flex flex-col">
      <span className={`text-xl font-bold ${couleur}`}>{valeur}</span>
      <span className="text-[#667781] text-xs">{label}</span>
    </div>
  );
}

/* ── Page principale ── */
export default function DashboardPage() {
  const [slug, setSlug] = useState<string | null>(null);
  const [boutique, setBoutique] = useState<BoutiqueInfo | null>(null);
  const [produits, setProduits] = useState<ProduitDB[]>([]);
  const [commandes, setCommandes] = useState<CommandeDetail[]>([]);
  const [chargement, setChargement] = useState(true);
  const [partageEtat, setPartageEtat] = useState<"idle" | "copie">("idle");
  const [lienCopie, setLienCopie] = useState(false);

  useEffect(() => {
    const s = getSlugActuel();
    setSlug(s);
    if (!s) { setChargement(false); return; }
    charger(s);
  }, []);

  async function charger(s: string) {
    setChargement(true);
    const [b, p, c] = await Promise.all([
      getBoutiqueActuelle(),
      getProduits(s),
      getCommandes(s),
    ]);
    setBoutique(b);
    setProduits(p);
    setCommandes(c);
    setChargement(false);
  }

  function handleAcces(s: string) {
    setSlug(s);
    charger(s);
  }

  if (!slug && !chargement) return <EcranAcces onAcces={handleAcces} />;

  if (chargement) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-[#25D366] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#667781] text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!boutique) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-6 text-center max-w-xs w-full shadow-sm">
          <p className="text-[#667781] text-sm mb-4">
            Boutique &laquo;{slug}&raquo; introuvable.
          </p>
          <button
            onClick={() => { setSlug(null); setChargement(false); }}
            className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl text-sm"
          >
            Changer de boutique
          </button>
        </div>
      </div>
    );
  }

  /* Calculs */
  const lien = typeof window !== "undefined" ? `${window.location.host}/${slug}` : `nyosi.cm/${slug}`;
  const nbEnAttente = commandes.filter((c) => c.statut === "en_attente").length;
  const nbConfirmees = commandes.filter((c) => c.statut === "confirmee").length;
  const nbLivrees = commandes.filter((c) => c.statut === "livree").length;
  const nbAnnulees = commandes.filter((c) => c.statut === "annulee").length;
  const caEstime = commandes
    .filter((c) => c.statut !== "annulee")
    .reduce((acc, c) => acc + c.total, 0);

  async function copierLien() {
    await navigator.clipboard.writeText(`https://${lien}`);
    setLienCopie(true);
    setTimeout(() => setLienCopie(false), 2500);
  }

  async function partager() {
    const texte = `Commandez chez ${boutique!.nom} : https://${lien}`;
    if (navigator.share) {
      try { await navigator.share({ title: boutique!.nom, text: texte }); } catch { /* annulé */ }
    } else {
      await navigator.clipboard.writeText(`https://${lien}`);
      setPartageEtat("copie");
      setTimeout(() => setPartageEtat("idle"), 2500);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5]">

      {/* Header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Image src="/logo.png" alt="Nyosi" width={80} height={30} priority className="brightness-0 invert" />
        <span className="text-white/50 text-xs">Bureau commerçant</span>
      </div>

      {/* Hero */}
      <div className="bg-[#075E54] px-4 pt-4 pb-10">
        <p className="text-[#25D366] text-sm font-semibold mb-0.5">Bonjour 👋</p>
        <h1 className="text-white text-2xl font-bold">{boutique.nom}</h1>
        <p className="text-white/60 text-sm">
          {boutique.categorie} · {boutique.ville}
        </p>
      </div>

      <div className="px-4 -mt-5 flex flex-col gap-4 pb-4">

        {/* Carte Commandes */}
        <div className="bg-white rounded-2xl shadow-sm p-5 card-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#075E54]/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#075E54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                </svg>
              </div>
              <p className="font-bold text-[#1A1A1A]">Commandes</p>
            </div>
            <span className="text-3xl font-bold text-[#075E54]">{commandes.length}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-amber-50 rounded-xl p-2 text-center">
              <p className="font-bold text-amber-700 text-lg">{nbEnAttente}</p>
              <p className="text-amber-600 text-[10px] font-medium leading-tight">En attente</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-2 text-center">
              <p className="font-bold text-blue-700 text-lg">{nbConfirmees}</p>
              <p className="text-blue-600 text-[10px] font-medium leading-tight">Confirmées</p>
            </div>
            <div className="bg-green-50 rounded-xl p-2 text-center">
              <p className="font-bold text-[#075E54] text-lg">{nbLivrees}</p>
              <p className="text-[#075E54] text-[10px] font-medium leading-tight">Livrées</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-2 text-center">
              <p className="font-bold text-gray-500 text-lg">{nbAnnulees}</p>
              <p className="text-gray-400 text-[10px] font-medium leading-tight">Annulées</p>
            </div>
          </div>

          <Link
            href="/dashboard/commandes"
            className="block w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-3 rounded-xl text-sm text-center"
          >
            Voir les commandes
          </Link>
        </div>

        {/* Carte Produits */}
        <div className="bg-white rounded-2xl shadow-sm p-5 card-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <p className="font-bold text-[#1A1A1A]">Produits</p>
            </div>
            <span className="text-3xl font-bold text-[#25D366]">{produits.length}</span>
          </div>
          <Link
            href="/dashboard/produits"
            className="block w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-3 rounded-xl text-sm text-center"
          >
            Gérer mes produits
          </Link>
        </div>

        {/* Carte Boutique & partage */}
        <div className="bg-white rounded-2xl shadow-sm p-5 card-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#075E54]/10 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#075E54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <p className="font-bold text-[#1A1A1A]">Mon lien boutique</p>
          </div>

          <div className="bg-[#F0F2F5] border border-[#E8E8E4] rounded-xl px-3 py-2.5 mb-3 break-all">
            <span className="text-[#075E54] font-bold text-sm">{lien}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={copierLien}
              className="bg-white border border-[#E8E8E4] text-[#1A1A1A] font-bold py-3 rounded-xl text-sm active:bg-[#F0F2F5]"
            >
              {lienCopie ? "✓ Copié !" : "📋 Copier"}
            </button>
            <button
              onClick={partager}
              className="bg-[#25D366] active:bg-[#1db857] text-white font-bold py-3 rounded-xl text-sm"
            >
              {partageEtat === "copie" ? "Lien copié !" : "↗ Partager"}
            </button>
          </div>
        </div>

        {/* Carte Statistiques */}
        <div className="bg-white rounded-2xl shadow-sm p-5 card-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FCB001]/15 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FCB001" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <p className="font-bold text-[#1A1A1A]">Statistiques</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Stat label="Visites" valeur="Bientôt" couleur="text-[#667781]" />
            <Stat label="Commandes totales" valeur={commandes.length} couleur="text-[#075E54]" />
            <Stat
              label="Produits vendus"
              valeur={commandes
                .filter((c) => c.statut === "livree")
                .reduce((acc, c) => acc + (c.order_items ?? []).reduce((s, i) => s + i.quantite, 0), 0)}
              couleur="text-[#25D366]"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-[#075E54] leading-tight">
                {caEstime > 0 ? formatPrix(caEstime) : "—"}
              </span>
              <span className="text-[#667781] text-xs">CA estimé</span>
            </div>
          </div>
        </div>

        {/* Lien vers la boutique publique */}
        <a
          href={`/${slug}`}
          className="block text-center text-sm font-semibold text-[#075E54] underline py-2"
        >
          Voir ma boutique comme un client →
        </a>
      </div>
    </div>
  );
}
