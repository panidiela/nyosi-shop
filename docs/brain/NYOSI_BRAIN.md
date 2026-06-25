# NYOSI — Brain du projet

## Vision
Nyosi est la boutique en ligne instantanée pour les commerçants africains francophones aujourd'hui et anglophone plus tard.
En 2 minutes, n'importe quel vendeur crée sa boutique, obtient un lien, le partage sur WhatsApp et Facebook, et commence à recevoir des commandes automatiques — sans qu'aucun client n'ait besoin de lui envoyer un message.

## Origine du nom
Nyosi signifie "abeille" en langue africaine — symbole de travail, d'organisation et de commerce. Une abeille qui travaille sans se perdre dans le chaos.

## Le problème résolu
Les commerçants africains vendent sur WhatsApp et Facebook. Résultat : des dizaines de messages par jour, des commandes oubliées, des paiements flous, des ventes perdues parce qu'on a répondu trop tard.

WhatsApp et Facebook sont faits pour discuter et poster. Pas pour vendre.

## La solution
Un lien. Une boutique. Des commandes automatiques.

Le commerçant crée sa boutique Nyosi en 2 minutes.
Il obtient un lien : nyosi.cm/marie-gateaux
Il le met dans sa bio WhatsApp, ses stories Facebook, ses posts, ses messages.
Le client clique, commande, paie par paiement mobile.
Le vendeur reçoit une notification. Aucun message à gérer.

## Proposition de valeur
"Nyosi transforme ton WhatsApp et Facebook en boutique. Tes clients découvrent tes produits, commandent directement et te contactent uniquement si nécessaire."

> Ancienne version (archivée) : "Nyosi transforme ton WhatsApp et ton Facebook en boutique — tes clients commandent sans t'envoyer un seul message."
>
> **Pourquoi le changement** : la nouvelle version est plus complète. Elle reconnaît que WhatsApp reste indispensable et ne prétend pas "supprimer" les messages — elle supprime uniquement les messages inutiles et répétitifs.

## Ce que Nyosi fait concrètement

### Pour le vendeur
- Créer sa boutique en 2 minutes
- Ajouter ses produits avec photos et prix en FCFA
- Recevoir les commandes dans un tableau de bord simple
- Recevoir le paiement mobile directement
- Savoir qui a commandé quoi, pour quand, et qui a payé

### Pour le client du vendeur
- Cliquer sur le lien dans WhatsApp
- Voir les produits, les prix, les photos
- Commander en 30 secondes
- Payer MTN MoMo ou Orange Money immédiatement
- Recevoir une confirmation automatique

## Utilisateur cible
- Commerçant solopreneur ou micro-entreprise 1–3 personnes
- Secteur : alimentation, mode, beauté, artisanat, gâteaux, pagnes, cosmétiques
- Téléphone : Android (90%+ du marché camerounais)
- Vend actuellement sur WhatsApp et Facebook (posts, stories, groupes, marketplace)
- Clients actifs : 20–300 sur WhatsApp et Facebook
- Zones prioritaires : Yaoundé, Douala — puis Abidjan, Dakar

## Lien avec Nyosi Caisse
Nyosi est une marque. Deux produits :
- Nyosi (ce projet) → boutique en ligne, commandes, paiement mobile
- Nyosi Caisse → gestion stock, shifts, caissières (déjà en test au café de Pani)

À terme : une commande Nyosi entre automatiquement dans Nyosi Caisse. Le stock se met à jour tout seul. C'est là que la marque devient imbattable.

## Pourquoi maintenant
- MTN MoMo et Orange Money sont ancrés dans les habitudes camerounaises
- Les gens cliquent sur les liens WhatsApp et Facebook naturellement
- Les vendeurs sont déjà sur WhatsApp et Facebook — Nyosi s'intègre dans ce qu'ils font déjà
- Personne n'a encore fait ce produit simple, francophone, mobile first, WhatsApp + Facebook First
- Pani est lui-même le client cible — il connaît la douleur de l'intérieur

## Lien avec Nyosi Caisse
Nyosi est une marque. Deux produits :
- Nyosi (ce projet) → boutique en ligne, commandes, paiement mobile
- Nyosi Caisse → gestion stock, shifts, caissières (déjà en test au café de Pani)

À terme : une commande Nyosi entre automatiquement dans Nyosi Caisse. Le stock se met à jour tout seul. C'est là que la marque devient imbattable.

## État du MVP (mis à jour — Juin 2026)

Le MVP est fonctionnel et déployé sur Vercel. Il comprend :

| Fonctionnalité | Statut |
|---|---|
| Création de boutique (2 étapes) | ✅ Livré |
| Ajout de produits avec photos | ✅ Livré |
| Photos produits (base64, compressées) | ✅ Livré |
| Page boutique dynamique `/[slug]` | ✅ Livré |
| Produits en grille 2 colonnes (mobile) | ✅ Livré |
| Panier avec +/- quantité | ✅ Livré |
| Formulaire de commande complet | ✅ Livré |
| Paiement à la livraison | ✅ Livré (MVP) |
| Confirmation NY-XXXX | ✅ Livré |
| **Partage intelligent** (message pré-rédigé + navigator.share) | ✅ Livré |
| Bouton WhatsApp vendeur permanent | ✅ Livré |
| Design System v1.0 (palette verte) | ✅ Livré |
| Supabase (boutiques + commandes) | ✅ Livré |
| Tableau de bord vendeur (commandes, produits, boutique) | ✅ Livré |
| Compte vendeur / Auth (Phase 3) | ✅ Livré |
| Paiement mobile (CinetPay) | ⏳ Phase 2 |
| Notifications WhatsApp automatiques | ⏳ Phase 3 |
| Open Graph (aperçu riche WhatsApp/Facebook) | ⏳ Phase 3 |
| Messages de partage par secteur | ⏳ Phase 4 |

## Architecture technique actuelle (MVP)

- **Frontend** : Next.js 16 App Router + TypeScript + Tailwind CSS
- **Persistance** : localStorage (navigateur) — pas encore de base de données
- **Déploiement** : Vercel (automatique via git push)
- **Images** : base64 compressées côté client (canvas, max 800px, JPEG 72%)
- **Routes** : `/` `/creer-boutique` `/ajouter-produits` `/[slug]` `/marie-gateaux`

## Design System actuel (v1.0)

| Rôle | Couleur | Code |
|---|---|---|
| Header / Navigation | Vert foncé | `#075E54` |
| Boutons principaux / Prix | Vert | `#25D366` |
| Fond de l'application | Gris clair | `#F0F2F5` |
| Cartes / Formulaires | Blanc | `#FFFFFF` |
| Texte principal | Noir doux | `#1A1A1A` |
| Texte secondaire | Gris | `#667781` |
| Bordures | Gris clair | `#E8E8E4` |
| Accent (logo, badges) | Jaune Nyosi | `#FCB001` |

La palette est inspirée de WhatsApp — familière et rassurante pour les utilisateurs africains.

## Règle fondamentale
Rien n'est décidé si ce n'est pas écrit dans ce fichier.
