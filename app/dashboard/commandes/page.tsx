"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCommandes,
  getSlugActuel,
  mettreAJourStatut,
  type CommandeDetail,
  type StatutCommande,
} from "@/lib/dashboard";

function formatPrix(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

const STATUTS: { valeur: StatutCommande; label: string; classes: string }[] = [
  { valeur: "en_attente", label: "En attente", classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  { valeur: "confirmee",  label: "Confirmée",  classes: "bg-blue-50 text-blue-700 border border-blue-200" },
  { valeur: "livree",     label: "Livrée",     classes: "bg-green-50 text-[#075E54] border border-green-200" },
  { valeur: "annulee",    label: "Annulée",    classes: "bg-gray-100 text-gray-500 border border-gray-200" },
];

function BadgeStatut({ statut }: { statut: StatutCommande }) {
  const s = STATUTS.find((x) => x.valeur === statut);
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s?.classes ?? ""}`}>
      {s?.label ?? statut}
    </span>
  );
}

function CarteCommande({ commande, onStatutChange }: {
  commande: CommandeDetail;
  onStatutChange: (id: string, statut: StatutCommande) => void;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [enCours, setEnCours] = useState(false);

  async function changerStatut(statut: StatutCommande) {
    setEnCours(true);
    await mettreAJourStatut(commande.id, statut);
    onStatutChange(commande.id, statut);
    setEnCours(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden card-fade-in">
      {/* En-tête carte */}
      <button
        onClick={() => setOuvert(!ouvert)}
        className="w-full px-4 py-4 flex items-start justify-between gap-3 active:bg-[#F0F2F5] text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-[#075E54] text-base">{commande.numero}</span>
            <BadgeStatut statut={commande.statut} />
          </div>
          <p className="font-semibold text-[#1A1A1A] text-sm truncate">{commande.client_nom}</p>
          <p className="text-[#667781] text-xs">{commande.client_telephone}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-[#25D366] text-sm">{formatPrix(commande.total)}</p>
          <p className="text-[#667781] text-xs">{commande.date_livraison}</p>
        </div>
      </button>

      {/* Détails expandables */}
      {ouvert && (
        <div className="border-t border-[#E8E8E4] px-4 py-4 flex flex-col gap-4">

          {/* Infos livraison */}
          <div className="bg-[#F0F2F5] rounded-xl p-3 text-sm text-[#667781] space-y-1">
            <p>📍 {commande.quartier}, {commande.ville}</p>
            <p>🏠 {commande.adresse}</p>
            <p>🕐 {commande.date_livraison} à {commande.heure_livraison}</p>
            {commande.instructions && <p>💬 {commande.instructions}</p>}
          </div>

          {/* Articles */}
          {commande.order_items?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#667781] uppercase tracking-widest mb-2">Articles</p>
              {commande.order_items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-[#1A1A1A] py-1 border-b border-[#E8E8E4] last:border-0">
                  <span>{item.produit_nom} × {item.quantite}</span>
                  <span className="font-semibold">{formatPrix(item.sous_total)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold text-[#075E54] pt-2">
                <span>Total</span>
                <span>{formatPrix(commande.total)}</span>
              </div>
            </div>
          )}

          {/* Modifier le statut */}
          <div>
            <p className="text-xs font-bold text-[#667781] uppercase tracking-widest mb-2">
              Changer le statut {enCours && "…"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {STATUTS.map((s) => (
                <button
                  key={s.valeur}
                  onClick={() => changerStatut(s.valeur)}
                  disabled={enCours || commande.statut === s.valeur}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-opacity ${s.classes} ${
                    commande.statut === s.valeur ? "ring-2 ring-offset-1 ring-[#075E54]" : "active:opacity-70"
                  } disabled:cursor-default`}
                >
                  {s.label}
                  {commande.statut === s.valeur && " ✓"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<CommandeDetail[]>([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState<StatutCommande | "toutes">("toutes");

  useEffect(() => {
    const slug = getSlugActuel();
    if (!slug) { setChargement(false); return; }
    getCommandes(slug).then((c) => { setCommandes(c); setChargement(false); });
  }, []);

  function onStatutChange(id: string, statut: StatutCommande) {
    setCommandes((prev) => prev.map((c) => c.id === id ? { ...c, statut } : c));
  }

  const visibles = filtre === "toutes" ? commandes : commandes.filter((c) => c.statut === filtre);

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
          <h1 className="text-white font-bold text-lg leading-tight">Commandes</h1>
          <p className="text-white/60 text-xs">{commandes.length} au total</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-[#075E54] px-4 pb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { val: "toutes" as const, label: "Toutes" },
            { val: "en_attente" as const, label: "En attente" },
            { val: "confirmee" as const, label: "Confirmées" },
            { val: "livree" as const, label: "Livrées" },
            { val: "annulee" as const, label: "Annulées" },
          ].map((f) => (
            <button
              key={f.val}
              onClick={() => setFiltre(f.val)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filtre === f.val
                  ? "bg-white text-[#075E54]"
                  : "bg-white/20 text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 -mt-3 pb-4">
        {chargement ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-[3px] border-[#25D366] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : visibles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center mt-2">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-bold text-[#1A1A1A] mb-1">
              {filtre === "toutes" ? "Aucune commande pour l'instant" : "Aucune commande dans cette catégorie"}
            </p>
            <p className="text-[#667781] text-sm">
              Partage ton lien boutique pour recevoir des commandes.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-2">
            {visibles.map((c) => (
              <CarteCommande key={c.id} commande={c} onStatutChange={onStatutChange} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
