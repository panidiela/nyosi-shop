# Design System Nyosi — v1.0

> Livré : Juin 2026

---

## Philosophie

L'interface Nyosi est inspirée de **WhatsApp** — l'application la plus connue et la plus utilisée par nos commerçants cibles en Afrique.

Cette familiarité crée une confiance immédiate : le commerçant reconnaît les codes visuels, se sent à l'aise, et comprend comment utiliser Nyosi sans formation.

> "Ça ressemble à WhatsApp, donc je sais déjà comment ça marche."

---

## Palette de couleurs officielle

| Rôle | Nom | Code hex | Utilisation |
|---|---|---|---|
| Header / Navigation | Vert foncé WhatsApp | `#075E54` | Barres de navigation, headers de pages, sticky bars |
| Boutons principaux / Prix | Vert WhatsApp | `#25D366` | Boutons CTA, prix produits, icônes d'action |
| Fond application | Gris clair | `#F0F2F5` | Fond général de toutes les pages |
| Cartes / Formulaires | Blanc | `#FFFFFF` | Cards produits, cartes formulaire, modals |
| Texte principal | Noir doux | `#1A1A1A` | Titres, noms produits, texte important |
| Texte secondaire | Gris moyen | `#667781` | Descriptions, labels, textes d'aide |
| Bordures | Gris clair | `#E8E8E4` | Séparations, bordures de champs |
| Accent Nyosi | Jaune Nyosi | `#FCB001` | Logo, badges, éléments marketing uniquement |

### Règle absolue sur le jaune #FCB001

Le jaune Nyosi `#FCB001` est une **couleur d'accent uniquement**.

✅ **Autorisé** : logo, icône abeille, badges promotionnels, illustrations marketing, textes d'accroche sur fond vert foncé
❌ **Interdit** : boutons, fonds de pages, headers, prix, éléments d'interface principaux

Le vert `#25D366` est la couleur des **actions** dans Nyosi.

---

## Typographie

Nyosi utilise la police système par défaut — pas de police externe chargée.

Raison : performance. Sur un téléphone Android en 3G, chaque milliseconde compte.

| Élément | Taille | Poids | Classe Tailwind |
|---|---|---|---|
| Titre principal (h1) | 24–30px | 700 | `text-2xl font-bold` ou `text-3xl font-bold` |
| Titre de section | 16–18px | 700 | `text-base font-bold` ou `text-lg font-bold` |
| Corps de texte | 14–16px | 400–500 | `text-sm` ou `text-base` |
| Label de formulaire | 14px | 600 | `text-sm font-semibold` |
| Texte secondaire | 12–13px | 400 | `text-xs` ou `text-sm` |
| Prix | 18–20px | 700 | `text-lg font-bold` ou `text-xl font-bold` |

---

## Espacement et arrondis

| Élément | Valeur Tailwind |
|---|---|
| Arrondi des cartes | `rounded-2xl` (16px) |
| Arrondi des boutons | `rounded-xl` (12px) |
| Arrondi des champs | `rounded-xl` (12px) |
| Arrondi des badges | `rounded-full` |
| Padding horizontal des pages | `px-4` (16px) |
| Padding des cartes | `p-4` ou `p-5` |
| Espace entre les cartes | `gap-3` ou `gap-4` |

---

## Ombres

| Usage | Classe Tailwind |
|---|---|
| Cartes produits | `shadow-sm` |
| Modals / Bottom sheets | `shadow-md` |
| Barre panier flottante | `shadow-xl` |

---

## États des boutons

Tous les boutons ont un état `active:` (pression du doigt sur Android).

```
// Bouton principal vert
bg-[#25D366] active:bg-[#1db857]

// Bouton secondaire blanc
bg-white border border-[#E8E8E4] active:bg-[#F0F2F5]

// Bouton danger / destructeur
bg-red-500 active:bg-red-600
```

Pas d'état `hover:` prioritaire — l'interface est tactile, pas desktop.

---

## Champs de formulaire

Style uniforme sur tous les formulaires Nyosi :

```
border border-[#E8E8E4] bg-white rounded-xl px-4 py-3 text-base
text-[#1A1A1A] placeholder-[#667781]
focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]
```

Le ring de focus est vert `#25D366`.

---

## Structure de page standard

Toutes les pages Nyosi suivent cette structure :

```
1. Header sticky vert foncé #075E54
   └── Logo (blanc sur vert : brightness-0 invert)
   └── Élément contextuel (étape, nom boutique, bouton retour)

2. Zone hero verte #075E54
   └── Titre blanc
   └── Sous-titre blanc/60

3. Contenu principal sur fond gris #F0F2F5
   └── Cartes blanches avec shadow-sm
   └── Section -mt-3 pour superposition avec le hero

4. Footer (si nécessaire)
   └── Logo normal (couleurs)
   └── "Boutique créée avec Nyosi · nyosi.cm"
```

---

## Logo

| Contexte | Traitement | Code |
|---|---|---|
| Sur fond vert foncé `#075E54` | Blanc | `className="brightness-0 invert"` |
| Sur fond blanc `#FFFFFF` | Couleurs normales | aucune classe supplémentaire |
| Sur fond gris `#F0F2F5` | Couleurs normales | aucune classe supplémentaire |

Fichiers disponibles :
- `/public/logo.png` — logo complet avec texte "Nyosi"
- `/public/logo-icon.png` — icône abeille seule

---

## Animations

Définies dans `app/globals.css`. Classes utilitaires :

| Classe | Animation | Usage |
|---|---|---|
| `.card-fade-in` | Apparition de bas en haut (350ms) | Cartes produits, cards |
| `.sheet-slide-up` | Glissement depuis le bas (300ms) | Bottom sheets, formulaires |
| `.pop-in` | Apparition avec rebond (450ms) | Icône de confirmation (check vert) |

Appliquer un délai progressif sur les listes :
```tsx
style={{ animationDelay: `${i * 0.08}s` }}
```

---

## Icônes

Nyosi utilise des **SVG inline** — pas de bibliothèque d'icônes externe.

Raison : performance, personnalisation, zéro dépendance.

Icônes SVG utilisées : flèche droite, check, partage, WhatsApp, retour.

---

## Responsive

L'interface est conçue pour **360px à 430px** (Android standard).

Elle reste fonctionnelle jusqu'à 768px (tablette), mais n'est pas optimisée au-delà.

`max-w-sm` ou `max-w-xs` sur les modals et cartes de confirmation.
