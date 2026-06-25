# ADR-004 — Supabase arrive en Phase 2

**Statut** : Décidé — Juin 2026
**Décideur** : Pani (fondateur)

---

## Contexte

La Phase 1 (MVP) utilise localStorage pour la persistance (voir [ADR-003](ADR-003-LOCALSTORAGE-MVP.md)).

Les limites de localStorage deviendront un vrai problème dès que :
- Un commerçant veut accéder à sa boutique depuis un second téléphone
- Un commerçant perd ses données après une réinitialisation du navigateur
- Nyosi veut proposer un tableau de bord commerçant central
- L'intégration CinetPay (paiements en ligne) nécessite un enregistrement serveur des transactions

Une solution de base de données côté serveur est donc inévitable. La question est **laquelle** et **quand**.

---

## Décision

**Supabase** (PostgreSQL managé) est la solution retenue pour la Phase 2.

La migration interviendra quand **au moins 3 commerçants actifs** utilisent Nyosi et que les limites localStorage deviennent concrètes.

---

## Pourquoi Supabase plutôt que les alternatives

| Critère | Supabase | Firebase | Railway (PostgreSQL brut) |
|---|---|---|---|
| Base de données | PostgreSQL (standard) | NoSQL propriétaire | PostgreSQL (standard) |
| Auth incluse | ✅ Oui | ✅ Oui | ❌ Non |
| Storage fichiers | ✅ Oui | ✅ Oui | ❌ Non |
| Interface admin | ✅ Oui | ✅ Oui | Limitée |
| Open source | ✅ Oui | ❌ Non | N/A |
| Hébergement gratuit | ✅ (Tier Free) | ✅ (Tier Free) | ✅ (Tier Free) |
| SDK Next.js | ✅ Officiel | ✅ Officiel | Manuelle |
| Ecosystème Afrique | ✅ Neutre | ❌ Dépend de Google | ✅ Neutre |

---

## Ce que Supabase apportera en Phase 2

### Auth commerçant
```
Commerçant crée un compte (email + mot de passe)
       ↓
Supabase Auth génère un JWT
       ↓
Le commerçant accède à sa boutique depuis n'importe quel appareil
```

### Tables principales (Phase 2)
- `vendors` — commerçants (nom, slug, catégorie, téléphone, ville)
- `products` — produits avec photos stockées dans Supabase Storage
- `orders` — commandes (client, produits, total, statut)
- `order_items` — lignes de commande
- `payments` — paiements CinetPay (statut, référence, montant)

### Row Level Security (RLS)
Chaque commerçant ne peut voir que ses propres données :
```sql
CREATE POLICY "vendor_owns_data" ON products
  FOR ALL USING (auth.uid() = vendor_id);
```

---

## Avantages

1. **Multi-appareil** : le commerçant accède à sa boutique depuis n'importe quel téléphone.
2. **Sauvegarde réelle** : les données ne sont plus perdues si le navigateur est effacé.
3. **Préparation CinetPay** : les paiements nécessitent un enregistrement côté serveur (webhooks).
4. **Tableau de bord** : statistiques de commandes accessibles pour le commerçant.
5. **PostgreSQL standard** : pas de vendor lock-in — la base peut migrer vers n'importe quel hébergeur.

---

## Limites

1. **Complexité accrue** : ajout d'une couche backend, d'une auth, de variables d'environnement.
2. **Coût potentiel** : au-delà du tier gratuit Supabase (500 Mo, 50 000 requêtes/mois).
3. **Migration localStorage → Supabase** : données des boutiques MVP à exporter/importer manuellement.
4. **Temps de développement** : ~2–4 semaines de travail technique pour migrer complètement.

---

## Plan de migration

1. Créer un compte Supabase et les tables PostgreSQL
2. Ajouter les variables d'environnement dans Vercel (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
3. Installer `@supabase/supabase-js` dans le projet
4. Créer une page de connexion commerçant (`/connexion`)
5. Migrer les lectures/écritures localStorage vers les appels Supabase
6. Proposer aux commerçants MVP d'exporter leurs données et de créer un compte

## Conséquences

- Le code MVP doit éviter de coupler logique métier et localStorage de manière indémêlable
- Les clés localStorage doivent être documentées précisément pour faciliter la migration (voir [ADR-003](ADR-003-LOCALSTORAGE-MVP.md))
- Aucune fonctionnalité nécessitant un compte commerçant ne sera développée avant Phase 2
