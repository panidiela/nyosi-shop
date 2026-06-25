# ADR-003 — localStorage est utilisé pour la persistance des données en MVP

**Statut** : Accepté — Juin 2026
**Décideur** : Pani (fondateur)

---

## Contexte

Nyosi est un MVP. La priorité absolue est de **valider le produit avec de vrais commerçants** avant d'investir dans une infrastructure de base de données.

Plusieurs options de persistance ont été considérées :

| Option | Avantage | Inconvénient |
|---|---|---|
| localStorage | Zéro infrastructure, zéro coût, zéro délai | Limité au navigateur, pas multi-appareil |
| Supabase (PostgreSQL) | Robuste, multi-appareil, extensible | Nécessite un backend, une auth, un compte |
| Firebase | Rapide à configurer | Vendor lock-in Google, facturation complexe |
| SQLite (côté serveur) | Simple | Nécessite un serveur, Vercel ne le supporte pas facilement |

---

## Décision

**localStorage** est la solution de persistance pour le MVP.

Toutes les données sont stockées dans le navigateur de l'utilisateur :

| Clé localStorage | Contenu |
|---|---|
| `nyosi_draft_boutique` | Boutique en cours de création (étape 1) |
| `nyosi_boutique_${slug}` | Boutique créée avec ses produits |
| `nyosi_order_counter` | Compteur pour générer les numéros NY-XXXX |

---

## Avantages

1. **Zéro infrastructure** : pas de base de données à configurer, pas de compte backend.
2. **Zéro coût** : le MVP tourne entièrement sur Vercel Free Tier.
3. **Déploiement immédiat** : une seule commande `git push` suffit pour être en production.
4. **Simplicité du code** : `localStorage.setItem()` / `localStorage.getItem()` — compréhensible sans être développeur.
5. **Pas d'auth nécessaire** : le commerçant ne crée pas de compte. Le localStorage est son "compte".
6. **Performance** : les données sont lues localement, sans requête réseau.
7. **Concentration sur l'essentiel** : permet de tester le produit sans distraction technique.

---

## Limites

1. **Un seul appareil** : la boutique n'est accessible que sur l'appareil où elle a été créée.
2. **Pas de sauvegarde** : si le cache du navigateur est effacé, la boutique disparaît.
3. **Pas de compte** : le commerçant ne peut pas se connecter depuis un autre téléphone.
4. **Capacité** : localStorage est limité à ~5 Mo par domaine. Suffisant pour quelques boutiques avec photos compressées.
5. **Pas de partage entre commerçants** : on ne peut pas voir les boutiques des autres depuis l'admin.

---

## Conséquences

- La règle absolue : **ne jamais toucher au localStorage sans revue approfondie** — c'est la seule persistance du MVP.
- La compression des photos (canvas API, max 800px, JPEG 72%) est obligatoire pour ne pas dépasser la limite de 5 Mo.
- La migration vers Supabase (Phase 2) devra exporter les données localStorage en JSON et les importer en base de données.
- L'interface ne propose pas de "connexion" ni de "compte" — ce concept n'existe pas en MVP.
- Chaque page qui lit le localStorage doit gérer le cas "données absentes" (boutique introuvable → écran d'erreur propre).
