# Fonctionnalité : Tableau de bord commerçant

**Phase** : Phase 2 MVP — Juin 2026
**Routes** : `/dashboard`, `/dashboard/commandes`, `/dashboard/produits`, `/dashboard/boutique`

---

## Vue d'ensemble

Le tableau de bord est le **bureau de travail du commerçant**. Il lui permet de gérer sa boutique sans passer par WhatsApp.

Il est accessible depuis n'importe quel appareil en entrant le slug de sa boutique.

---

## Architecture multi-boutique

Le code est conçu pour supporter plusieurs boutiques à terme.

| Concept | Implémentation |
|---|---|
| Boutique active | `localStorage("nyosi_current_slug")` — slug de la boutique affichée |
| Changement de boutique | Écran "accès" avec champ slug (futur : sélecteur de boutique) |
| Toutes les fonctions de données | Prennent un `slug` en paramètre — jamais de boutique "globale" implicite |

Quand Nyosi supportera plusieurs boutiques par commerçant, on ajoutera un tableau `nyosi_mes_boutiques` et un écran de sélection. Le reste du code ne changera pas.

---

## Routes

| Route | Rôle |
|---|---|
| `/dashboard` | Accueil : résumé boutique + 4 cartes |
| `/dashboard/commandes` | Liste des commandes avec gestion des statuts |
| `/dashboard/produits` | Catalogue : ajouter, modifier, supprimer |
| `/dashboard/boutique` | Modifier les infos de la boutique |

---

## Navigation

`app/dashboard/layout.tsx` — barre fixe en bas avec 4 onglets :

| Onglet | Route | Icône |
|---|---|---|
| Accueil | `/dashboard` | Maison |
| Commandes | `/dashboard/commandes` | Document |
| Produits | `/dashboard/produits` | Boîte |
| Boutique | `/dashboard/boutique` | Boutique |

L'onglet actif s'affiche en `#075E54`. Les autres en `#667781/60`.

---

## Accès au dashboard

Si `nyosi_current_slug` est absent du localStorage (nouvel appareil, première visite), l'écran d'accès demande le slug de la boutique :

```
Entrez le lien ou le nom de votre boutique
→ [marie-gateaux]
→ Accéder à mon bureau
```

Le slug est extrait de l'URL si le commerçant colle son lien complet.

---

## Couche de données — `lib/dashboard.ts`

Toutes les opérations du dashboard passent par ce fichier.

| Fonction | Description |
|---|---|
| `getSlugActuel()` | Lit `nyosi_current_slug` depuis localStorage |
| `setSlugActuel(slug)` | Définit la boutique active |
| `getBoutiqueActuelle()` | Récupère la boutique active (Supabase → localStorage) |
| `getBoutiqueParSlug(slug)` | Récupère une boutique par slug |
| `mettreAJourBoutique(slug, data)` | Met à jour les infos (Supabase + localStorage) |
| `getProduits(slug)` | Liste les produits (Supabase → localStorage) |
| `ajouterProduit(slug, produit)` | Ajoute un produit dans Supabase |
| `mettreAJourProduit(id, data)` | Met à jour un produit |
| `supprimerProduit(id)` | Supprime un produit |
| `getCommandes(slug)` | Liste les commandes avec leurs articles |
| `mettreAJourStatut(orderId, statut)` | Change le statut d'une commande |

---

## Page Accueil — `/dashboard`

4 cartes :

**Carte Commandes** : total + répartition par statut (en attente, confirmée, livrée, annulée) → lien vers `/dashboard/commandes`

**Carte Produits** : nombre de produits → lien vers `/dashboard/produits`

**Carte Lien boutique** : URL copiable + bouton partager (navigator.share)

**Carte Statistiques** :
- Visites : "Bientôt" (Phase 3)
- Commandes totales
- Produits vendus (quantité livrée)
- CA estimé (somme des commandes non annulées)

---

## Page Commandes — `/dashboard/commandes`

- Liste toutes les commandes de la boutique (Supabase)
- Filtres par statut (tous, en attente, confirmée, livrée, annulée)
- Chaque carte est cliquable → révèle les détails + les articles
- Boutons de changement de statut :
  - En attente (amber)
  - Confirmée (blue)
  - Livrée (green)
  - Annulée (gray)
- Le changement de statut est enregistré en temps réel dans Supabase

---

## Page Produits — `/dashboard/produits`

- Liste tous les produits avec photo, nom, prix, description
- **Modifier** : ouvre un formulaire inline (avec photo)
- **Supprimer** : demande confirmation avant suppression
- **Ajouter** : bouton en haut + bouton en bas avec formulaire inline
- Compression photo identique à la création boutique (canvas, 800px, JPEG 72%)

---

## Page Boutique — `/dashboard/boutique`

Formulaire de modification :
- Nom (obligatoire)
- Description courte (optionnel)
- WhatsApp (obligatoire)
- Facebook (optionnel)
- Ville (obligatoire)
- Quartier (optionnel)
- Photo de couverture : placeholder "Bientôt — Phase 3"

Les champs non modifiables (catégorie, slug/lien) sont affichés en lecture seule.

La modification est enregistrée dans Supabase et dans localStorage simultanément.

---

## Statuts des commandes

| Statut | Couleur | Signification |
|---|---|---|
| `en_attente` | Amber | Nouvelle commande reçue, non traitée |
| `confirmee` | Blue | Commerçant a confirmé la commande |
| `livree` | Green | Commande livrée au client |
| `annulee` | Gray | Commande annulée |

---

## Données Supabase utilisées

- Table `boutiques` — lecture + mise à jour
- Table `produits` — lecture, ajout, mise à jour, suppression
- Table `orders` — lecture + mise à jour statut
- Table `order_items` — lecture (pour les détails des commandes)
