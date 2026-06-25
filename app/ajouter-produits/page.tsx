"use client";

import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sauvegarderBoutique, type ResultatSauvegarde } from "@/lib/boutique";
import { setSlugActuel } from "@/lib/dashboard";

type Produit = { nom: string; prix: string; description: string; photo: string };
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

const produitVide = (): Produit => ({ nom: "", prix: "", description: "", photo: "" });

/* Redimensionne et compresse la photo avant de la stocker */
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
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function CartePhoto({
  photo, index, onChange,
}: { photo: string; index: number; onChange: (base64: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await compresserPhoto(file);
    onChange(base64);
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-[#667781] mb-1.5">
        Photo du produit <span className="text-[#667781] font-normal">(optionnel)</span>
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        className="w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-dashed border-[#E8E8E4] bg-[#F0F2F5] flex items-center justify-center cursor-pointer active:opacity-70 relative"
      >
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={photo} alt="Aperçu" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#667781]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span className="text-sm font-medium">Choisir une photo</span>
            <span className="text-xs">Galerie ou appareil photo</span>
          </div>
        )}

        {photo && (
          <div className="absolute bottom-2 right-2 bg-[#075E54]/90 text-white text-xs font-semibold px-2 py-1 rounded-lg">
            Changer
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={undefined}
        id={`photo-${index}`}
        className="hidden"
        onChange={handleFichier}
      />
    </div>
  );
}

export default function AjouterProduits() {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftBoutique | null>(null);
  const [produits, setProduits] = useState<Produit[]>([produitVide()]);
  const [erreur, setErreur] = useState("");
  const [lienCree, setLienCree] = useState("");
  const [lienCopie, setLienCopie] = useState(false);
  const [partageEtat, setPartageEtat] = useState<"idle" | "copie">("idle");
  const [resultatSauvegarde, setResultatSauvegarde] = useState<ResultatSauvegarde | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("nyosi_draft_boutique");
    if (!data) { router.push("/creer-boutique"); return; }
    setDraft(JSON.parse(data));
  }, [router]);

  function setProduitChamp(i: number, champ: keyof Produit, val: string) {
    setProduits((prev) => prev.map((p, idx) => idx === i ? { ...p, [champ]: val } : p));
  }

  function ajouter() {
    if (produits.length < 3) setProduits((prev) => [...prev, produitVide()]);
  }

  function supprimer(i: number) {
    if (produits.length > 1) setProduits((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function creer(e: React.FormEvent) {
    e.preventDefault();
    if (!produits[0].nom.trim()) return setErreur("Ajoute au moins un produit avec un nom.");
    if (!produits[0].prix.trim()) return setErreur("Ajoute le prix de ton premier produit.");
    setErreur("");

    const s = slugify(draft!.nom);
    const produitsValides = produits.filter((p) => p.nom.trim() && p.prix.trim());
    const boutique = { ...draft!, slug: s, produits: produitsValides };

    // Sauvegarde dans Supabase + localStorage (fallback automatique)
    const resultat = await sauvegarderBoutique(boutique);
    setResultatSauvegarde(resultat);
    localStorage.removeItem("nyosi_draft_boutique");
    // Mémorise la boutique active pour le dashboard (multi-boutique ready)
    setSlugActuel(s);

    setLienCree(`${window.location.host}/${s}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function copierLien() {
    navigator.clipboard.writeText(`https://${lienCree}`).then(() => {
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2500);
    });
  }

  async function partagerLien() {
    const nomBoutique = draft?.nom ?? "Ma boutique";
    const url = `https://${lienCree}`;
    const message =
      `🛍️ Découvrez la boutique ${nomBoutique} !\n\n` +
      `Découvrez tous nos produits disponibles, choisissez ce qui vous plaît et passez votre commande directement ici :\n\n` +
      `🔗 ${url}\n\n` +
      `Nous sommes à votre disposition si vous avez besoin d'informations complémentaires.`;

    if (navigator.share) {
      try {
        await navigator.share({ title: nomBoutique, text: message });
      } catch { /* annulé par l'utilisateur */ }
    } else {
      navigator.clipboard.writeText(message).then(() => {
        setPartageEtat("copie");
        setTimeout(() => setPartageEtat("idle"), 3000);
      });
    }
  }

  /* ── CONFIRMATION ── */
  if (lienCree) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center px-5 py-10">
        <div className="bg-white rounded-2xl shadow-md p-6 max-w-sm w-full text-center">
          {/* Check animé */}
          <div className="w-20 h-20 rounded-full bg-[#25D366] flex items-center justify-center mx-auto mb-5 pop-in">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <div className="flex justify-center mb-3">
            <Image src="/logo-vert.png" alt="Nyosi" width={80} height={31} priority className="h-7 w-auto object-contain" />
          </div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Boutique créée !</h2>
          <p className="text-[#667781] text-sm mb-3">{draft?.nom} · {draft?.ville}</p>

          {resultatSauvegarde?.source === "supabase" ? (
            <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl px-4 py-2 mb-4 flex items-center gap-2">
              <span className="text-[#1B5E20] text-sm font-semibold">✓ Boutique sauvegardée en ligne</span>
            </div>
          ) : (
            <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-xl px-4 py-3 mb-4 text-left">
              <p className="text-[#7B4F00] text-sm font-bold mb-2">⚠️ Boutique sauvegardée uniquement sur cet appareil</p>
              <div className="flex flex-col gap-1 text-xs text-[#7B4F00]">
                <p>
                  <span className="font-semibold">Supabase URL :</span>{" "}
                  {resultatSauvegarde?.diagnostic?.supabaseUrl ? "✓ détectée" : "✗ MANQUANTE"}
                </p>
                <p>
                  <span className="font-semibold">Supabase Key :</span>{" "}
                  {resultatSauvegarde?.diagnostic?.supabaseKey ? "✓ détectée" : "✗ MANQUANTE"}
                </p>
                {resultatSauvegarde?.erreur && (
                  <p className="mt-1">
                    <span className="font-semibold">Erreur :</span>{" "}
                    <span className="break-all">{resultatSauvegarde.erreur}</span>
                  </p>
                )}
                {resultatSauvegarde?.diagnostic?.erreurBoutique && (
                  <p className="mt-1">
                    <span className="font-semibold">Détail boutique :</span>{" "}
                    <span className="break-all">{resultatSauvegarde.diagnostic.erreurBoutique}</span>
                  </p>
                )}
                {resultatSauvegarde?.diagnostic?.erreurProduits && (
                  <p className="mt-1">
                    <span className="font-semibold">Détail produits :</span>{" "}
                    <span className="break-all">{resultatSauvegarde.diagnostic.erreurProduits}</span>
                  </p>
                )}
                {resultatSauvegarde?.diagnostic?.erreurDelete && (
                  <p className="mt-1">
                    <span className="font-semibold">Détail suppression :</span>{" "}
                    <span className="break-all">{resultatSauvegarde.diagnostic.erreurDelete}</span>
                  </p>
                )}
                {resultatSauvegarde?.diagnostic?.erreurException && (
                  <p className="mt-1">
                    <span className="font-semibold">Exception :</span>{" "}
                    <span className="break-all">{resultatSauvegarde.diagnostic.erreurException}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="text-[#1A1A1A] text-sm mb-2 font-semibold">Ton lien boutique :</p>
          <div className="bg-[#F0F2F5] border border-[#E8E8E4] rounded-xl px-4 py-3 mb-5 break-all">
            <span className="text-[#075E54] font-bold text-sm">{lienCree}</span>
          </div>

          <button
            onClick={partagerLien}
            className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-xl text-base mb-3 flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {partageEtat === "copie" ? "Lien copié !" : "Partager mon lien"}
          </button>

          <button
            onClick={copierLien}
            className="w-full bg-white border border-[#E8E8E4] text-[#1A1A1A] font-bold py-3 rounded-xl text-base mb-5 active:bg-[#F0F2F5]"
          >
            {lienCopie ? "✓ Lien copié !" : "📋 Copier mon lien"}
          </button>

          <div className="bg-[#075E54] rounded-xl px-4 py-4 mb-5">
            <p className="text-white font-semibold text-sm leading-relaxed">
              Ta boutique est prête. Partage ce lien sur WhatsApp et Facebook.
            </p>
          </div>

          <a
            href={`/${lienCree.split("/").pop()}`}
            className="block text-sm font-semibold text-[#075E54] underline"
          >
            Voir ma boutique →
          </a>
        </div>
      </div>
    );
  }

  if (!draft) return null;

  const inputCls = "w-full border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base text-[#1A1A1A] placeholder-[#667781] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]";

  /* ── FORMULAIRE PRODUITS ── */
  return (
    <div className="min-h-screen bg-[#F0F2F5]">

      <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Image src="/logo-blanc.png" alt="Nyosi" width={80} height={30} priority className="h-7 w-auto object-contain" />
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-6 h-1.5 rounded-full bg-white/30"></span>
            <span className="w-6 h-1.5 rounded-full bg-white"></span>
          </div>
          <span className="text-white/70 text-xs font-medium">Étape 2 / 2</span>
        </div>
      </div>

      <div className="bg-[#075E54] px-4 pt-5 pb-8">
        <p className="text-[#25D366] text-sm font-semibold mb-1">✓ Boutique : {draft.nom}</p>
        <h1 className="text-white text-2xl font-bold mb-1">Tes produits</h1>
        <p className="text-white/60 text-sm">
          Ajoute entre 1 et 3 produits. Tu pourras en ajouter d&apos;autres plus tard.
        </p>
      </div>

      <main className="px-4 -mt-3 pb-8">
        <form onSubmit={creer} className="flex flex-col gap-4">

          {produits.map((produit, i) => (
            <div key={i} className="bg-white border border-[#E8E8E4] rounded-2xl p-4 flex flex-col gap-4 card-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#1A1A1A]">
                  Produit {i + 1}
                  {i === 0 && <span className="text-red-500 ml-1">*</span>}
                </p>
                {produits.length > 1 && (
                  <button type="button" onClick={() => supprimer(i)} className="text-[#667781] text-sm underline">
                    Supprimer
                  </button>
                )}
              </div>

              <CartePhoto
                photo={produit.photo}
                index={i}
                onChange={(base64) => setProduitChamp(i, "photo", base64)}
              />

              <div>
                <label className="block text-xs font-semibold text-[#667781] mb-1.5">
                  Nom du produit {i === 0 && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  placeholder="Ex : Gâteau chocolat 20 personnes"
                  value={produit.nom}
                  onChange={(e) => setProduitChamp(i, "nom", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#667781] mb-1.5">
                  Prix en FCFA {i === 0 && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Ex : 15000"
                  value={produit.prix}
                  onChange={(e) => setProduitChamp(i, "prix", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#667781] mb-1.5">
                  Description <span className="text-[#667781] font-normal">(optionnel)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Pour 20 personnes, parfum chocolat noir"
                  value={produit.description}
                  onChange={(e) => setProduitChamp(i, "description", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          ))}

          {produits.length < 3 && (
            <button
              type="button"
              onClick={ajouter}
              className="w-full border-2 border-dashed border-[#25D366] text-[#075E54] font-semibold py-3 rounded-2xl text-sm active:bg-[#25D366]/10"
            >
              + Ajouter un produit ({produits.length}/3)
            </button>
          )}

          {erreur && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm text-center">{erreur}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-xl text-base transition-colors mt-2 flex items-center justify-center gap-2"
          >
            Créer ma boutique
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>

          <button
            type="button"
            onClick={() => router.push("/creer-boutique")}
            className="text-center text-[#667781] text-sm underline pb-4"
          >
            ← Modifier les infos boutique
          </button>
        </form>
      </main>
    </div>
  );
}
