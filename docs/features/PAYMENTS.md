# Fonctionnalité : Paiements

---

## Situation actuelle — MVP Phase 2

Le formulaire de commande propose deux options visibles :

| Option | Statut | Comportement |
|---|---|---|
| 💵 Payer à la livraison | ✅ Disponible | Sélectionnable, commande validée normalement |
| 📱 Paiement mobile | 🔒 Bientôt | Désactivé (`disabled`), badge "Bientôt", non cliquable |

**Payer à la livraison reste l'option principale.** Au Cameroun, la confiance client repose sur "je paie quand je reçois". Cette option ne sera jamais supprimée.

Le paiement mobile est affiché pour :
1. Montrer aux clients que ça arrive
2. Créer une attente positive
3. Ne rien promettre sans tenir

---

## Fichier concerné

`app/[slug]/page.tsx` — section `/* FORMULAIRE COMMANDE */` → bloc "Mode de paiement"

Structure du bloc :

```tsx
{/* Option 1 : Livraison — disponible */}
<label> <input type="radio" defaultChecked /> Payer à la livraison </label>

{/* Option 2 : Paiement mobile — bientôt */}
<div> <input type="radio" disabled /> Paiement mobile <span>Bientôt</span> </div>
```

---

## Phase 2 — Paiement mobile avec CinetPay

### Solution retenue : CinetPay

CinetPay est le prestataire de paiement sélectionné pour l'Afrique francophone.

**Supports** : MTN MoMo Cameroun, Orange Money Cameroun (exemples — d'autres opérateurs possibles)
**Extension** : Côte d'Ivoire, Sénégal, et autres pays

### Flux de paiement prévu

```
Client sélectionne "Paiement mobile"
       ↓
Client confirme sa commande
       ↓
Nyosi crée la commande en base (statut: "en_attente_paiement")
       ↓
Nyosi appelle POST /api/paiement → CinetPay API
       ↓
CinetPay retourne une URL de paiement sécurisée
       ↓
Client redirigé vers la page CinetPay
       ↓
Client règle avec son opérateur mobile (MTN MoMo, Orange Money, etc.)
       ↓
CinetPay confirme via webhook POST /api/webhook/cinetpay
       ↓
Nyosi met à jour statut commande → "confirmee"
       ↓
Client redirigé vers l'écran de confirmation NY-XXXX
       ↓
Commerçant voit la commande dans son dashboard
```

### Frais CinetPay

- ~2–3% par transaction (à confirmer avec CinetPay)
- Décision à prendre : frais absorbés par Nyosi ou répercutés sur le client

### Statuts commande avec paiement

| Statut | Signification |
|---|---|
| `en_attente` | Commande reçue, paiement à la livraison |
| `en_attente_paiement` | Commande créée, en attente du paiement mobile |
| `confirmee` | Paiement reçu (livraison) ou confirmé (paiement mobile) |
| `livree` | Commande livrée |
| `annulee` | Commande annulée (ou paiement échoué) |

---

## Phase 2 — Fichiers à créer

| Fichier | Rôle |
|---|---|
| `app/api/paiement/route.ts` | Crée une session de paiement CinetPay |
| `app/api/webhook/cinetpay/route.ts` | Reçoit la confirmation CinetPay |
| `lib/cinetpay.ts` | Client CinetPay (init, verify) |

---

## Variables d'environnement nécessaires (Phase 2)

À ajouter dans `.env.local` et dans Vercel → Environment Variables :

```env
CINETPAY_API_KEY=ta_cle_api_cinetpay
CINETPAY_SITE_ID=ton_site_id_cinetpay
CINETPAY_SECRET_KEY=ta_cle_secrete_cinetpay
NEXT_PUBLIC_BASE_URL=https://nyosi.cm
```

Ces variables ne sont **pas** encore dans le projet. Elles seront ajoutées lors de l'activation du paiement mobile.
