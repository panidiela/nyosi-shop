# Composants UI Nyosi — Référence

> Référence des composants visuels du MVP v1.0

---

## Header de navigation

**Fichier** : présent dans toutes les pages sauf la landing page (`/`).

```tsx
<div className="bg-[#075E54] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
  <Image src="/logo.png" alt="Nyosi" width={80} height={30} priority className="brightness-0 invert" />
  {/* Élément contextuel : étape, titre, bouton retour */}
</div>
```

Propriétés :
- Fond `#075E54`
- Logo blanc (`brightness-0 invert`)
- `sticky top-0 z-10` — reste visible au scroll
- Hauteur ~50px

Variantes :
- **Avec étape** (creer-boutique, ajouter-produits) : indicateur barres + "Étape X / 2"
- **Avec titre** ([slug] formulaire commande) : bouton retour + titre
- **Simple** ([slug] boutique) : logo + "nyosi.cm"

---

## Hero zone verte

Zone d'en-tête colorée sous le header.

```tsx
<div className="bg-[#075E54] px-4 pt-5 pb-10">
  <p className="text-[#25D366] text-xs font-semibold uppercase tracking-wide mb-2">
    Catégorie / Accroche
  </p>
  <h1 className="text-white text-3xl font-bold mb-1">Titre</h1>
  <p className="text-white/60 text-sm leading-relaxed">Description</p>
</div>
```

Suivi d'un contenu avec `-mt-3` pour la superposition visuelle :
```tsx
<div className="px-4 -mt-3">
  {/* cartes blanches */}
</div>
```

---

## Card produit

Carte blanche avec photo, nom, description, prix, bouton panier.

```tsx
<div className="bg-white rounded-2xl shadow-sm overflow-hidden card-fade-in">
  {/* Photo ou placeholder */}
  <img src={produit.photo} alt={produit.nom} className="w-full aspect-[4/3] object-cover" />
  {/* OU placeholder */}
  <div className="w-full aspect-[4/3] bg-[#F0F2F5] flex items-center justify-center text-[#E8E8E4]">
    {/* SVG caméra */}
  </div>

  <div className="p-4">
    <p className="font-bold text-[#1A1A1A] text-base">{produit.nom}</p>
    <p className="text-[#667781] text-sm mt-0.5">{produit.description}</p>
    <p className="text-[#25D366] font-bold text-lg mt-1 mb-3">{formatPrix(produit.prix)}</p>

    {/* Bouton ajouter OU contrôle quantité */}
    <button className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-3 rounded-xl text-sm">
      Ajouter au panier
    </button>
  </div>
</div>
```

Ratio photo : `aspect-[4/3]` (paysage, standard mobile).

---

## Contrôle de quantité panier

Remplace le bouton "Ajouter" quand q > 0.

```tsx
<div className="flex items-center justify-between bg-[#F0F2F5] rounded-xl px-3 py-2">
  <button
    onClick={() => changerQuantite(produit, -1)}
    className="w-10 h-10 bg-[#075E54] text-white font-bold rounded-xl text-xl flex items-center justify-center"
  >
    −
  </button>
  <span className="font-bold text-[#1A1A1A] text-lg">{q}</span>
  <button
    onClick={() => changerQuantite(produit, 1)}
    className="w-10 h-10 bg-[#25D366] text-white font-bold rounded-xl text-xl flex items-center justify-center"
  >
    +
  </button>
</div>
```

---

## Barre panier flottante

Fixée en bas de l'écran. Visible uniquement quand `nbArticles > 0`.

```tsx
{nbArticles > 0 && (
  <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white border-t border-[#E8E8E4] shadow-xl">
    <button
      onClick={() => setEcran("commande")}
      className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-2xl text-base flex items-center justify-between px-5"
    >
      <span>Commander</span>
      <span className="bg-white/20 rounded-xl px-3 py-1 text-sm font-bold">
        {nbArticles} article{nbArticles > 1 ? "s" : ""} · {formatPrix(totalPanier)}
      </span>
    </button>
  </div>
)}
```

La page a un `pb-32` pour que le contenu ne soit pas masqué par la barre.

---

## Bottom Sheet (formulaire)

Panneau glissant depuis le bas. Overlay sombre derrière.

```tsx
<div className="fixed inset-0 bg-black/60 z-50 flex items-end">
  <div className="bg-white w-full rounded-t-2xl max-h-[92vh] overflow-y-auto sheet-slide-up">

    {/* Handle visuel */}
    <div className="flex justify-center pt-3 pb-1">
      <div className="w-10 h-1 rounded-full bg-[#E8E8E4]"></div>
    </div>

    <div className="px-5 pb-8">
      {/* En-tête : titre + bouton fermer */}
      {/* Contenu du formulaire */}
    </div>
  </div>
</div>
```

