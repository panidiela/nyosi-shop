# ADR 004 — CinetPay pour le paiement Mobile Money

## Statut : Accepté — 2026

## Décision
CinetPay est le prestataire de paiement Mobile Money de Nyosi.

## En langage simple
CinetPay c'est le pont entre Nyosi et MTN MoMo / Orange Money. Quand un client clique "Commander et payer", CinetPay s'occupe de tout le processus de paiement Mobile Money. Nyosi reçoit une confirmation et valide la commande automatiquement.

## Ce que ça fait concrètement
Client clique "Commander et payer"
→ CinetPay ouvre le paiement Mobile Money
→ Client confirme sur son téléphone (code secret MTN MoMo ou Orange Money)
→ CinetPay confirme à Nyosi que c'est payé
→ Nyosi valide la commande automatiquement
→ Client reçoit une confirmation
→ Vendeur reçoit une notification

## Raisons
- Supporte MTN MoMo et Orange Money Cameroun
- API simple à intégrer
- Présent en Afrique francophone (Cameroun, Côte d'Ivoire, Sénégal...)
- Pas de terminal physique nécessaire

## Ce que Pani doit faire
Créer un compte professionnel sur cinetpay.com avant la Phase 2.

## Frais
Environ 2–3% par transaction (à inclure dans le pricing Nyosi).
