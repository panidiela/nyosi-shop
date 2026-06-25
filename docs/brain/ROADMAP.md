# Roadmap Nyosi

> Dernière mise à jour : Juin 2026

## État actuel — MVP + Phase 3 livrés ✅

Le MVP est fonctionnel et évolue. Les éléments livrés :

- Création boutique en 2 étapes
- Ajout produits + photos (compressées)
- Page boutique dynamique `/[slug]` — grille 2 colonnes
- Panier, commande, confirmation NY-XXXX
- **Partage intelligent** — un clic, message pré-rédigé, `navigator.share` natif
- Bouton WhatsApp vendeur permanent (visible sans panier)
- Design System v1.0 (palette WhatsApp verte)
- Supabase (boutiques + commandes + produits)
- Tableau de bord vendeur (commandes, produits, boutique)
- Comptes vendeurs sécurisés (Supabase Auth — Phase 3)
- Déployé sur Vercel

---

## Contraintes techniques permanentes (toutes phases)

Ces règles s'appliquent à chaque phase, sans exception :

- **Web mobile uniquement** — pas d'APK, pas d'application Play Store au MVP
- **Chrome Android** — navigateur cible prioritaire
- **Chargement < 3 secondes en 3G** — réseau réel Cameroun (1–3 Mbps)
- **Pas de vidéos** — trop lourdes sur données mobiles
- **Pas de bibliothèques JS lourdes** — bundle JS minimal
- **Photos compressées** — max 800px, JPEG 72% avant stockage
- **Pas de polices Google Fonts** — police système Android

> Ces contraintes ne disparaissent pas en Phase 2 ou 3. La croissance se fait toujours sur des connexions africaines, pas sur du fibre parisien.

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
- [ ] **Open Graph** — aperçu riche quand le lien est partagé (image + titre + description dans WhatsApp/Facebook)
- [ ] Statistiques simples pour le vendeur : commandes du jour / semaine / mois
- [ ] Statut de commande pour le client (en préparation / en livraison / livré)
- [ ] Page "Commander à nouveau" pour les clients réguliers
- [ ] Notifications automatiques (WhatsApp ou SMS) à chaque commande reçue

## Phase 4 — Messages intelligents par secteur (Mois 4–5)
Objectif : le message de partage est personnalisé selon le type de commerce, sans effort du vendeur.

**Principe :**
Nyosi sait que Marie vend des gâteaux. Elle vend à Yaoundé. Nyosi génère un message spécifique à son secteur.

**Exemples de messages par secteur :**

| Secteur | Message généré |
|---|---|
| Gâteaux & pâtisserie | "🎂 Commandez vos gâteaux personnalisés chez [nom] !" |
| Restaurant & plats cuisinés | "🍽️ Commandez nos plats du jour, livrés chez vous !" |
| Mode & vêtements | "👗 Découvrez notre nouvelle collection — commandez en ligne !" |
| Cosmétiques & beauté | "💄 Vos produits beauté préférés, livrés directement chez vous." |
| Téléphones & électronique | "📱 Accessoires et téléphones — prix imbattables, livraison rapide." |

**Comment ça marche techniquement :**
- La catégorie boutique est déjà enregistrée
- Nyosi choisit automatiquement le bon template
- Le commerçant peut modifier le message avant d'envoyer (futur)

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
