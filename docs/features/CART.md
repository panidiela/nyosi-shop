# Fonctionnalité : Panier

---

## Vue d'ensemble

Le panier est géré dans le state React local de la page boutique `app/[slug]/page.tsx`.
Il n'est pas persisté dans localStorage — il est réinitialisé à chaque visite.

---

## Structure de données

```typescript
type LignePanier = {
  produit: Produit;
  quantite: number;
};
```

Le panier est un tableau de `LignePanier` :
```typescript
const [panier, setPanier] = useState<LignePanier[]>([]);
```

---

## Fonctions panier

### Changer la quantité

```typescript
function changerQuantite(produit: Produit, delta: number) {
  setPanier((prev) => {
    const existant = prev.find((l) => l.produit.nom === produit.nom);
    if (!existant) {
      if (delta > 0) return [...prev, { produit, quantite: 1 }]; // Ajouter
      return prev;
    }
    const nvQte = existant.quantite + delta;
    if (nvQte <= 0) return prev.filter((l) => l.produit.nom !== produit.nom); // Supprimer
    return prev.map((l) => l.produit.nom === produit.nom ? { ...l, quantite: nvQte } : l);
  });
}
```

- `delta = +1` → ajoute 1 (ou crée la ligne si inexistante)
- `delta = -1` → enlève 1 (ou supprime la ligne si quantité = 0)

### Récupérer la quantité d'un produit

```typescript
function qte(produit: Produit) {
  return panier.find((l) => l.produit.nom === produit.nom)?.quantite ?? 0;
}
```

### Calcul des totaux

```typescript
const totalPanier = panier.reduce(
  (acc, l) => acc + parseInt(l.produit.prix, 10) * l.quantite, 0
);

const nbArticles = panier.reduce((acc, l) => acc + l.quantite, 0);
```

---

## UI panier

### Bouton "Ajouter au panier" → état initial (quantité = 0)

```tsx
<button
  onClick={() => changerQuantite(produit, 1)}
  className="w-full bg-[#25D366] active:bg-[#1db857] text-white font-bold py-3 rounded-xl text-sm"
>
  Ajouter au panier
</button>
```

### Contrôle quantité → quand quantité > 0

```tsx
<div className="flex items-center justify-between bg-[#F0F2F5] rounded-xl px-3 py-2">
  <button onClick={() => changerQuantite(produit, -1)} className="...">−</button>
  <span className="font-bold text-[#1A1A1A] text-lg">{q}</span>
  <button onClick={() => changerQuantite(produit, 1)} className="...">+</button>
</div>
```

### Barre panier flottante → visible si `nbArticles > 0`

```tsx
{nbArticles > 0 && (
  <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white border-t border-[#E8E8E4] shadow-xl">
    <button onClick={() => setEcran("commande")} className="w-full bg-[#25D366] ...">
      <span>Commander</span>
      <span>{nbArticles} article{nbArticles > 1 ? "s" : ""} · {formatPrix(totalPanier)}</span>
    </button>
  </div>
)}
```

La page boutique a `pb-32` pour éviter que la barre flottante cache du contenu.

---

## Réinitialisation du panier

Le panier est vidé quand le client clique "Retour à la boutique" depuis la confirmation :

```typescript
onClick={() => { setEcran("boutique"); setPanier([]); }}
```

---

## Phase 2

En Phase 2 :
- Le panier pourrait être persisté (localStorage ou sessionStorage) pour survivre au rechargement de page
- Un maximum de quantité par produit pourrait être imposé (selon le stock disponible)
- Un bouton "Vider le panier" pourrait être ajouté
