# Fonctionnalité : Partage

---

## Vue d'ensemble

Le partage du lien boutique est **la fonctionnalité centrale** de Nyosi.
C'est ce qui permet au commerçant de transformer ses réseaux sociaux en boutique.

---

## Implémentation

### `navigator.share()` — partage natif Android

Sur Android Chrome, `navigator.share()` ouvre le menu de partage natif du système :
WhatsApp, Facebook, Messenger, SMS, email, etc.

```typescript
async function partagerLien() {
  const texte = `Voici ma boutique Nyosi. Commande ici : https://${lienCree}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: draft?.nom ?? "Ma boutique",
        text: texte,
      });
    } catch { /* L'utilisateur a annulé — ne rien faire */ }
  } else {
    // Fallback : copier dans le presse-papiers
    navigator.clipboard.writeText(`https://${lienCree}`).then(() => {
      setPartageEtat("copie");
      setTimeout(() => setPartageEtat("idle"), 3000);
    });
  }
}
```

### Fallback — copie dans le presse-papiers

Si `navigator.share` n'est pas disponible (desktop, navigateurs anciens) :
- `navigator.clipboard.writeText()` copie le lien
- Le bouton affiche "Lien copié !" pendant 2.5–3 secondes

---

## Lien généré

```typescript
setLienCree(`${window.location.host}/${s}`);
```

- En développement local : `localhost:3000/marie-gateaux`
- En production : `nyosi.cm/marie-gateaux` (ou l'URL Vercel)

Pas de `https://` préfixé ici — ajouté au moment du partage/copie.

---

## Où est disponible le partage

### Pour le commerçant

1. **Page de confirmation après création** (`/ajouter-produits`)
   - Bouton "Partager mon lien" (navigator.share)
   - Bouton "Copier mon lien" (clipboard)

2. **Page boutique** (`/[slug]`)
   - Bouton "Partager cette boutique" dans la section contact

### Pour le client

Non applicable — le client ne partage pas la boutique dans le MVP.
(À envisager en Phase 3 : "Partager cette boutique avec un ami")

---

## Texte de partage

```
"Voici ma boutique Nyosi. Commande ici : https://nyosi.cm/marie-gateaux"
```

Ce texte est simple et direct — optimisé pour être lu dans une notification WhatsApp.

---

## Open Graph (Phase 3)

En Phase 3, les pages boutique auront des balises Open Graph pour générer un aperçu riche quand le lien est partagé sur WhatsApp ou Facebook :

```html
<meta property="og:title" content="Marie Gâteaux — Boutique Nyosi" />
<meta property="og:description" content="Gâteaux faits maison à Yaoundé. Commandez directement." />
<meta property="og:image" content="https://nyosi.cm/boutiques/marie-gateaux/cover.jpg" />
<meta property="og:url" content="https://nyosi.cm/marie-gateaux" />
```

Cela transforme le lien partagé en une carte visuelle avec image, titre et description.

---

## QR Code (Phase 3)

Un QR Code téléchargeable sera proposé pour les flyers physiques et les affiches en boutique.
Généré côté client via une bibliothèque légère.
