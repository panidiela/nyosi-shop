# ADR 003 — Supabase pour la base de données

## Statut : Accepté — 2026

## Décision
Supabase est la base de données principale de Nyosi.

## En langage simple
Supabase c'est comme un grand classeur numérique où Nyosi range toutes les informations : les vendeurs, leurs produits, les commandes, les paiements. Pani peut voir ce classeur depuis une interface visuelle simple, sans écrire de code.

## Raisons
- Gratuit pour commencer
- Interface visuelle pour voir les données sans code
- Auth intégrée (gestion des comptes vendeurs)
- Compatible Vercel
- Déjà utilisé par Nyosi Caisse — cohérence de la marque

## Tables principales
- vendors → les comptes vendeurs
- products → les produits de chaque boutique
- orders → les commandes reçues
- payments → les paiements Mobile Money
