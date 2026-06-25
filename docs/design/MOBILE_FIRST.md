# Mobile First — Nyosi

---

## Cible matérielle

| Paramètre | Valeur cible |
|---|---|
| Système | Android (Chrome) |
| Largeur d'écran | 360px à 430px |
| Navigateur | Chrome Android (dernière version) |
| Réseau | 3G / 4G instable |
| Téléphones représentatifs | Samsung Galaxy A-series, Tecno, Itel, Infinix |

Les iPhones (iOS Safari) fonctionnent mais ne sont **pas** la cible prioritaire.

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

### Ce qui ralentit (à éviter)

- Bibliothèques JS lourdes (lodash, moment, etc.)
- Polices externes chargées depuis Google Fonts
- Images non compressées dans le code
- Requêtes API au chargement de page (pour le MVP localStorage)

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
