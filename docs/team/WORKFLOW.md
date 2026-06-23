# Workflow Nyosi

## Cycle de travail standard

```
1. TERRAIN
   Pani observe un problème chez un vendeur ou un client à Yaoundé

2. INSIGHT
   Pani décrit le problème en 2–3 phrases à Claude ou ChatGPT
   Claude documente dans /docs/brain/USER_INSIGHTS.md

3. ANALYSE
   Claude ou ChatGPT analyse et propose des options en langage simple

4. DÉCISION
   Pani choisit une option
   La décision est documentée dans /docs/decisions/

5. SPÉCIFICATION
   Claude rédige le cahier des charges en langage clair
   ChatGPT traduit en tâches techniques précises pour Claude Code

6. BUILD
   Claude Code lit d'abord /docs/brain/ et /docs/decisions/
   Claude Code implémente le code
   Claude Code explique chaque fichier modifié à Pani en langage simple

7. TEST
   Pani teste sur son Android dans de vraies conditions (Yaoundé, 4G/3G)
   Pani note ce qui marche et ce qui bloque

8. VALIDATION
   Pani valide → exécute les commandes git :
   git add .
   git commit -m "description courte du changement"
   git push
   Vercel redéploie automatiquement après le push

9. DOCUMENTATION
   Claude Code met à jour les fichiers docs concernés
   Claude propose les mises à jour documentaires si nécessaire

10. ITÉRATION
    Retour à l'étape 1
```

---

## Commandes git que Pani exécute

Pani copie-colle toujours ces 3 commandes dans cet ordre exact :

```bash
git add .
git commit -m "ce que j'ai changé en quelques mots"
git push
```

Après le push, Vercel redéploie automatiquement. Rien d'autre à faire.

---

## Règles de communication avec chaque IA

### Avec ChatGPT (CTO)
Utiliser pour : architecture, stack technique, briefings Claude Code
Format : "Contexte : [projet]. Problème : [ce qui bloque]. Besoin : [ce qu'on veut construire]."

### Avec Claude (Conseiller)
Utiliser pour : UX, documents, prompts, wireframes, questions produit, compréhension
Format : message naturel en français — Claude s'adapte au contexte

### Avec Claude Code (Engineering)
Utiliser pour : écrire ou corriger du code uniquement
Format obligatoire — toujours commencer par :
"Lis /docs/brain/NYOSI_BRAIN.md et /docs/decisions/ avant de commencer."
Voir le template complet dans /docs/prompts/CLAUDE_CODE_BRIEF.md

---

## Fréquence de travail recommandée
- Chaque session : 1 objectif clair, 1 livrable attendu
- Chaque semaine : bilan rapide (qu'est-ce qui est fait / qu'est-ce qui bloque / quelle est la priorité)
- Chaque mois : relire la roadmap et ajuster si besoin
