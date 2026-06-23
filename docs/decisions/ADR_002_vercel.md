# ADR 002 — Vercel pour le déploiement

## Statut : Accepté — 2026

## Décision
Vercel est la plateforme de déploiement principale de Nyosi.

## Raisons
- Gratuit pour commencer (Hobby plan)
- Déploiement automatique à chaque git push — Pani fait juste git push, Vercel fait le reste
- Preview URLs pour tester avant de publier en production
- Optimal pour Next.js (même équipe derrière les deux)
- Serverless functions pour les APIs sans gérer de serveur

## Ce que ça veut dire concrètement pour Pani
Pani tape git push → le site est mis à jour automatiquement en 2 minutes. C'est tout.

## Coût estimé
- MVP : 0 FCFA (plan gratuit Vercel)
- Scale : ~10 000 FCFA/mois (Pro plan si nécessaire)
