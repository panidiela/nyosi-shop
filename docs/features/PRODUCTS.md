# Fonctionnalité : Produits

---

## Limites MVP

- **Minimum** : 1 produit
- **Maximum** : 3 produits par boutique

Ces limites sont volontaires pour maintenir la simplicité de l'expérience en MVP.

---

## Structure d'un produit

```typescript
type Produit = {
  nom: string;          // Obligatoire
  prix: string;         // Obligatoire — en FCFA, stocké comme string
  description: string;  // Optionnel
  photo: string;        // Optionnel — base64 compressé
};
```

---

## Photo produit

### Processus de compression

La photo est compressée côté client avant stockage via l'API Canvas :

```typescript
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
```

Paramètres :
- Taille max : 800px (largeur ou hauteur)
- Format : JPEG
- Qualité : 72%

Raison : éviter le dépassement de quota `localStorage` (5MB max par domaine).

### Input fichier

```tsx
<input
  ref={inputRef}
  type="file"
  accept="image/*"   // Galerie ET appareil photo Android
  capture={undefined} // Ne pas forcer l'appareil photo
  className="hidden"
  onChange={handleFichier}
/>
```

`accept="image/*"` sans `capture` → Android propose galerie ET appareil photo.

### Affichage

- Photo présente → `<img src={base64} className="w-full aspect-[4/3] object-cover" />`
- Pas de photo → placeholder SVG caméra gris

---

## Actions sur les produits

### Ajouter un produit

Bouton "+ Ajouter un produit (X/3)" visible si `produits.length < 3`.

```typescript
function ajouter() {
  if (produits.length < 3) setProduits((prev) => [...prev, produitVide()]);
}
```

### Supprimer un produit

Lien discret "Supprimer" visible si `produits.length > 1` (le premier produit est obligatoire et non supprimable).

```typescript
function supprimer(i: number) {
  if (produits.length > 1) setProduits((prev) => prev.filter((_, idx) => idx !== i));
}
```

---

## Validation à la création

```typescript
if (!produits[0].nom.trim())  → "Ajoute au moins un produit avec un nom."
if (!produits[0].prix.trim()) → "Ajoute le prix de ton premier produit."
```

Seul le premier produit est obligatoire. Les suivants sont ignorés s'ils sont vides (filtrés avant sauvegarde) :

```typescript
const produitsValides = produits.filter((p) => p.nom.trim() && p.prix.trim());
```

---

## Affichage des prix

```typescript
function formatPrix(prix: string | number) {
  const n = typeof prix === "string" ? parseInt(prix, 10) : prix;
  if (isNaN(n)) return prix + " FCFA";
  return n.toLocaleString("fr-FR") + " FCFA";
}
```

Exemples :
- `15000` → `"15 000 FCFA"`
- `"8000"` → `"8 000 FCFA"`

---

## Phase 2

En Phase 2 :
- Les photos seront stockées dans Supabase Storage (URL au lieu de base64)
- La limite de 3 produits sera levée
- Un tableau de bord permettra d'ajouter/modifier/supprimer des produits
- Les produits auront un statut "actif / inactif" (rupture de stock)

---

## Fichiers concernés

| Fichier | Rôle |
|---|---|
| `app/ajouter-produits/page.tsx` | Création produits (commerçant) |
| `app/[slug]/page.tsx` | Affichage produits (client) |
| `app/marie-gateaux/page.tsx` | Produits statiques de la boutique démo |
