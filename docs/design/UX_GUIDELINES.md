# UX Guidelines Nyosi

---

## Principe central

> **Chaque écran a une seule mission. Une seule action principale.**

---

## Parcours commerçant (création boutique)

### Étape 1 — `/creer-boutique`

Mission : collecter les infos de la boutique.
Action principale : "Continuer — Ajouter mes produits".

Champs :
1. Nom de la boutique *
2. Catégorie *
3. Numéro WhatsApp *
4. Page Facebook (optionnel)
5. Description courte (optionnel)
6. Ville * + Quartier * (côte à côte)

Principe : les champs obligatoires en premier, les optionnels après.

### Étape 2 — `/ajouter-produits`

Mission : ajouter les produits.
Action principale : "Créer ma boutique".

- Minimum 1 produit, maximum 3
- Chaque produit : photo (optionnel), nom *, prix *, description (optionnel)
- Bouton "Supprimer" discret (texte, pas de bouton rouge)
- Bouton "+ Ajouter un produit" en pointillés vert

### Confirmation — affichée dans `/ajouter-produits`

Après création :
- Grand check vert animé
- Lien de la boutique visible et copiable
- Bouton "Partager mon lien" (navigator.share — menu natif Android)
- Bouton "Copier mon lien" (fallback)
- Lien "Voir ma boutique →"

---

## Parcours client (commande)

### Écran boutique — `/[slug]`

Mission : découvrir les produits et les ajouter au panier.
Action principale : "Ajouter au panier" sur chaque produit.

Structure :
1. Header vert sticky
2. Hero zone : nom boutique, catégorie, ville, description
3. Carte de bienvenue "Bonjour 👋"
4. 3 mini-badges info (Fiable / Ville / Paiement à la livraison)
5. Liste des produits (cartes blanches avec photo)
6. Contact WhatsApp
7. Footer Nyosi

La barre panier verte flottante apparaît dès qu'un article est ajouté.

### Formulaire commande

Mission : collecter les infos de livraison.
Action principale : "Confirmer ma commande".

Champs dans l'ordre :
1. Nom complet *
2. Téléphone *
3. (Séparateur : Livraison)
4. Ville * + Quartier * (côte à côte)
5. Adresse / point de repère *
6. Date * + Heure * (côte à côte)
7. Instructions (optionnel)
8. Rappel paiement à la livraison (radio, non modifiable)

### Confirmation commande

- Grand check vert animé (pop-in)
- Numéro NY-XXXX en blanc sur fond vert foncé
- Récapitulatif : livraison + articles + total
- Encart "Paiement à la livraison" + "Le commerçant vous contactera si nécessaire"
- Bouton "Retour à la boutique"

---

## Règles UX générales

### Feedback immédiat

Chaque action utilisateur doit donner un retour visuel immédiat :
- Bouton → état `active:` (assombri)
- Formulaire soumis → chargement puis résultat
- Copie lien → texte changé en "✓ Lien copié !" pendant 2.5 secondes

### Erreurs de formulaire

Les erreurs apparaissent dans une card rouge sous le formulaire — pas en inline sur chaque champ. Le premier champ vide est évident sans indication supplémentaire.

### Pas d'actions destructrices sans confirmation

Exemple : "Supprimer" un produit est une action discrète (texte underline `text-[#667781]`), pas un bouton rouge flashy. Mais comme on est en MVP, il n'y a pas de dialog de confirmation.

### Scroll et navigation

- Pas de pagination — tout est sur une seule page scrollable
- `window.scrollTo({ top: 0, behavior: "smooth" })` après chaque transition d'écran
- Le header est sticky → le commerçant sait toujours où il est

### Animations

- `card-fade-in` : les cartes apparaissent progressivement (délai de 80ms entre chaque carte)
- `sheet-slide-up` : le formulaire de commande monte depuis le bas
- `pop-in` : le check de confirmation "explose" à l'écran avec un rebond

Ces animations sont légères et fonctionnent sans bibliothèques externes.

---

## Anti-patterns à éviter

| ❌ Ne pas faire | ✅ Faire à la place |
|---|---|
| Trop de champs d'un coup | Découper en étapes |
| Boutons peu visibles | `py-4 font-bold` pleine largeur |
| Textes trop petits | Minimum `text-sm` (14px) |
| Navigation complexe | Une seule action principale par écran |
| Modals qui bloquent tout | Bottom sheets avec overlay translucide |
| Messages d'erreur agressifs | Textes explicatifs en rouge doux |
| Fond plein jaune | Jaune uniquement pour les accents |
