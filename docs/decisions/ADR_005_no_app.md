# ADR 005 — Pas d'application mobile à télécharger

## Statut : Accepté — 2026

## Décision
Nyosi fonctionne entièrement dans le navigateur Android (Chrome). Pas d'app à télécharger sur le Play Store.

## En langage simple
Quand un client reçoit un lien Nyosi sur WhatsApp, il clique dessus. La boutique s'ouvre directement dans son navigateur Chrome. Comme quand on clique sur un lien YouTube. Pas besoin de télécharger quoi que ce soit.

## Raisons
- Zéro friction pour le client : clic → boutique ouverte. Rien d'autre.
- Télécharger une app = barrière énorme (data, stockage, temps, confiance)
- Les pages Next.js sont optimisées pour mobile et chargent vite
- Le vendeur gère aussi sa boutique depuis son navigateur Android

## Conséquences
- L'expérience doit être parfaite dans Chrome Android sur toutes tailles d'écran
- Les pages doivent charger en moins de 3 secondes même en 3G/4G instable
- Pas de notifications push natives (compensé par WhatsApp + SMS)

## Future évolution possible
PWA (Progressive Web App) = le client peut "installer" Nyosi sur son écran d'accueil comme une vraie app, sans passer par le Play Store. À faire en Phase 3 si la demande est là.
