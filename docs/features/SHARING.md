# Fonctionnalité : Partage Intelligent

> **Fonctionnalité signature de Nyosi.**
> Un clic. Un message déjà rédigé. Un lien. Un partage immédiat. Sans copier-coller.

---

## Pourquoi c'est la fonctionnalité signature

Beaucoup d'applications permettent de créer une boutique. Ce qui différencie Nyosi, c'est qu'un commerçant peut créer sa boutique, puis **la diffuser partout en un seul geste avec un message professionnel déjà rédigé**.

Cette fonctionnalité est parfaitement alignée avec la cible :
- Les commerçants vendent déjà via WhatsApp et Facebook
- Ils partagent déjà des messages quotidiennement
- Nyosi supprime uniquement la partie répétitive et chronophage : rédiger le message

---

## Principe

**Avant Nyosi**, le commerçant devait :
1. Écrire un texte manuellement
2. Copier son lien boutique
3. Coller le lien dans le message
4. Ouvrir WhatsApp ou Facebook
5. Coller le tout

**Avec Nyosi**, il fait :
1. Taper "Partager ma boutique"
2. Choisir WhatsApp, Facebook, Messenger, SMS, etc.
3. C'est tout.

---

## Message généré automatiquement

```
🛍️ Découvrez la boutique [Nom boutique] !

Découvrez tous nos produits disponibles, choisissez ce qui vous plaît
et passez votre commande directement ici :

🔗 https://nyosi.cm/[slug]

Nous sommes à votre disposition si vous avez besoin d'informations complémentaires.
```

Ce message est :
- **Professionnel** — ton neutre et accueillant
- **Universel** — fonctionne pour tous les secteurs
- **Prêt à envoyer** — aucune modification nécessaire
- **Adapté mobile** — lisible dans une notification WhatsApp ou un post Facebook

---

## Implémentation actuelle

```typescript
async function partagerBoutique() {
  const url = window.location.href; // ou https://${lienCree}
  const nomBoutique = boutique?.nom ?? "Ma boutique";
  const message =
    `🛍️ Découvrez la boutique ${nomBoutique} !\n\n` +
    `Découvrez tous nos produits disponibles, choisissez ce qui vous plaît et passez votre commande directement ici :\n\n` +
    `🔗 ${url}\n\n` +
    `Nous sommes à votre disposition si vous avez besoin d'informations complémentaires.`;

  if (navigator.share) {
    try {
      await navigator.share({ title: nomBoutique, text: message });
    } catch { /* annulé par l'utilisateur */ }
  } else {
    // Fallback desktop : copie le message complet dans le presse-papiers
    navigator.clipboard.writeText(message).then(() => {
      setPartageEtat("copie");
      setTimeout(() => setPartageEtat("idle"), 3000);
    });
  }
}
```

### `navigator.share()` — partage natif Android

Sur Android Chrome, `navigator.share()` ouvre le menu de partage natif du système.
Le commerçant choisit ensuite : WhatsApp, Facebook, Messenger, Telegram, SMS, email, etc.
Nyosi ne choisit pas à sa place — il prépare le message, l'utilisateur choisit le canal.

### Fallback desktop

Si `navigator.share` n'est pas disponible (desktop, navigateurs anciens) :
- `navigator.clipboard.writeText()` copie **le message complet** (pas juste le lien)
- Le bouton affiche "Message copié !" pendant 3 secondes
- Le commerçant peut coller le message directement

---

## Où est disponible le partage

### Pour le commerçant

| Endroit | Bouton | Déclencheur |
|---|---|---|
| `/ajouter-produits` — confirmation création | "Partager ma boutique" | Après création boutique |
| `/[slug]` — page boutique publique | "Partager cette boutique" | En bas des produits |
| `/dashboard` — tableau de bord | "↗ Partager" | Carte "Mon lien boutique" |

### Pour le client final

Non applicable pour l'instant.
À envisager en Phase 3 : "Recommander cette boutique à un ami"

---

## Roadmap Partage Intelligent

### Phase 3 — Open Graph (aperçu riche)
Quand le lien est partagé sur WhatsApp ou Facebook, une carte visuelle s'affiche automatiquement :
image de couverture + nom de la boutique + description.

```html
<meta property="og:title" content="Marie Gâteaux — Boutique Nyosi" />
<meta property="og:description" content="Gâteaux faits maison à Yaoundé. Commandez directement." />
<meta property="og:image" content="https://nyosi.cm/og/marie-gateaux.jpg" />
<meta property="og:url" content="https://nyosi.cm/marie-gateaux" />
```

### Phase 4 — Messages intelligents par secteur
Le message de partage sera personnalisé automatiquement selon la catégorie de la boutique.

| Secteur | Message généré |
|---|---|
| Alimentation & Gâteaux | "🎂 Commandez vos gâteaux personnalisés chez [nom] !" |
| Restaurant & Plats cuisinés | "🍽️ Nos plats du jour, livrés chez vous ! Commandez ici :" |
| Mode & Vêtements | "👗 Découvrez notre nouvelle collection — commandez en ligne !" |
| Beauté & Cosmétiques | "💄 Vos produits beauté préférés, livrés directement chez vous." |
| Électronique & Accessoires | "📱 Accessoires et téléphones — prix imbattables, livraison rapide." |

La catégorie boutique est déjà enregistrée en base — cette fonctionnalité ne demande aucun effort supplémentaire au commerçant.

### Phase 4 — Message personnalisable
Le commerçant pourra modifier le message avant d'envoyer, depuis son tableau de bord.
Le message généré reste la valeur par défaut.

---

## QR Code (Phase 3)
Un QR Code téléchargeable sera proposé pour les flyers physiques et les affiches en boutique.
Généré côté client via une bibliothèque légère (ex : `qrcode.react`).