---

## Champ de formulaire

Style uniforme sur tous les formulaires.

```tsx
const inputCls = "w-full border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base text-[#1A1A1A] placeholder-[#667781] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]";

<input type="text" className={inputCls} />
<select className={inputCls + " appearance-none"} />
<textarea className={inputCls + " resize-none"} rows={3} />
```

---

## Label de formulaire

```tsx
<label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
  Nom du champ <span className="text-red-500">*</span>
</label>
// optionnel :
<label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
  Nom <span className="ml-1 text-[#667781] font-normal text-xs">(optionnel)</span>
</label>
```

---

## Message d'erreur

```tsx
{erreur && (
  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
    <p className="text-red-600 text-sm text-center">{erreur}</p>
  </div>
)}
```

---

## Bouton principal

```tsx
<button className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-4 rounded-xl text-base transition-colors flex items-center justify-center gap-2">
  Texte du bouton
  {/* SVG optionnel */}
</button>
```

---

## Bouton secondaire (blanc)

```tsx
<button className="w-full bg-white border border-[#E8E8E4] text-[#1A1A1A] font-bold py-3 rounded-xl text-base active:bg-[#F0F2F5]">
  Texte secondaire
</button>
```

---

## Badge / Pill

```tsx
{/* Badge catégorie */}
<p className="text-[#25D366] text-xs font-semibold uppercase tracking-wide">
  Alimentation & Gâteaux
</p>

{/* Badge indicateur d'étape */}
<div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
  <span className="w-2 h-2 rounded-full bg-[#25D366] block"></span>
  <span className="text-white/90 text-xs font-medium">WhatsApp + Facebook First</span>
</div>
```

---

## Carte de bienvenue (boutique)

```tsx
<div className="bg-white rounded-2xl shadow-sm p-4 mb-4 card-fade-in">
  <p className="text-[#1A1A1A] font-semibold text-base mb-1">
    Bonjour 👋 Commandez directement sans m'écrire.
  </p>
  <p className="text-[#667781] text-sm">Livraison disponible.</p>
</div>
```

---

## Mini-badges info (3 colonnes)

```tsx
<div className="grid grid-cols-3 gap-2 mb-5">
  <div className="bg-white rounded-xl p-3 text-center shadow-sm">
    <p className="text-lg mb-0.5">⭐</p>
    <p className="text-[#1A1A1A] text-xs font-bold">Fiable</p>
  </div>
  <div className="bg-white rounded-xl p-3 text-center shadow-sm">
    <p className="text-lg mb-0.5">📍</p>
    <p className="text-[#1A1A1A] text-xs font-bold">Yaoundé</p>
  </div>
  <div className="bg-white rounded-xl p-3 text-center shadow-sm">
    <p className="text-lg mb-0.5">🚚</p>
    <p className="text-[#1A1A1A] text-xs font-bold">À la livraison</p>
  </div>
</div>
```

---

## Écran de confirmation (commande)

Grand cercle vert animé avec check.

```tsx
<div className="w-24 h-24 rounded-full bg-[#25D366] flex items-center justify-center mx-auto mb-5 pop-in">
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
</div>
```

Badge numéro de commande :
```tsx
<div className="bg-[#075E54] rounded-xl px-6 py-3 my-4 inline-block">
  <p className="text-white font-bold text-xl tracking-widest">NY-0001</p>
</div>
```

---

## Zone upload photo produit

```tsx
<div
  onClick={() => inputRef.current?.click()}
  className="w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-dashed border-[#E8E8E4] bg-[#F0F2F5] flex items-center justify-center cursor-pointer active:opacity-70 relative"
>
  {/* Photo OU placeholder avec SVG caméra */}
  {photo && (
    <div className="absolute bottom-2 right-2 bg-[#075E54]/90 text-white text-xs font-semibold px-2 py-1 rounded-lg">
      Changer
    </div>
  )}
</div>
<input ref={inputRef} type="file" accept="image/*" className="hidden" />
```

---

## Composant CartePhoto (ajouter-produits)

Composant React réutilisable pour l'upload de photo produit.

**Fichier** : `app/ajouter-produits/page.tsx`

Props :
- `photo: string` — base64 de la photo ou chaîne vide
- `index: number` — index du produit (pour l'id du input)
- `onChange: (base64: string) => void` — callback après compression

La compression est faite via `compresserPhoto(file)` — canvas, max 800px, JPEG 72%.
