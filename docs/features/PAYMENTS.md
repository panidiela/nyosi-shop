# Fonctionnalité : Paiements

---

## Situation MVP

**Paiement à la livraison uniquement.**

Le client commande en ligne mais paie en cash ou Mobile Money au moment de la livraison.

Ce mode de paiement est :
- Familier et rassurant pour les Africains (confiance = je paie quand je reçois)
- Zéro intégration technique en MVP
- Compatible avec MTN MoMo et Orange Money (transfert manuel au livreur)

---

## Phase 2 — Paiement Mobile Money en ligne

### Solution retenue : CinetPay

CinetPay est le prestataire de paiement Mobile Money sélectionné.

**Supports** : MTN MoMo Cameroun, Orange Money Cameroun
**Extension** : Côte d'Ivoire, Sénégal, et autres pays d'Afrique francophone

### Flux de paiement prévu (Phase 2)

```
Client clique "Payer maintenant"
       ↓
Nyosi appelle l'API CinetPay (POST /api/paiement)
       ↓
CinetPay retourne une URL de paiement
       ↓
Client redirigé vers la page de paiement CinetPay
       ↓
Client entre son code MTN MoMo ou Orange Money
       ↓
CinetPay confirme le paiement via webhook
       ↓
Nyosi reçoit le webhook → commande validée
       ↓
Client redirigé vers la confirmation NY-XXXX
       ↓
Commerçant reçoit une notification WhatsApp
```

### Frais

- ~2–3% par transaction (CinetPay)
- À intégrer dans le pricing Nyosi ou répercuter sur le client (frais de service)

### Prérequis pour la Phase 2

1. Compte professionnel CinetPay créé et validé
2. API Key et Site ID CinetPay configurés dans Vercel (variables d'environnement)
3. Supabase en place pour enregistrer les paiements
4. Webhook endpoint Next.js créé : `app/api/webhook/cinetpay/route.ts`

---

## Considérations futures

### Orange Money direct

Orange Money propose une API directe (sans intermédiaire comme CinetPay) pour les volumes importants. À considérer si Nyosi dépasse 1 000 transactions/mois.

### MTN MoMo API

MTN propose aussi une API directe. Même considération.

### Paiement fractionné

Non prévu dans la roadmap actuelle. À évaluer en fonction des demandes terrain.

---

## Fichiers concernés

| Fichier | Rôle |
|---|---|
| `app/[slug]/page.tsx` | Bouton paiement à la livraison (MVP) |
| `app/api/webhook/cinetpay/route.ts` | À créer en Phase 2 |
