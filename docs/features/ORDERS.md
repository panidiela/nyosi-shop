# Fonctionnalité : Commandes

---

## Vue d'ensemble

Le parcours de commande client se passe entièrement sur la page boutique `/[slug]`.
Il est géré par une machine à états à 3 écrans :

```typescript
type EcranActuel = "boutique" | "commande" | "confirmation";
```

```
boutique → (clic "Commander") → commande → (formulaire soumis) → confirmation
confirmation → (clic "Retour à la boutique") → boutique (panier réinitialisé)
```

---

## Formulaire de commande

### Champs

| Champ | Obligatoire | Type | Notes |
|---|---|---|---|
| Nom complet | ✅ | text | Nom du client |
| Téléphone | ✅ | tel | Pour contact si nécessaire |
| Ville | ✅ | text | Ville de livraison |
| Quartier | ✅ | text | Quartier de livraison |
| Adresse / point de repère | ✅ | text | Lieu précis |
| Date de livraison | ✅ | date | Sélecteur natif Android |
| Heure de livraison | ✅ | select | De 07:00 à 20:00 |
| Instructions | — | textarea | Optionnel |

### Heures disponibles

```typescript
const heuresDisponibles = Array.from({ length: 14 }, (_, i) => {
  const h = i + 7;
  return `${String(h).padStart(2, "0")}:00`;
});
// 07:00, 08:00, ..., 20:00
```

### État du formulaire

```typescript
const [commande, setCommande] = useState({
  nom: "", telephone: "", ville: "", quartier: "",
  adresse: "", date: "", heure: "", instructions: "",
});
```

---

## Validation

```typescript
function validerCommande(e: React.FormEvent) {
  e.preventDefault();
  if (!commande.nom.trim())      return setErreurCommande("Le nom complet est obligatoire.");
  if (!commande.telephone.trim()) return setErreurCommande("Le téléphone est obligatoire.");
  if (!commande.ville.trim())    return setErreurCommande("La ville est obligatoire.");
  if (!commande.quartier.trim()) return setErreurCommande("Le quartier est obligatoire.");
  if (!commande.adresse.trim())  return setErreurCommande("L'adresse ou point de repère est obligatoire.");
  if (!commande.date)            return setErreurCommande("La date de livraison est obligatoire.");
  if (!commande.heure)           return setErreurCommande("L'heure de livraison est obligatoire.");
  // → génère le numéro et passe à l'écran confirmation
}
```

---

## Numéro de commande NY-XXXX

```typescript
function genererNumeroCommande() {
  const compteur = parseInt(localStorage.getItem("nyosi_order_counter") ?? "0", 10) + 1;
  localStorage.setItem("nyosi_order_counter", String(compteur));
  return `NY-${String(compteur).padStart(4, "0")}`;
}
```

- Stocké dans `localStorage["nyosi_order_counter"]`
- Incrémenté à chaque commande confirmée
- Format : NY-0001, NY-0002, …, NY-9999

**Limitation MVP** : le compteur est par appareil, pas global. Deux appareils différents peuvent générer le même numéro. Résolu en Phase 2 avec une séquence côté base de données.

---

## Écran de confirmation

Après validation :
- Grand check vert animé (classe `pop-in`)
- Numéro NY-XXXX affiché en blanc sur fond vert foncé
- Récapitulatif livraison (quartier, ville, date, heure)
- Liste des articles commandés avec totaux
- Total général
- Encart "💳 Paiement à la livraison" + "Le commerçant vous contactera si nécessaire."
- Bouton "Retour à la boutique" (réinitialise panier)

---

## Paiement MVP

Mode de paiement unique disponible en MVP : **paiement à la livraison**.

Affiché sous forme de radio button non modifiable dans le formulaire.
Rappelé dans la confirmation.

En Phase 2 : intégration CinetPay pour MTN MoMo et Orange Money.

---

## Ce qui n'est PAS encore fait (Phase 2)

- [ ] Notification WhatsApp automatique au commerçant
- [ ] Notification SMS au client
- [ ] Tableau de bord commerçant (liste des commandes reçues)
- [ ] Statut de commande (en préparation / en livraison / livré)
- [ ] Paiement mobile en ligne (CinetPay)
- [ ] Historique des commandes pour le client

---

## Fichiers concernés

| Fichier | Rôle |
|---|---|
| `app/[slug]/page.tsx` | Tout le parcours commande client |
