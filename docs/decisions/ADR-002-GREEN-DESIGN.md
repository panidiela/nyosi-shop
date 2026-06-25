# ADR-002 — L'identité visuelle de Nyosi est basée sur le vert

**Statut** : Accepté — Juin 2026
**Décideur** : Pani (fondateur)

---

## Contexte

Au lancement, Nyosi avait une identité visuelle basée sur le **jaune (#FCB001) et le noir**.

Ce choix semblait logique : le jaune est énergique, visible, africain. Mais lors des tests d'interface, plusieurs problèmes sont apparus :

- Le jaune sur fond blanc manque de contraste
- Le jaune utilisé pour les boutons ressemble aux alertes ("attention")
- L'ensemble donnait une impression de marketplace peu rassurante

Par ailleurs, l'analyse de l'usage réel a confirmé que **WhatsApp et Facebook sont les canaux de distribution principaux** de Nyosi. Les utilisateurs cliquent sur les liens Nyosi directement depuis WhatsApp.

---

## Décision

L'identité visuelle principale de Nyosi utilise la **palette verte inspirée de WhatsApp** :

| Rôle | Hex | Justification |
|---|---|---|
| Header / Navigation | `#075E54` | Vert WhatsApp foncé — familier, professionnel |
| CTA / Prix | `#25D366` | Vert WhatsApp vif — action, positivité |
| Fond | `#F0F2F5` | Gris clair WhatsApp — neutre et lisible |
| Accent Nyosi | `#FCB001` | Jaune réservé au logo et aux badges |

Le jaune `#FCB001` est **conservé** mais restreint à l'identité de marque (logo, icône abeille, badges). Il n'est plus utilisé pour les actions ou les fonds.

---

## Avantages

1. **Reconnaissance instantanée** : le commerçant ouvre Nyosi et voit les codes couleur de WhatsApp — il se sent "chez lui".
2. **Confiance** : le vert professionnel (`#075E54`) inspire la sérieux sans être austère.
3. **Lisibilité** : le texte blanc sur vert foncé et le vert sur fond gris clair offrent d'excellents contrastes.
4. **Cohérence avec le positionnement** : "WhatsApp + Facebook First" est renforcé visuellement.
5. **Différenciation positive** : Nyosi n'a pas l'air d'un supermarché en ligne — il a l'air d'un outil de confiance.

---

## Limites

1. **Risque de confusion avec WhatsApp** : visuellement proche, mais les éléments de marque Nyosi (logo abeille, jaune) distinguent suffisamment.
2. **Le jaune est marginalisé** : les utilisateurs qui avaient intégré l'ancienne identité jaune/noire doivent s'adapter.
3. **Dépendance perceptuelle** : si WhatsApp change drastiquement sa charte graphique, Nyosi devra évoluer.

---

## Conséquences

- Tous les headers sont `bg-[#075E54]`
- Tous les boutons principaux sont `bg-[#25D366]`
- Le fond application est `bg-[#F0F2F5]` ou `bg-white`
- Le jaune `#FCB001` est interdit pour les boutons, fonds de page, ou prix
- Cette règle s'applique à toutes les pages : landing, création boutique, ajout produits, boutique client, marie-gateaux
- Le logo Nyosi sur fond vert utilise le filtre CSS `brightness-0 invert` pour l'afficher en blanc
