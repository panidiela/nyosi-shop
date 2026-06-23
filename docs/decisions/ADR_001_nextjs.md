# ADR 001 — Next.js pour le frontend

## Statut : Accepté — 2026

## Décision
Le frontend Nyosi est construit avec Next.js App Router, TypeScript et Tailwind CSS.

## Raisons
- Déploiement Vercel natif et optimal
- Pages statiques ultra-rapides — crucial pour Android en 3G
- TypeScript = moins de bugs
- Tailwind = design rapide, mobile first
- Serverless functions intégrées pour les appels API

## Conséquences
- Pas d'app React Native — tout fonctionne dans Chrome Android (navigateur)
- Les pages boutique sont des URLs partageables directement sur WhatsApp
- Déploiement automatique depuis GitHub via Vercel
