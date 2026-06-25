# Mobile First — Nyosi

> Nyosi est conçu pour le Cameroun. La connexion est souvent faible, les données mobiles sont limitées, les téléphones sont des Android d'entrée de gamme. Chaque décision technique doit tenir compte de cette réalité.

---

## Contexte réseau Cameroun

| Situation | Réalité terrain |
|---|---|
| Réseau dominant | 3G (MTN, Orange) — la 4G existe mais est instable hors des grandes villes |
| Débit réel 3G | 1–3 Mbps (théorique : 10 Mbps) |
| Données mobiles | Limitées et payantes — chaque mégaoctet compte |
| Connexion WiFi | Rare chez les vendeurs solopreneures |
| Zones prioritaires | Yaoundé, Douala (urbain dense), puis villes secondaires |

**Conséquence directe** : une page qui charge en 1 seconde à Paris peut mettre 8 secondes à Yaoundé en 3G. Une page trop lourde = client parti.

---

## Cible matérielle

| Paramètre | Valeur cible |
|---|---|
| Système | Android (Chrome) |
| Largeur d'écran | 360px à 430px |
| Navigateur | Chrome Android (dernière version) |
| Réseau | 3G instable — objectif < 3 secondes |
| Téléphones représentatifs | Samsung Galaxy A-series, Tecno Spark, Itel A56, Infinix Hot |
| RAM typique | 2–4 Go |

Les iPhones (iOS Safari) fonctionnent mais ne sont **pas** la cible prioritaire.

---

## Décisions d'architecture imposées par le contexte réseau

### Pas d'APK — pas d'application Play Store
Nyosi est une **web app** uniquement au MVP. Un lien WhatsApp → Chrome Android → boutique ouverte. Aucune installation, aucun téléchargement, aucune mise à jour à gérer.

Raisons :
- Développer une app Play Store est long et coûteux
- Les mises à jour imposent un téléchargement que les utilisateurs repoussent
- Chrome Android sur Android 8+ est performant — pas besoin d'app native pour le MVP

### Pas de vidéos
Les vidéos consomment énormément de données mobiles. Interdites dans Nyosi.

### Pas de bibliothèques JS lourdes
Chaque bibliothèque ajoutée augmente le poids du JavaScript téléchargé. Règle : si une bibliothèque fait plus de 50 Ko minifiée+gzippée, chercher une alternative ou coder la fonctionnalité manuellement.

Bibliothèques interdites : lodash, moment.js, Material UI, Ant Design, Chakra UI, Radix UI, framer-motion.

### Pas de polices externes
Google Fonts → requête réseau supplémentaire → 200–400 ms de délai. Nyosi utilise la police système du téléphone.

### Animations limitées
Uniquement les animations CSS légères définies dans `globals.css` :
- `card-fade-in` — apparition douce des cartes
- `sheet-slide-up` — glissement du formulaire
- `pop-in` — confirmation commande

Pas de bibliothèque d'animation (pas de framer-motion, GSAP, etc.).

---

## Principes de conception mobile

### 1. Zéro téléchargement

Tout fonctionne dans Chrome Android. Pas d'app à installer. Un lien WhatsApp → boutique ouverte en 1 seconde.

### 2. Cibles tactiles larges

Tous les boutons et zones cliquables : minimum **44px de hauteur**.

En pratique : `py-3` (48px) pour les boutons secondaires, `py-4` (56px) pour les boutons principaux.

### 3. Scroll vertical uniquement

Pas de scroll horizontal. Pas de tableaux larges. Pas de grilles à plus de 3 colonnes.

### 4. Images optimisées

Photos produits compressées côté client avant stockage :
- Redimensionnement max 800px (largeur ou hauteur)
- JPEG à 72% de qualité
- Format base64 stocké dans localStorage

### 5. Pas de hover

Sur Android, le `hover` n'existe pas. Tous les états interactifs utilisent `active:` :
```css
active:bg-[#1db857]
active:opacity-80
```

### 6. `viewport` meta tag

Présent dans `app/layout.tsx` via les métadonnées Next.js.
Empêche le zoom non désiré sur les inputs.

---

## Performance

### Objectif de chargement

**Moins de 3 secondes** sur un réseau 3G (10 Mbps théorique, 2–3 Mbps réel en Afrique).

### Optimisations actuelles

| Technique | Détail |
|---|---|
| Next.js Image | `<Image>` optimise automatiquement les images statiques |
| Police système | Pas de Google Fonts — police par défaut du système |
| SVG inline | Pas de bibliothèque d'icônes (zéro JS supplémentaire) |
| localStorage | Pas d'appel réseau pour les données du MVP |
| Tailwind CSS | CSS purgé automatiquement — seules les classes utilisées sont incluses |
| Pas de bibliothèques UI | Pas de Material UI, Ant Design, Radix, etc. |

### Ce qui ralentit (interdit)

| À éviter | Raison |
|---|---|
| Bibliothèques JS lourdes (lodash, moment…) | Augmentent le bundle JS téléchargé |
| Polices Google Fonts | Requête réseau supplémentaire |
| Images non compressées | Trop lourdes en 3G |
| Vidéos | Consomment trop de données mobiles |
| Bibliothèques d'animation (framer-motion…) | Inutiles et lourdes |
| Bibliothèques d'icônes (Heroicons, Lucide…) | SVG inline suffit |
| Requêtes API bloquantes au chargement | Affichage retardé en 3G |
| APK / Play Store | Hors périmètre MVP |

---

## Accessibilité mobile

### Taille de texte minimale

**14px** (`text-sm`) pour le corps de texte. Jamais en dessous.

### Contraste

Tous les textes sur fond vert `#075E54` sont blancs → ratio de contraste > 7:1.

Texte secondaire `#667781` sur blanc → ratio > 4.5:1.

### Inputs

- `type="tel"` pour les numéros de téléphone → clavier numérique Android
- `type="number" inputMode="numeric"` pour les prix → clavier numérique
- `type="date"` pour les dates → sélecteur natif Android
- `accept="image/*"` pour les photos → galerie + appareil photo Android

### Tap highlight supprimé

```css
* {
  -webkit-tap-highlight-color: transparent;
}
```

Empêche le flash bleu désagréable lors du tap sur Android Chrome.

---

## Tests recommandés

Avant chaque déploiement, tester sur :

1. **Chrome DevTools** — émulateur Samsung Galaxy S20 (360×800)
2. **Chrome DevTools** — émulateur Pixel 6 (412×892)
3. **Réseau simulé** — "Slow 3G" dans DevTools → Network tab

Points à vérifier :
- [ ] Tous les boutons sont facilement cliquables (> 44px hauteur)
- [ ] Le formulaire n'est pas masqué par le clavier virtuel
- [ ] Les images chargent correctement
- [ ] La barre panier ne masque pas le contenu en bas de page
- [ ] Le scroll fonctionne sans accroc
- [ ] L'animation de confirmation (pop-in) fonctionne
