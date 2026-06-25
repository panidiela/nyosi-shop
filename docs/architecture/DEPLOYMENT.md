# Déploiement Nyosi

---

## Workflow de déploiement actuel

```
Code modifié localement
       ↓
git add [fichiers]
       ↓
git commit -m "description"
       ↓
git push
       ↓
Vercel détecte le push automatiquement
       ↓
Build Next.js (~1–2 min)
       ↓
Déploiement en production
       ↓
nyosi.cm mis à jour
```

**Pani fait toujours le commit et le push lui-même.** Claude Code ne commit jamais.

---

## Structure Vercel

| Environnement | URL | Déclencheur |
|---|---|---|
| Production | nyosi.cm (ou nyosi-shop.vercel.app) | Push sur `main` |
| Preview | nyosi-shop-git-[branche].vercel.app | Push sur toute branche |

---

## Variables d'environnement (Phase 2)

À configurer dans Vercel Dashboard → Project Settings → Environment Variables.

| Variable | Usage | Phase |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase | Phase 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase | Phase 2 |
| `SUPABASE_SERVICE_KEY` | Clé serveur Supabase (privée) | Phase 2 |
| `CINETPAY_API_KEY` | Clé CinetPay | Phase 2 |
| `CINETPAY_SITE_ID` | ID site CinetPay | Phase 2 |

**MVP** : aucune variable d'environnement requise. Tout fonctionne sans configuration.

---

## Vérification avant déploiement

Toujours lancer le build local avant de pousser :

```bash
npm run build
```

Si le build réussit (exit 0, "✓ Compiled successfully"), le déploiement Vercel réussira aussi.

Si des erreurs TypeScript ou de build apparaissent → les corriger avant le push.

---

## Fichiers ignorés (`.gitignore`)

```
node_modules
.next
.env
.env.local
```

Ne jamais committer :
- `node_modules/` (dossier de dépendances, lourd)
- `.next/` (build compilé, régénéré automatiquement)
- `.env` ou `.env.local` (variables secrètes)

---

## Domaine

Domaine cible : **nyosi.cm**

Configuration DNS à faire dans Vercel → Domains une fois le domaine acheté.

En attendant, le site est accessible via l'URL Vercel automatique.
