# ADR 004 — CinetPay pour le paiement mobile

## Statut : Accepté — 2026

## Décision
CinetPay est le prestataire de paiement mobile de Nyosi.

## En langage simple
CinetPay c'est le pont entre Nyosi et les opérateurs mobiles (MTN MoMo, Orange Money, etc.). Quand un client clique "Commander et payer", CinetPay s'occupe de tout le processus de paiement mobile. Nyosi reçoit une confirmation et valide la commande automatiquement.

## Ce que ça fait concrètement
Client clique "Commander et payer"
→ CinetPay ouvre le paiement mobile
→ Client confirme sur son téléphone (code secret MTN MoMo, Orange Money, etc.)
→ CinetPay confirme à Nyosi que c'est payé
→ Nyosi valide la commande automatiquement
→ Client reçoit une confirmation
→ Vendeur reçoit une notification

## Raisons
- Compatible avec MTN MoMo, Orange Money Cameroun et autres opérateurs mobiles
- API simple à intégrer
- Présent en Afrique francophone (Cameroun, Côte d'Ivoire, Sénégal...)
- Pas de terminal physique nécessaire

## Ce que Pani doit faire
Créer un compte professionnel sur cinetpay.com avant la Phase 2.

## Frais
Environ 2–3% par transaction (à inclure dans le pricing Nyosi).
