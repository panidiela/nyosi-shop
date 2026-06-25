# Base de données Nyosi

---

## Situation actuelle (MVP)

**Pas de base de données.** Les données sont stockées dans le `localStorage` du navigateur.

Voir `docs/architecture/TECH_STACK.md` pour les détails du schéma localStorage.

---

## Schéma prévu pour la Phase 2 (Supabase / PostgreSQL)

### Table : `vendors` (commerçants)

```sql
CREATE TABLE vendors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMP DEFAULT NOW(),
  nom         TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  categorie   TEXT NOT NULL,
  whatsapp    TEXT NOT NULL,
  facebook    TEXT,
  description TEXT,
  ville       TEXT NOT NULL,
  quartier    TEXT NOT NULL,
  email       TEXT UNIQUE,   -- pour l'auth
  actif       BOOLEAN DEFAULT TRUE
);
```

### Table : `products` (produits)

```sql
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMP DEFAULT NOW(),
  vendor_id   UUID REFERENCES vendors(id) ON DELETE CASCADE,
  nom         TEXT NOT NULL,
  prix        INTEGER NOT NULL,           -- en FCFA, entier
  description TEXT,
  photo_url   TEXT,                       -- URL Supabase Storage
  ordre       INTEGER DEFAULT 0,          -- ordre d'affichage
  actif       BOOLEAN DEFAULT TRUE
);
```

### Table : `orders` (commandes)

```sql
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMP DEFAULT NOW(),
  vendor_id       UUID REFERENCES vendors(id),
  numero          TEXT UNIQUE NOT NULL,   -- NY-0001, NY-0002...
  statut          TEXT DEFAULT 'reçue',   -- reçue, préparée, livrée, annulée
  client_nom      TEXT NOT NULL,
  client_tel      TEXT NOT NULL,
  ville           TEXT NOT NULL,
  quartier        TEXT NOT NULL,
  adresse         TEXT NOT NULL,
  date_livraison  DATE NOT NULL,
  heure_livraison TEXT NOT NULL,
  instructions    TEXT,
  total_fcfa      INTEGER NOT NULL,
  paiement_mode   TEXT DEFAULT 'livraison'  -- livraison, mobile_money
);
```

### Table : `order_items` (lignes de commande)

```sql
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  nom         TEXT NOT NULL,    -- snapshot du nom au moment de la commande
  prix_unitaire INTEGER NOT NULL,
  quantite    INTEGER NOT NULL,
  total_fcfa  INTEGER NOT NULL
);
```

### Table : `payments` (paiements mobiles — Phase 2)

```sql
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMP DEFAULT NOW(),
  order_id        UUID REFERENCES orders(id),
  provider        TEXT NOT NULL,     -- mtn_momo, orange_money
  transaction_id  TEXT UNIQUE,       -- ID CinetPay
  montant_fcfa    INTEGER NOT NULL,
  statut          TEXT DEFAULT 'en_attente',  -- en_attente, confirmé, échoué, remboursé
  metadata        JSONB              -- données brutes CinetPay
);
```

---

## Génération du slug

La fonction `slugify()` génère le slug à partir du nom de la boutique :

```typescript
function slugify(nom: string) {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")      // supprime les accents
    .replace(/[^a-z0-9]+/g, "-") // remplace tout sauf lettres/chiffres par -
    .replace(/^-+|-+$/g, "")     // supprime les - au début et à la fin
    .slice(0, 40);               // limite à 40 caractères
}
```

Exemples :
- "Marie Gâteaux" → `marie-gateaux`
- "Mode Chez Sandra" → `mode-chez-sandra`
- "Beauté & Cosmétiques Yaoundé" → `beaute-cosmetiques-yaounde`

---

## Génération des numéros de commande

Format : `NY-XXXX` (NY suivi de 4 chiffres avec zéros)

```typescript
function genererNumeroCommande() {
  const compteur = parseInt(localStorage.getItem("nyosi_order_counter") ?? "0", 10) + 1;
  localStorage.setItem("nyosi_order_counter", String(compteur));
  return `NY-${String(compteur).padStart(4, "0")}`;
}
```

En Phase 2, ce compteur sera géré côté base de données (séquence PostgreSQL) pour être global et sans collision.

---

## Migration localStorage → Supabase

La migration MVP → Phase 2 implique :

1. Créer les tables Supabase ci-dessus
2. Implémenter l'authentification commerçant (email/magic link)
3. Migrer `app/creer-boutique/page.tsx` → appel API POST `/api/vendors`
4. Migrer `app/ajouter-produits/page.tsx` → appel API POST `/api/products`
5. Migrer `app/[slug]/page.tsx` → appel API GET `/api/boutique/[slug]` (côté serveur)
6. Migrer les photos → Supabase Storage (fini le base64)
7. Migrer les commandes → appel API POST `/api/orders`
8. Déprécier le localStorage

Cette migration ne doit **pas** casser les boutiques existantes (les slugs restent les mêmes).
