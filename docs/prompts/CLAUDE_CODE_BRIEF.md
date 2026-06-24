# Prompt — Briefing standard pour Claude Code

## Comment utiliser ce fichier
Coller ce texte au début de chaque session avec Claude Code.
Remplacer uniquement la section [MA DEMANDE] par ce que tu veux construire.

---

## Prompt complet à copier-coller dans Claude Code

```
Tu travailles sur le projet NYOSI.

AVANT DE FAIRE QUOI QUE CE SOIT, lis ces fichiers :
- /docs/brain/NYOSI_BRAIN.md
- /docs/decisions/ (tous les fichiers ADR_001 à ADR_005)
- /docs/team/TEAM.md

---

CONTEXTE PROJET :
Nyosi est une boutique en ligne instantanée pour commerçants africains francophones.
Un vendeur crée sa boutique en 2 minutes, obtient un lien, le partage sur WhatsApp et Facebook.
Les clients commandent et paient en Mobile Money (MTN MoMo / Orange Money) depuis leur téléphone Android.
Le vendeur reçoit une notification. Aucun message WhatsApp ou commentaire Facebook à gérer.

STACK TECHNIQUE DÉCIDÉE :
- Next.js App Router + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Vercel (déploiement automatique via git push)
- CinetPay (paiement MTN MoMo / Orange Money)
- Mobile first Android — tout doit être parfait dans Chrome Android

RÈGLES ABSOLUES :
- Pani ne sait pas coder — explique CHAQUE modification en langage simple, sans jargon
- Ne JAMAIS faire de commit — Pani fait toujours lui-même git add, git commit, git push
- Ne modifier que les fichiers strictement nécessaires
- Mobile first : parfait sur écran 6 pouces, Chrome Android
- Pages légères : moins de 3 secondes en 3G
- Interface 100% en français — aucun mot en anglais visible par l'utilisateur
- Pas de complexité inutile — le plus simple qui marche

---

MA DEMANDE :
[DÉCRIS ICI CE QUE TU VEUX EN LANGAGE SIMPLE]

---

FORMAT DE RÉPONSE ATTENDU :
1. Ce que tu vas faire — en langage simple (2–3 phrases max)
2. Liste des fichiers créés ou modifiés
3. Code complet de chaque fichier (pas de morceaux incomplets)
4. Ce que Pani doit faire ensuite — commandes exactes à copier-coller
```

---

## Exemple de demande pour la Phase 0

```
MA DEMANDE :
Crée une page HTML simple pour tester le concept.
C'est la boutique de "Marie Gâteaux" à Yaoundé.
Elle vend 3 produits : gâteau chocolat 20 personnes (15 000 FCFA), gâteau vanille 10 personnes (8 000 FCFA), cake marbré (5 000 FCFA).
La page doit avoir un formulaire de commande simple (prénom, quartier, date souhaitée, téléphone).
Après commande, afficher un message de confirmation en français.
Déployable sur Vercel immédiatement.
```
