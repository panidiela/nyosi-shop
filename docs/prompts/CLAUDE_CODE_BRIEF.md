# Prompt — Briefing standard pour Claude Code

> Dernière mise à jour : Juin 2026 — Design System v1.0 livré

## Comment utiliser ce fichier
Coller ce texte au début de chaque session avec Claude Code.
Remplacer uniquement la section [MA DEMANDE] par ce que tu veux construire.

---

## Prompt complet à copier-coller dans Claude Code

```
Tu travailles sur le projet NYOSI.

AVANT DE FAIRE QUOI QUE CE SOIT, lis ces fichiers :
- /docs/brain/NYOSI_BRAIN.md
- /docs/design/DESIGN_SYSTEM.md
- /docs/prompts/CTO_RULES.md
- /docs/decisions/ (tous les ADR)

---

CONTEXTE PROJET :
Nyosi transforme WhatsApp et Facebook en boutique. Tes clients découvrent tes produits, commandent directement et te contactent uniquement si nécessaire.

Un vendeur crée sa boutique en 2 minutes, obtient un lien, le partage sur WhatsApp et Facebook avec un message professionnel déjà rédigé (Partage Intelligent).
Les clients commandent depuis leur téléphone Android.
WhatsApp reste indispensable — Nyosi supprime uniquement les messages répétitifs ("C'est combien ?", "T'as quoi ?").

STACK TECHNIQUE (MVP actuel) :
- Next.js 16 App Router + TypeScript + Tailwind CSS
- localStorage (persistance MVP — pas encore de base de données)
- Vercel (déploiement automatique via git push)
- Mobile first Android — parfait dans Chrome Android 360–430px

STACK PRÉVUE (Phase 2) :
- Supabase (PostgreSQL + Auth)
- CinetPay (paiement MTN MoMo / Orange Money)

DESIGN SYSTEM v1.0 — PALETTE OBLIGATOIRE :
- Header / Navigation : #075E54 (vert foncé)
- Boutons principaux / Prix : #25D366 (vert)
- Fond application : #F0F2F5 (gris clair)
- Cartes / Formulaires : #FFFFFF (blanc)
- Texte principal : #1A1A1A
- Texte secondaire / descriptions : #667781
- Bordures : #E8E8E4
- Accent uniquement (logo, badges, marketing) : #FCB001 (jaune Nyosi)

Le jaune #FCB001 ne doit JAMAIS être utilisé pour des boutons ou des fonds de page.
Le vert #25D366 est la couleur des actions principales.

RÈGLES ABSOLUES :
- Pani ne sait pas coder — explique chaque modification en langage simple, sans jargon
- Ne JAMAIS faire de commit — Pani fait toujours lui-même git add, git commit, git push
- Ne modifier que les fichiers strictement nécessaires
- Mobile first : parfait sur écran 6 pouces, Chrome Android
- Nyosi est conçu pour le Cameroun avec connexion faible (3G instable) — pages légères obligatoires
- Objectif chargement : moins de 3 secondes en 3G réel (Yaoundé/Douala)
- Pas d'APK, pas d'application Play Store — web mobile uniquement
- Pas de vidéos, pas de bibliothèques JS lourdes (> 50 Ko), pas d'animations inutiles
- Pas de polices Google Fonts — police système Android uniquement
- Icônes SVG inline uniquement — pas de bibliothèque d'icônes
- Photos compressées côté client : max 800px, JPEG 72%
- Interface 100% en français — aucun mot en anglais visible par l'utilisateur
- Ne casser aucune fonctionnalité existante
- Ne pas toucher au localStorage sans raison explicite
- Logo sur fond vert : utiliser /logo-blanc.png avec className="h-7 w-auto object-contain"
- Logo sur fond blanc : utiliser /logo-vert.png avec className="h-7 w-auto object-contain"
- Ne jamais utiliser brightness-0 invert (logo-blanc.png existe)
- WhatsApp doit rester accessible — ne jamais supprimer le bouton WhatsApp de la page boutique
- Le bouton principal de la page d'accueil doit toujours vendre le bénéfice : "Créer ma boutique gratuitement" — pas "Créer un compte"
- Le Partage Intelligent est la fonctionnalité signature : conserver le message pré-rédigé dans toutes les fonctions partager

---

MA DEMANDE :
[DÉCRIS ICI CE QUE TU VEUX EN LANGAGE SIMPLE]

---

FORMAT DE RÉPONSE ATTENDU :
1. Ce que tu vas faire — en langage simple (2–3 phrases max)
2. Liste des fichiers créés ou modifiés
3. Explications de chaque changement important
4. Ce que Pani doit faire ensuite — commandes exactes à copier-coller
```

---

## Exemple de demande — ajouter une fonctionnalité

```
MA DEMANDE :
Je veux ajouter un bouton "Voir ma boutique" sur la page de confirmation
après la création de boutique. Ce bouton doit ouvrir directement
la page boutique dans un nouvel onglet.
```

## Exemple de demande — corriger un bug

```
MA DEMANDE :
Quand je crée une boutique et que je reviens en arrière depuis /ajouter-produits,
les infos de ma boutique sont perdues. Je veux qu'elles soient conservées.
```

## Exemple de demande — documentation

```
MA DEMANDE :
Mets à jour le fichier docs/features/ORDERS.md pour refléter
le nouveau formulaire de commande avec les champs date et heure.
```

---

## Pages actuelles du MVP

| Route | Description |
|---|---|
| `/` | Page d'accueil — landing page |
| `/creer-boutique` | Étape 1 — infos boutique |
| `/ajouter-produits` | Étape 2 — produits + confirmation |
| `/[slug]` | Page boutique dynamique (client) |
| `/marie-gateaux` | Boutique de démonstration statique |

---

## Conventions de code à respecter

- Classes Tailwind uniquement (pas de CSS custom sauf `globals.css`)
- Composants React fonctionnels avec hooks
- Types TypeScript explicites pour toutes les structures de données
- `localStorage` uniquement côté client (pas dans les composants serveur)
- Images : toujours `<Image>` de Next.js sauf pour les photos base64 produits (`<img>`)
- Animations dans `globals.css` : `card-fade-in`, `sheet-slide-up`, `pop-in`
