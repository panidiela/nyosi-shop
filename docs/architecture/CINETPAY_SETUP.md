# CinetPay — Architecture et configuration

**Phase** : Phase 2 (à venir)
**Statut** : Documentation prête, intégration non démarrée

---

## Pourquoi CinetPay ?

CinetPay est le leader du paiement en ligne en Afrique francophone. Il unifie MTN MoMo et Orange Money sous une seule API.

| Critère | CinetPay |
|---|---|
| MTN MoMo Cameroun | ✅ |
| Orange Money Cameroun | ✅ |
| Côte d'Ivoire, Sénégal | ✅ |
| API REST simple | ✅ |
| SDK disponible | ✅ |
| Compte entreprise requis | ✅ (KYC) |
| Frais | ~2–3% par transaction |

---

## Ce qu'il faut avant de commencer

1. **Compte CinetPay** : créer un compte professionnel sur [cinetpay.com](https://cinetpay.com)
2. **Validation KYC** : fournir les documents d'entreprise (RCCM, CNI)
3. **Clés API** : récupérer `API_KEY`, `SITE_ID` et `SECRET_KEY` dans le tableau de bord CinetPay
4. **Domaine HTTPS** : Vercel fournit automatiquement un domaine HTTPS — requis pour les webhooks

---

## Variables d'environnement

### `.env.local` (local)

```env
CINETPAY_API_KEY=ta_cle_api
CINETPAY_SITE_ID=ton_site_id
CINETPAY_SECRET_KEY=ta_cle_secrete
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Vercel → Settings → Environment Variables (production)

```
CINETPAY_API_KEY        → valeur de production
CINETPAY_SITE_ID        → valeur de production
CINETPAY_SECRET_KEY     → valeur de production
NEXT_PUBLIC_BASE_URL    → https://nyosi.cm
```

> ⚠️ Ne jamais commiter ces clés dans git. Elles sont dans `.env.local` (ignoré par git).

---

## Fichiers à créer en Phase 2

### `lib/cinetpay.ts` — client CinetPay

```typescript
const BASE = "https://api-checkout.cinetpay.com/v2";

export async function initierPaiement(params: {
  transactionId: string;
  montant: number;
  description: string;
  clientNom: string;
  clientTelephone: string;
  returnUrl: string;
  notifyUrl: string;
}) {
  const res = await fetch(`${BASE}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: params.transactionId,
      amount: params.montant,
      currency: "XAF",
      description: params.description,
      return_url: params.returnUrl,
      notify_url: params.notifyUrl,
      customer_name: params.clientNom,
      customer_phone_number: params.clientTelephone,
      channels: "MOBILE_MONEY",
      lang: "fr",
    }),
  });
  return res.json();
}

export async function verifierPaiement(transactionId: string) {
  const res = await fetch(`${BASE}/payment/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: transactionId,
    }),
  });
  return res.json();
}
```

---

### `app/api/paiement/route.ts` — endpoint d'initiation

```typescript
import { NextRequest, NextResponse } from "next/server";
import { initierPaiement } from "@/lib/cinetpay";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { orderId, boutiquSlug, montant, clientNom, clientTelephone } = await req.json();

  const transactionId = `nyosi_${orderId}_${Date.now()}`;
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  const result = await initierPaiement({
    transactionId,
    montant,
    description: `Commande Nyosi — ${boutiquSlug}`,
    clientNom,
    clientTelephone,
    returnUrl: `${base}/${boutiquSlug}?paiement=ok`,
    notifyUrl: `${base}/api/webhook/cinetpay`,
  });

  if (result.code !== "201") {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  // Sauvegarder le transactionId dans Supabase
  await supabase?.from("orders").update({
    statut: "en_attente_paiement",
    transaction_id: transactionId,
  }).eq("id", orderId);

  return NextResponse.json({ urlPaiement: result.data.payment_url });
}
```

---

### `app/api/webhook/cinetpay/route.ts` — réception confirmation

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifierPaiement } from "@/lib/cinetpay";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cpm_trans_id } = body;

  // Vérifier le paiement auprès de CinetPay
  const result = await verifierPaiement(cpm_trans_id);

  if (result.data?.status === "ACCEPTED") {
    await supabase
      ?.from("orders")
      .update({ statut: "confirmee" })
      .eq("transaction_id", cpm_trans_id);
  }

  return NextResponse.json({ received: true });
}
```

---

## Migration base de données (Phase 2)

Ajouter deux colonnes à la table `orders` dans Supabase :

```sql
ALTER TABLE orders
  ADD COLUMN transaction_id TEXT DEFAULT NULL,
  ADD COLUMN mode_paiement TEXT DEFAULT 'livraison';
```

---

## Flux complet illustré

```
Client choisit "Paiement mobile"
         │
         ▼
[POST /api/paiement]
         │
         ▼ CinetPay API
   URL de paiement
         │
         ▼
Client paie sur la page CinetPay
         │
         ▼ Webhook automatique
[POST /api/webhook/cinetpay]
         │
         ▼ Supabase
   order.statut = "confirmee"
         │
         ▼
Client redirigé vers /{slug}?paiement=ok
         │
         ▼
Écran de confirmation NY-XXXX
```

---

## Checklist d'activation

- [ ] Compte CinetPay validé (KYC)
- [ ] Clés API récupérées et ajoutées dans Vercel
- [ ] Colonne `transaction_id` et `mode_paiement` ajoutées à Supabase
- [ ] `lib/cinetpay.ts` créé
- [ ] `app/api/paiement/route.ts` créé et testé
- [ ] `app/api/webhook/cinetpay/route.ts` créé et testé
- [ ] Webhook URL déclaré dans le tableau de bord CinetPay
- [ ] Option "Paiement mobile" activée dans `app/[slug]/page.tsx` (retirer `disabled`)
- [ ] Tests end-to-end en mode sandbox CinetPay
