"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getProduits,
  getSlugActuel,
  ajouterProduit,
  mettreAJourProduit,
  supprimerProduit,
  type ProduitDB,
} from "@/lib/dashboard";

function formatPrix(p: string) {
  const n = parseInt(p, 10);
  if (isNaN(n)) return p + " FCFA";
  return n.toLocaleString("fr-FR") + " FCFA";
}

function compresserPhoto(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
        if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const inputCls = "w-full border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base text-[#1A1A1A] placeholder-[#667781] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]";

/* ── Formulaire ajout / édition ── */
function FormulairePhoto({ photo, onChange }: { photo: string; onChange: (b: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  async function handleFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(await compresserPhoto(file));
  }
  return (
    <div
      onClick={() => ref.current?.click()}
      className="w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-dashed border-[#E8E8E4] bg-[#F0F2F5] flex items-center justify-center cursor-pointer active:opacity-70 relative"
    >
      {photo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={photo} alt="Aperçu" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-[#667781]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span className="text-sm">Choisir une photo</span>
        </div>
      )}
      {photo && (
        <div className="absolute bottom-2 right-2 bg-[#075E54]/90 text-white text-xs font-semibold px-2 py-1 rounded-lg">
          Changer
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFichier} />
    </div>
  );
}

type FormProduit = { nom: string; prix: string; description: string; photo: string };
const formVide = (): FormProduit => ({ nom: "", prix: "", description: "", photo: "" });

function FormulaireEdition({
  initial,
  onValider,
  onAnnuler,
  titre,
}: {
  initial: FormProduit;
  onValider: (f: FormProduit) => Promise<void>;
  onAnnuler: () => void;
  titre: string;
}) {
  const [form, setForm] = useState<FormProduit>(initial);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  function set(champ: keyof FormProduit, val: string) {
    setForm((f) => ({ ...f, [champ]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom.trim()) return setErreur("Le nom est obligatoire.");
    if (!form.prix.trim()) return setErreur("Le prix est obligatoire.");
    setErreur("");
    setEnCours(true);
    await onValider(form);
    setEnCours(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border-2 border-[#25D366] sheet-slide-up">
      <p className="font-bold text-[#1A1A1A] mb-4">{titre}</p>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <FormulairePhoto photo={form.photo} onChange={(b) => set("photo", b)} />
        <div>
          <label className="block text-xs font-semibold text-[#667781] mb-1">Nom du produit *</label>
          <input type="text" placeholder="Ex : Gâteau chocolat" value={form.nom} onChange={(e) => set("nom", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#667781] mb-1">Prix en FCFA *</label>
          <input type="number" inputMode="numeric" placeholder="Ex : 15000" value={form.prix} onChange={(e) => set("prix", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#667781] mb-1">Description (optionnel)</label>
          <input type="text" placeholder="Ex : Pour 20 personnes" value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
        </div>
        {erreur && <p className="text-red-500 text-xs">{erreur}</p>}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onAnnuler} className="py-3 rounded-xl border border-[#E8E8E4] text-[#667781] font-semibold text-sm active:bg-[#F0F2F5]">
            Annuler
          </button>
          <button type="submit" disabled={enCours} className="py-3 rounded-xl bg-[#25D366] active:bg-[#1db857] text-white font-bold text-sm disabled:opacity-60">
            {enCours ? "…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Carte produit ── */
function CarteProduit({
  produit,
  onModifier,
  onSupprimer,
}: {
  produit: ProduitDB;
  onModifier: (p: ProduitDB) => void;
  onSupprimer: (id: string) => void;
}) {
  const [confirme, setConfirme] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden card-fade-in">
      <div className="flex gap-3 p-4">
        {produit.photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={produit.photo} alt={produit.nom} className="w-20 h-20 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-[#F0F2F5] flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8E8E4" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1A1A1A] leading-tight">{produit.nom}</p>
          {produit.description && <p className="text-[#667781] text-xs mt-0.5 line-clamp-1">{produit.description}</p>}
          <p className="text-[#25D366] font-bold mt-1">{formatPrix(produit.prix)}</p>
        </div>
      </div>
      <div className="border-t border-[#E8E8E4] flex">
        <button
          onClick={() => onModifier(produit)}
          className="flex-1 py-3 text-[#075E54] font-semibold text-sm active:bg-[#F0F2F5]"
        >
          Modifier
        </button>
        <div className="w-px bg-[#E8E8E4]" />
        {confirme ? (
          <button
            onClick={() => onSupprimer(produit.id)}
            className="flex-1 py-3 text-red-500 font-bold text-sm active:bg-red-50"
          >
            Confirmer ✕
          </button>
        ) : (
          <button
            onClick={() => setConfirme(true)}
            className="flex-1 py-3 text-[#667781] text-sm active:bg-[#F0F2F5]"
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Page principale ── */
export default function ProduitsPage() {
  const [slug, setSlug] = useState("");
  const [produits, setProduits] = useState<ProduitDB[]>([]);
  const [chargement, setChargement] = useState(true);
  const [modeAjout, setModeAjout] = useState(false);
  const [enEdition, setEnEdition] = useState<ProduitDB | null>(null);

  useEffect(() => {
    const s = getSlugActuel() ?? "";
    setSlug(s);
    if (!s) { setChargement(false); return; }
    getProduits(s).then((p) => { setProduits(p); setChargement(false); });
  }, []);

  async function handleAjouter(form: FormProduit) {
    const ok = await ajouterProduit(slug, {
      nom: form.nom, prix: form.prix,
      description: form.description, photo: form.photo,
      ordre: produits.length,
    });
    if (ok) {
      const p = await getProduits(slug);
      setProduits(p);
      setModeAjout(false);
    }
  }

  async function handleModifier(form: FormProduit) {
    if (!enEdition) return;
    const ok = await mettreAJourProduit(enEdition.id, {
      nom: form.nom, prix: form.prix,
      description: form.description, photo: form.photo,
    });
    if (ok) {
      setProduits((prev) =>
        prev.map((p) => p.id === enEdition.id ? { ...p, ...form } : p)
      );
      setEnEdition(null);
    }
  }

  async function handleSupprimer(id: string) {
    const ok = await supprimerProduit(id);
    if (ok) setProduits((prev) => prev.filter((p) => p.id !== id));
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
        <div className="flex-1">
          <h1 className="text-white font-bold text-lg leading-tight">Produits</h1>
          <p className="text-white/60 text-xs">{produits.length} produit{produits.length !== 1 ? "s" : ""}</p>
        </div>
        {!modeAjout && !enEdition && (
          <button
            onClick={() => setModeAjout(true)}
            className="bg-[#25D366] text-white font-bold text-sm px-4 py-2 rounded-xl active:bg-[#1db857]"
          >
            + Ajouter
          </button>
        )}
      </div>

      <div className="bg-[#075E54] pb-5" />

      <main className="px-4 -mt-3 pb-4 flex flex-col gap-3">

        {/* Formulaire ajout */}
        {modeAjout && (
          <FormulaireEdition
            initial={formVide()}
            onValider={handleAjouter}
            onAnnuler={() => setModeAjout(false)}
            titre="Nouveau produit"
          />
        )}

        {chargement ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-[3px] border-[#25D366] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : produits.length === 0 && !modeAjout ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-bold text-[#1A1A1A] mb-1">Aucun produit</p>
            <p className="text-[#667781] text-sm mb-4">Ajoute ton premier produit.</p>
            <button
              onClick={() => setModeAjout(true)}
              className="bg-[#25D366] text-white font-bold py-3 px-6 rounded-xl text-sm"
            >
              + Ajouter un produit
            </button>
          </div>
        ) : (
          produits.map((p) =>
            enEdition?.id === p.id ? (
              <FormulaireEdition
                key={p.id}
                initial={{ nom: p.nom, prix: p.prix, description: p.description, photo: p.photo }}
                onValider={handleModifier}
                onAnnuler={() => setEnEdition(null)}
                titre="Modifier le produit"
              />
            ) : (
              <CarteProduit
                key={p.id}
                produit={p}
                onModifier={(prod) => { setModeAjout(false); setEnEdition(prod); }}
                onSupprimer={handleSupprimer}
              />
            )
          )
        )}

        {/* Bouton ajouter en bas si produits existants */}
        {produits.length > 0 && !modeAjout && !enEdition && (
          <button
            onClick={() => setModeAjout(true)}
            className="w-full border-2 border-dashed border-[#25D366] text-[#075E54] font-semibold py-3 rounded-2xl text-sm active:bg-[#25D366]/10"
          >
            + Ajouter un produit
          </button>
        )}
      </main>
    </div>
  );
}
