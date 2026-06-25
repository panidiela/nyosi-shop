# ADR-005 — Partage Intelligent comme fonctionnalité signature

> Date : Juin 2026
> Statut : Décidé ✅
> Décideur : Pani (CEO) — validé après premiers tests terrain

---

## Contexte

Lors des premiers tests du MVP, une observation s'est imposée :

Le moment où le commerçant crée sa boutique est fort. Mais le moment suivant — partager cette boutique — était encore trop laborieux. Le commerçant devait :
1. Copier le lien
2. Rédiger un message
3. Ouvrir WhatsApp ou Facebook
4. Coller le tout

Ce n'est pas conforme au principe Nyosi : **supprimer les tâches répétitives et sans valeur**.

---

## Décision

**"Partager ma boutique" devient la fonctionnalité signature de Nyosi.**

Un seul clic génère automatiquement un message professionnel complet avec le lien, et ouvre le menu de partage natif du téléphone.

Le commerçant choisit uniquement le canal (WhatsApp, Facebook, SMS, etc.). Il ne rédige rien.

---

## Message par défaut

```
🛍️ Découvrez la boutique [Nom] !

Découvrez tous nos produits disponibles, choisissez ce qui vous plaît
et passez votre commande directement ici :

🔗 https://nyosi.cm/[slug]

Nous sommes à votre disposition si vous avez besoin d'informations complémentaires.
```

---

## Implémentation technique

- `navigator.share({ title, text })` — API native Android Chrome
- Fallback desktop : `navigator.clipboard.writeText(message)` — copie le message complet
- Disponible sur : `/ajouter-produits` (après création), `/[slug]` (page boutique), `/dashboard`

---

## Conséquences

**Positif :**
- Expérience commerçant fluide dès la première utilisation
- Message professionnel sans effort — renforce la crédibilité du vendeur
- Différenciateur fort vs. toutes les boutiques concurrentes
- Adapté au comportement existant (partager des messages sur WhatsApp/Facebook)

**Neutre :**
- Le message est en "vous" (formel) — convient à tous les secteurs
- Le message n'est pas encore personnalisé par secteur (Phase 4)

**Extension future :**
- Phase 3 : Open Graph (aperçu riche avec image sur WhatsApp/Facebook)
- Phase 4 : Messages intelligents par secteur (gâteaux, mode, cosmétiques, etc.)
- Phase 4 : Message personnalisable depuis le dashboard

---

## Règle produit ajoutée

> WhatsApp et Facebook restent les principaux canaux de vente et de relation client.
> Nyosi est leur extension commerciale.
> Nyosi ne cherche pas à remplacer WhatsApp.
> Nyosi cherche à supprimer uniquement les échanges répétitifs.
