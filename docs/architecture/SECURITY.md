# Sécurité Nyosi

---

## Situation actuelle (MVP)

Le MVP n'a pas d'authentification. Il n'y a pas de compte commerçant.

Risques acceptés en MVP :
- **Collision de slugs** : si deux commerçants s'appellent "Marie Gâteaux", le second écrase le premier dans le localStorage. Acceptable en MVP (test local, peu de commerçants).
- **Données non chiffrées** : les données localStorage sont lisibles par n'importe qui avec accès à l'appareil.
- **Pas de validation serveur** : toutes les validations sont côté client uniquement.

Ces risques sont acceptés car le MVP est un outil de validation, pas un produit en production à grande échelle.

---

## Sécurité en Phase 2

### Authentification commerçant

Supabase Auth avec :
- Magic link (email → lien de connexion automatique)
- Ou email/password classique

Chaque commerçant accède uniquement à ses propres boutiques et commandes.

### Row Level Security (RLS) Supabase

```sql
-- Un commerçant ne peut lire/modifier que ses propres données
CREATE POLICY "vendor_own_data" ON vendors
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "vendor_own_products" ON products
  FOR ALL USING (
    vendor_id IN (SELECT id FROM vendors WHERE auth.uid() = id)
  );
```

Les pages boutique publiques (`/[slug]`) restent accessibles sans authentification.

### Validation côté serveur

En Phase 2 avec les API Routes Next.js :
- Validation des types et longueurs de champs
- Sanitisation des entrées (protection XSS)
- Rate limiting sur la création de boutiques

### Paiements

CinetPay gère la sécurité des transactions de paiement mobile (MTN MoMo, Orange Money, etc.).
Nyosi ne stocke jamais de données de carte bancaire (aucune carte bancaire acceptée).
Les webhooks CinetPay sont vérifiés avec une signature HMAC.

---

## Ce qui ne changera jamais

- Jamais de données de carte bancaire
- Jamais de mot de passe en clair
- Jamais de clés API dans le code source (uniquement variables d'environnement)
- Les données personnelles des clients (nom, téléphone, adresse) sont visibles uniquement par le commerçant concerné
