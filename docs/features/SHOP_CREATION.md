# Fonctionnalité : Création de boutique

---

## Vue d'ensemble

Le commerçant crée sa boutique en **2 étapes** — moins de 2 minutes.

```
/creer-boutique → /ajouter-produits → Confirmation + lien boutique
```

---

## Étape 1 — Infos boutique (`/creer-boutique`)

### Champs

| Champ | Obligatoire | Type | Notes |
|---|---|---|---|
| Nom de la boutique | ✅ | text | Sert à générer le slug |
| Catégorie | ✅ | select | 7 catégories disponibles |
| Numéro WhatsApp | ✅ | tel | Affiché sur la boutique |
| Page Facebook | — | text | Optionnel |
| Description courte | — | textarea | Optionnel |
| Ville | ✅ | text | Affiché sur la boutique |
| Quartier | ✅ | text | Affiché sur la boutique |

### Catégories disponibles

1. Alimentation & Gâteaux
2. Mode & Vêtements
3. Beauté & Cosmétiques
4. Artisanat & Décoration
5. Électronique & Accessoires
6. Santé & Bien-être
7. Autre

### Persistance

Les données sont sauvegardées dans `localStorage["nyosi_draft_boutique"]` avant de passer à l'étape 2.

Clé : `nyosi_draft_boutique`
Type : JSON stringifié de l'objet `form`

### Validation

```typescript
if (!form.nom.trim())      → "Le nom de la boutique est obligatoire."
if (!form.categorie)       → "Choisis une catégorie."
if (!form.whatsapp.trim()) → "Le numéro WhatsApp est obligatoire."
if (!form.ville.trim())    → "La ville est obligatoire."
if (!form.quartier.trim()) → "Le quartier est obligatoire."
```

### Navigation

- Succès → `router.push("/ajouter-produits")`
- Si `/ajouter-produits` est visité sans draft → `router.push("/creer-boutique")`

---

## Étape 2 — Produits (`/ajouter-produits`)

Voir `docs/features/PRODUCTS.md` pour le détail.

---

## Confirmation et lien

Après création :

1. **Slug généré** via `slugify(draft.nom)`
2. **Boutique sauvegardée** dans `localStorage["nyosi_boutique_${slug}"]`
3. **Draft supprimé** : `localStorage.removeItem("nyosi_draft_boutique")`
4. **Lien généré** : `${window.location.host}/${slug}`

### Partage du lien

Bouton "Partager mon lien" → `navigator.share()` (menu natif Android).

Fallback si `navigator.share` non disponible → `navigator.clipboard.writeText()`.

```typescript
async function partagerLien() {
  const texte = `Voici ma boutique Nyosi. Commande ici : https://${lienCree}`;
  if (navigator.share) {
    await navigator.share({ title: draft?.nom, text: texte });
  } else {
    navigator.clipboard.writeText(`https://${lienCree}`);
  }
}
```

---

## Fichiers concernés

| Fichier | Rôle |
|---|---|
| `app/creer-boutique/page.tsx` | Formulaire étape 1 |
| `app/ajouter-produits/page.tsx` | Formulaire étape 2 + confirmation |
| `app/[slug]/page.tsx` | Page boutique générée |
