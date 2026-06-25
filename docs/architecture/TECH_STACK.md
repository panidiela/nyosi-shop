# Stack technique Nyosi

---

## Vue d'ensemble

```
┌─────────────────────────────────────────────────┐
│                   NAVIGATEUR ANDROID              │
│              Chrome — 360 à 430px                 │
├─────────────────────────────────────────────────┤
│               NEXT.JS 16 APP ROUTER               │
│        TypeScript + Tailwind CSS                  │
├──────────────┬──────────────────────────────────┤
│  localStorage │   Vercel Serverless Functions    │
│  (MVP)        │   (Phase 2 : APIs)              │
├──────────────┴──────────────────────────────────┤
│           SUPABASE (Phase 2)                      │
│      PostgreSQL + Auth + Storage                  │
├─────────────────────────────────────────────────┤
│           CINETPAY (Phase 2)                      │
│      MTN MoMo + Orange Money                      │
├─────────────────────────────────────────────────┤
│           VERCEL                                  │
│      Déploiement + CDN + Preview URLs             │
└─────────────────────────────────────────────────┘
```

---

## Frontend

| Technologie | Version | Rôle |
|---|---|---|
| Next.js | 16.2.9 | Framework React, routing, SSR/SSG |
| React | 19.x | Bibliothèque UI |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 3.4.x | Styling utility-first |

### Next.js App Router

Nyosi utilise l'App Router de Next.js 16 (dossier `app/`).

Structure des routes :
```
app/
  layout.tsx          — Layout global (metadata, globals.css)
  page.tsx            — / (landing page)
  globals.css         — Animations CSS + variables CSS
  creer-boutique/
    page.tsx          — /creer-boutique (étape 1)
  ajouter-produits/
    page.tsx          — /ajouter-produits (étape 2 + confirmation)
  [slug]/
    page.tsx          — /[slug] (page boutique dynamique)
  marie-gateaux/
    page.tsx          — /marie-gateaux (boutique démo statique)
```

Routes statiques (`○`) : `/`, `/creer-boutique`, `/ajouter-produits`, `/marie-gateaux`
Route dynamique (`ƒ`) : `/[slug]` — rendue côté serveur à la demande

### `"use client"` obligatoire

Toutes les pages qui utilisent `localStorage`, `useState`, `useEffect`, ou des événements navigateur (navigator.share, navigator.clipboard) doivent avoir `"use client"` en première ligne.

---

## Persistance des données (MVP)

### localStorage — navigateur uniquement

| Clé | Contenu | Durée |
|---|---|---|
| `nyosi_draft_boutique` | Données boutique en cours de création | Supprimée après finalisation |
| `nyosi_boutique_${slug}` | Boutique complète (JSON) | Persistante |
| `nyosi_order_counter` | Compteur pour numéros NY-XXXX | Persistante |

**Limitation importante** : les données sont liées au navigateur de l'appareil. Si le commerçant change d'appareil ou vide son cache, la boutique n'est plus accessible pour lui. Pour les clients, c'est transparent (ils accèdent depuis leur propre navigateur).

**Solution Phase 2** : migration vers Supabase — les boutiques seront stockées en base de données et accessibles depuis n'importe quel appareil.

---

## Déploiement

| Service | Usage |
|---|---|
| GitHub | Dépôt de code source |
| Vercel | Déploiement automatique (CI/CD) |

Workflow :
```
git push → Vercel détecte le push → Build automatique → Déploiement en production
```

Temps de déploiement : ~2 minutes.

Preview URLs : chaque branche ou PR obtient une URL de test unique (ex: `nyosi-shop-git-feature-xxx.vercel.app`).

---

## Phase 2 — Technologies prévues

### Supabase

- **PostgreSQL** : base de données relationnelle
- **Auth** : authentification commerçant (email/password ou magic link)
- **Storage** : stockage des photos produits (alternative au base64 localStorage)
- **Realtime** : notifications live des nouvelles commandes

### CinetPay

- Passerelle de paiement mobile (MTN MoMo, Orange Money, etc.)
- Supporte MTN MoMo et Orange Money Cameroun
- API REST simple à intégrer
- Frais : ~2–3% par transaction

---

## Dépendances

### Dépendances de production

```json
{
  "next": "^16.2.9",
  "react": "^19.2.7",
  "react-dom": "^19.2.7"
}
```

Pas de bibliothèques UI tierces (pas de Material UI, Ant Design, Chakra, Radix, etc.).
Pas de bibliothèques d'icônes (icônes SVG inline uniquement).
Pas de bibliothèques d'animation (animations CSS dans `globals.css`).

### Dépendances de développement

```json
{
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "autoprefixer": "^10.4.20",
  "postcss": "^8",
  "tailwindcss": "^3.4.1",
  "typescript": "^5"
}
```

---

## Commandes de développement

```bash
# Démarrer le serveur de développement
npm run dev

# Build de production (vérification d'erreurs)
npm run build

# Démarrer le serveur de production localement
npm run start

# Linting
npm run lint
```

---

## Configuration Tailwind

Fichier : `tailwind.config.ts`

Couleurs personnalisées Nyosi :
```ts
colors: {
  nyosi: {
    "green-dark": "#075E54",
    "green":      "#25D366",
    "bg":         "#F0F2F5",
    "text":       "#1A1A1A",
    "muted":      "#667781",
    "border":     "#E8E8E4",
    "yellow":     "#FCB001",
    "black":      "#000000",
    "white":      "#FFFFFF",
  }
}
```

Note : dans le code actuel, les couleurs sont utilisées avec leur valeur hex directe (`bg-[#075E54]`) et non via les tokens Tailwind. Les deux approches sont valides.
