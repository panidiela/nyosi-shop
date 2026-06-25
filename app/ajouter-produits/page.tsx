"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Produit = { nom: string; prix: string; description: string };
type DraftBoutique = {
  nom: string; categorie: string; whatsapp: string; facebook: string;
  description: string; ville: string; quartier: string;
};

function slugify(nom: string) {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const produitVide = (): Produit => ({ nom: "", prix: "", description: "" });

export default function AjouterProduits() {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftBoutique | null>(null);
  const [produits, setProduits] = useState<Produit[]>([produitVide()]);
  const [erreur, setErreur] = useState("");
  const [lienCree, setLienCree] = useState("");
  const [lienCopie, setLienCopie] = useState(false);
  const [partageEtat, setPartageEtat] = useState<"idle" | "copie">("idle");

  useEffect(() => {
    const data = localStorage.getItem("nyosi_draft_boutique");
    if (!data) {
      router.push("/creer-boutique");
      return;
    }
    setDraft(JSON.parse(data));
  }, [router]);

  function setProduit(i: number, champ: keyof Produit, val: string) {
    setProduits((prev) => prev.map((p, idx) => idx === i ? { ...p, [champ]: val } : p));
  }

  function ajouter() {
    if (produits.length < 3) setProduits((prev) => [...prev, produitVide()]);
  }

  function supprimer(i: number) {
    if (produits.length > 1) setProduits((prev) => prev.filter((_, idx) => idx !== i));
  }

  function creer(e: React.FormEvent) {
    e.preventDefault();
    if (!produits[0].nom.trim()) return setErreur("Ajoute au moins un produit avec un nom.");
    if (!produits[0].prix.trim()) return setErreur("Ajoute le prix de ton premier produit.");
    setErreur("");

    const s = slugify(draft!.nom);
    const produitsValides = produits.filter((p) => p.nom.trim() && p.prix.trim());
    const boutique = { ...draft, slug: s, produits: produitsValides };
    localStorage.setItem(`nyosi_boutique_${s}`, JSON.stringify(boutique));
    localStorage.removeItem("nyosi_draft_boutique");

    const origine = window.location.host;
    setLienCree(`${origine}/${s}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function copierLien() {
    navigator.clipboard.writeText(`https://${lienCree}`).then(() => {
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2500);
    });
  }

  async function partagerLien() {
    const texte = `Voici ma boutique Nyosi. Commande ici : https://${lienCree}`;
    if (navigator.share) {
      try { await navigator.share({ title: draft?.nom ?? "Ma boutique", text: texte }); }
      catch { /* annulé */ }
    } else {
      navigator.clipboard.writeText(`https://${lienCree}`).then(() => {
        setPartageEtat("copie");
        setTimeout(() => setPartageEtat("idle"), 3000);
      });
    }
  }

  /* ── CONFIRMATION ── */
  if (lienCree) {
    return (
      <div className="min-h-screen bg-[#FCB001] flex flex-col items-center justify-center px-5 py-10 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full">
          <div className="flex justify-center mb-5">
            <Image src="/logo.png" alt="Nyosi" width={100} height={38} priority />
          </div>
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-black mb-1">{draft?.nom}</h2>
          <p className="text-gray-500 text-sm mb-5">{draft?.categorie} · {draft?.ville}</p>

          <p className="text-gray-700 text-sm mb-2 font-medium">Ton lien boutique :</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 break-all">
            <span className="text-black font-bold text-sm">{lienCree}</span>
          </div>

          <button
            onClick={partagerLien}
            className="w-full bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold py-4 rounded-xl text-base mb-3 flex items-center justify-center gap-2"
          >
            <Image src="/logo-icon.png" alt="" width={20} height={20} />
            {partageEtat === "copie" ? "Lien copié !" : "Partager mon lien"}
          </button>

          <button
            onClick={copierLien}
            className="w-full bg-white border-2 border-black text-black font-bold py-3 rounded-xl text-base mb-4 active:bg-gray-100"
          >
            {lienCopie ? "✓ Lien copié !" : "📋 Copier mon lien"}
          </button>

          <div className="bg-black rounded-xl px-4 py-4 mb-5 flex items-start gap-3">
            <Image src="/logo-icon.png" alt="" width={18} height={18} className="mt-0.5 shrink-0" />
            <p className="text-[#FCB001] font-semibold text-sm leading-relaxed">
              Ta boutique est prête. Partage ce lien sur WhatsApp et Facebook.
            </p>
          </div>

          <a
            href={`/${lienCree.split("/").pop()}`}
            className="block text-sm text-[#FCB001] underline"
            style={{ color: "#000", textDecoration: "underline" }}
          >
            Voir ma boutique →
          </a>
        </div>
      </div>
    );
  }

  if (!draft) return null;

  /* ── FORMULAIRE PRODUITS ── */
  return (
    <div className="min-h-screen bg-white">

      {/* Barre */}
      <div className="bg-[#FCB001] px-4 py-3 flex items-center justify-between">
        <Image src="/logo.png" alt="Nyosi" width={80} height={30} priority />
        <span className="text-xs text-black/60 font-medium">Étape 2 / 2</span>
      </div>

      {/* En-tête */}
      <header className="bg-black text-white px-4 pt-8 pb-6">
        <p className="text-[#FCB001] text-sm font-semibold mb-1">✓ Boutique : {draft.nom}</p>
        <h1 className="text-2xl font-bold mb-2">Tes produits</h1>
        <p className="text-gray-300 text-sm">
          Ajoute entre 1 et 3 produits. Tu pourras en ajouter d&apos;autres plus tard.
        </p>
      </header>

      <main className="px-4 py-6">
        <form onSubmit={creer} className="flex flex-col gap-4">

          {produits.map((produit, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-4 flex flex-col gap-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-700">
                  Produit {i + 1}
                  {i === 0 && <span className="text-red-500 ml-1">*</span>}
                </p>
                {produits.length > 1 && (
                  <button type="button" onClick={() => supprimer(i)} className="text-gray-400 text-sm underline">
                    Supprimer
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Nom du produit {i === 0 && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  placeholder="Ex : Gâteau chocolat 20 personnes"
                  value={produit.nom}
                  onChange={(e) => setProduit(i, "nom", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Prix en FCFA {i === 0 && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Ex : 15000"
                  value={produit.prix}
                  onChange={(e) => setProduit(i, "prix", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Description <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Pour 20 personnes, parfum chocolat noir"
                  value={produit.description}
                  onChange={(e) => setProduit(i, "description", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:border-[#FCB001] focus:ring-1 focus:ring-[#FCB001]"
                />
              </div>
            </div>
          ))}

          {produits.length < 3 && (
            <button
              type="button"
              onClick={ajouter}
              className="w-full border-2 border-dashed border-[#FCB001] text-black font-semibold py-3 rounded-2xl text-sm active:bg-[#FCB001]/10"
            >
              + Ajouter un produit ({produits.length}/3)
            </button>
          )}

          {erreur && <p className="text-red-500 text-sm text-center">{erreur}</p>}

          <button
            type="submit"
            className="w-full bg-[#FCB001] hover:bg-[#e0a000] active:bg-[#c48d00] text-black font-bold py-4 rounded-xl text-base transition-colors mt-2 flex items-center justify-center gap-2"
          >
            Créer ma boutique
            <Image src="/logo-icon.png" alt="" width={20} height={20} />
          </button>

          <button
            type="button"
            onClick={() => router.push("/creer-boutique")}
            className="text-center text-gray-400 text-sm underline pb-4"
          >
            ← Modifier les infos boutique
          </button>
        </form>
      </main>
    </div>
  );
}
