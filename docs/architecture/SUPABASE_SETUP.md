# Supabase — Configuration et architecture

**Phase** : Phase 2 (en cours de déploiement)
**Statut** : Installé, en attente de création des tables dans Supabase

---

## Pourquoi Supabase ?

En MVP, les boutiques sont stockées dans `localStorage` — elles n'existent que sur l'appareil du commerçant. Supabase résout ce problème : les données sont en base de données, accessibles depuis n'importe quel téléphone.

Voir [ADR-004](../decisions/ADR-004-SUPABASE-PHASE2.md) pour l'explication complète.

---

## Architecture mise en place

```
Commerçant crée boutique
       ↓
ajouter-produits/page.tsx
       ↓
lib/boutique.ts → sauvegarderBoutique()
       ├── Supabase (si configuré) ← NOUVEAU
       └── localStorage (toujours, backup)

Client ouvre /marie-gateaux
       ↓
[slug]/page.tsx
       ↓
lib/boutique.ts → lireBoutique()
       ├── Supabase (si configuré) → résultat sauvegardé en localStorage
       └── localStorage (fallback si Supabase indisponible)

Client passe commande
       ↓
[slug]/page.tsx → validerCommande()
       ↓
lib/boutique.ts → sauvegarderCommande()
       └── Supabase (si configuré, silencieux sinon)
```

---

## Fichiers créés / modifiés

| Fichier | Rôle |
|---|---|
| `lib/supabase.ts` | Crée le client Supabase (ou `null` si variables manquantes) |
| `lib/boutique.ts` | Couche de données : lecture/écriture Supabase + fallback localStorage |
| `app/ajouter-produits/page.tsx` | Appelle `sauvegarderBoutique()` au lieu d'écrire localStorage directement |
| `app/[slug]/page.tsx` | Appelle `lireBoutique()` et `sauvegarderCommande()` |
| `.env.local` | Variables d'environnement Supabase (non commité dans git) |

---

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://truxwltukghowlfemqbw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important** : `.env.local` n'est jamais commité (il est dans `.gitignore`).
Sur Vercel, ajouter ces variables dans : Settings → Environment Variables.

---

## SQL à exécuter dans Supabase

Aller sur [https://supabase.com](https://supabase.com) → projet Nyosi → **SQL Editor** → coller et exécuter :

```sql
-- Table des boutiques
CREATE TABLE boutiques (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  facebook TEXT DEFAULT '',
  description TEXT DEFAULT '',
  ville TEXT NOT NULL,
  quartier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des produits
CREATE TABLE produits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  boutique_slug TEXT NOT NULL REFERENCES boutiques(slug) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  prix TEXT NOT NULL,
  description TEXT DEFAULT '',
  photo TEXT DEFAULT '',
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  boutique_slug TEXT NOT NULL REFERENCES boutiques(slug),
  numero TEXT NOT NULL,
  client_nom TEXT NOT NULL,
  client_telephone TEXT NOT NULL,
  ville TEXT NOT NULL,
  quartier TEXT NOT NULL,
  adresse TEXT NOT NULL,
  date_livraison TEXT NOT NULL,
  heure_livraison TEXT NOT NULL,
  instructions TEXT DEFAULT '',
  total INTEGER NOT NULL,
  statut TEXT DEFAULT 'en_attente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des lignes de commande
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  produit_nom TEXT NOT NULL,
  produit_prix INTEGER NOT NULL,
  quantite INTEGER NOT NULL,
  sous_total INTEGER NOT NULL
);

-- Activer RLS (sécurité par ligne)
ALTER TABLE boutiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Accès public pour le MVP (sans authentification)
CREATE POLICY "public_boutiques" ON boutiques FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "public_produits" ON produits FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "public_orders" ON orders FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "public_order_items" ON order_items FOR ALL TO anon USING (true) WITH CHECK (true);
```

---

## Comment vérifier que ça marche

1. Lancer le projet en local : `npm run dev`
2. Créer une boutique test → les données doivent apparaître dans Supabase → Table Editor → `boutiques` et `produits`
3. Ouvrir la boutique depuis un autre téléphone (même réseau ou URL Vercel) → elle doit se charger
4. Passer une commande → elle doit apparaître dans Supabase → `orders` et `order_items`

---

## Comportement si Supabase est indisponible

Le code est conçu pour ne jamais bloquer l'utilisateur :

| Situation | Comportement |
|---|---|
| `.env.local` absent ou vide | Supabase ignoré, localStorage utilisé |
| Supabase hors ligne | Erreur capturée silencieusement, localStorage utilisé |
| Boutique introuvable dans Supabase | Recherche dans localStorage automatiquement |
| Erreur lors de la commande | Commande affichée normalement côté UI, log console uniquement |

---

## Prochaines étapes (Phase 2 — suite)

- [ ] Ajouter Supabase Auth pour que le commerçant ait un vrai compte
- [ ] Migrer les photos vers Supabase Storage (au lieu de base64 en base de données)
- [ ] Créer un tableau de bord commerçant pour voir ses commandes
- [ ] Ajouter les notifications WhatsApp automatiques lors d'une nouvelle commande
