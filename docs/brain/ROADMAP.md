# Roadmap Nyosi

> Dernière mise à jour : Juin 2026

## État actuel — MVP livré ✅

Le MVP est fonctionnel. La Phase 1 est considérée comme terminée avec les éléments suivants livrés :
- Création boutique en 2 étapes
- Ajout produits + photos
- Page boutique dynamique `/[slug]`
- Panier, commande, confirmation NY-XXXX
- Partage lien (navigator.share)
- Design System v1.0 (palette WhatsApp verte)
- Déployé sur Vercel

---

## Phase 0 — Validation terrain (Semaine 1–2)
Objectif : confirmer que les clients d'un vendeur utilisent vraiment le lien pour commander.

- [ ] Identifier 3 vendeurs dans l'entourage de Pani (Yaoundé)
- [ ] Créer une boutique test manuellement (page HTML simple sur Vercel)
- [ ] Le vendeur partage le lien sur WhatsApp (bio, messages, status) et Facebook (posts, stories, groupes)
- [ ] Observer : est-ce que des clients cliquent et commandent ?
- [ ] Critère de passage : 3 commandes reçues via le lien en 1 semaine

## Phase 1 — MVP Web (Mois 1)
Objectif : un vendeur peut créer sa boutique seul en 2 minutes.

- [ ] Page d'inscription vendeur (nom boutique, photo, ville, téléphone)
- [ ] Ajout de produits (photo, nom, prix FCFA, description courte)
- [ ] Page boutique publique accessible via lien unique (nyosi.cm/nom-boutique)
- [ ] Formulaire de commande client (prénom, quartier, date souhaitée)
- [ ] Tableau de bord vendeur : liste des commandes reçues
- [ ] Déploiement Vercel + domaine nyosi.cm
- [ ] Critère de passage : 5 vendeurs créent leur boutique seuls sans aide

## Phase 2 — Paiement mobile (Mois 2)
Objectif : le client paie directement, la commande est confirmée automatiquement.

- [ ] Intégration CinetPay (compatible MTN MoMo, Orange Money et autres opérateurs)
- [ ] Confirmation automatique de commande par message WhatsApp
- [ ] Notification vendeur à chaque commande payée
- [ ] Historique des paiements dans le tableau de bord vendeur
- [ ] Critère de passage : 10 paiements réussis via paiement mobile

## Phase 3 — Croissance (Mois 3–4)
Objectif : les vendeurs recommandent Nyosi spontanément à d'autres vendeurs.

- [ ] QR Code téléchargeable pour flyers et affiches en boutique
- [ ] Aperçu riche quand le lien est partagé sur WhatsApp et Facebook (image + titre + description — ce qu'on appelle "Open Graph")
- [ ] Statistiques simples pour le vendeur : commandes du jour / semaine / mois
- [ ] Statut de commande pour le client (en préparation / en livraison / livré)
- [ ] Page "Commander à nouveau" pour les clients réguliers

## Phase 4 — Monétisation (Mois 4–5)
Objectif : passer de gratuit à payant sans perdre les utilisateurs.

- [ ] Freemium : 10 commandes/mois gratuites
- [ ] Plan Standard : 5 000 FCFA/mois — commandes illimitées
- [ ] Plan Pro : 10 000 FCFA/mois — analytics + support prioritaire
- [ ] Paiement abonnement via paiement mobile (CinetPay)

## Phase 5 — Connexion Nyosi Caisse (Mois 6+)
Objectif : les deux produits Nyosi travaillent ensemble.

- [ ] API commune entre Nyosi (boutique) et Nyosi Caisse (stock)
- [ ] Une commande Nyosi met à jour automatiquement le stock dans Nyosi Caisse
- [ ] Dashboard unifié pour les commerçants qui utilisent les deux
- [ ] Rapport journalier combiné : ventes en ligne + ventes en boutique
