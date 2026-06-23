# 🐝 NYOSI — La boutique WhatsApp des commerçants africains

> "Transforme tes messages WhatsApp en commandes automatiques."

---

## C'est quoi Nyosi ?

Nyosi est une boutique en ligne instantanée pour les commerçants africains francophones.

En 2 minutes, un vendeur crée sa boutique, obtient un lien, le partage sur WhatsApp et Facebook. Ses clients commandent et paient en Mobile Money directement. Plus de messages en boucle. Plus de commandes oubliées. Plus de paiements flous.

---

## Structure du projet

```
/nyosi
  /docs
    /brain          → Vision, principes, roadmap, insights utilisateurs
    /team           → Équipe, rôles, workflow de travail
    /decisions      → Décisions techniques (ADR 001 à 005)
    /research       → Analyse marché, concurrents
    /prompts        → Briefing standard pour Claude Code
    /playbooks      → Guide interview terrain + guide test MVP

  /apps
    /web            → Application Next.js (à créer par Claude Code)

  /infra
    /vercel         → Configuration déploiement
    /supabase       → Schéma base de données
```

---

## Équipe

| Rôle | Qui | Responsabilité principale |
|---|---|---|
| CEO & Terrain | **Pani** (humain) | Décisions, validation, git push |
| CTO & Architecture | ChatGPT | Stack, architecture, briefings Claude Code |
| Conseiller produit & UX | Claude | UX, docs, prompts, wireframes, compréhension |
| Engineering | Claude Code | Code, déploiement, corrections |

⚠️ **Important** : Pani ne sait pas coder. Toutes les explications techniques doivent être en langage simple, sans jargon, avec des exemples concrets.

---

## Stack technique

| Composant | Technologie | Pourquoi |
|---|---|---|
| Frontend | Next.js + TypeScript + Tailwind | Rapide, mobile first, optimal Vercel |
| Base de données | Supabase (PostgreSQL) | Gratuit, interface visuelle, Auth intégrée |
| Déploiement | Vercel | Automatique après git push, gratuit |
| Paiement | CinetPay | MTN MoMo + Orange Money Cameroun |
| Mobile | Chrome Android | Pas d'app à télécharger |

---

## Pour démarrer

### 1. Lire la vision complète
→ `/docs/brain/NYOSI_BRAIN.md`

### 2. Comprendre l'équipe et le workflow
→ `/docs/team/TEAM.md`
→ `/docs/team/WORKFLOW.md`

### 3. Voir la roadmap
→ `/docs/brain/ROADMAP.md`

### 4. Faire les interviews terrain (Phase 0)
→ `/docs/playbooks/INTERVIEW_PLAYBOOK.md`

### 5. Briefer Claude Code pour construire
→ `/docs/prompts/CLAUDE_CODE_BRIEF.md`

---

## Commandes git que Pani exécute

```bash
git add .
git commit -m "description courte du changement"
git push
```

Après le push → Vercel redéploie automatiquement. Rien d'autre à faire.

---

## Lien avec Nyosi Caisse

Nyosi est une marque avec deux produits :
- **Nyosi** (ce projet) → boutique en ligne, commandes, paiement Mobile Money
- **Nyosi Caisse** → gestion stock et caisse pour snacks/bars/restaurants (déjà en test au café de Pani)

À terme : une commande Nyosi entre automatiquement dans Nyosi Caisse. Le stock se met à jour tout seul.

---

## Règle fondamentale

**Nyosi propose. Pani décide. Claude Code construit.**

Rien n'est considéré comme décidé si ce n'est pas écrit dans `/docs/brain/NYOSI_BRAIN.md`.
