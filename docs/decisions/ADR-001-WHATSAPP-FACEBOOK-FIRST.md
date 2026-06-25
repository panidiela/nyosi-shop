# ADR-001 — Nyosi est WhatsApp + Facebook First

**Statut** : Accepté — Juin 2026
**Décideur** : Pani (fondateur)

---

## Contexte

Les commerçants africains (Yaoundé, Douala) vendent leurs produits principalement via deux canaux numériques :

1. **WhatsApp** : statuts, messages directs, groupes, WhatsApp Business
2. **Facebook** : posts, stories, groupes, marketplace, commentaires

Ces deux plateformes sont les points de contact numériques principaux entre commerçants et clients en Afrique francophone. Les commerçants y passent plusieurs heures par jour à gérer des commandes manuellement.

---

## Décision

Nyosi est positionné comme **"WhatsApp + Facebook First"**.

Cela signifie :
- Le lien Nyosi est conçu pour être **partagé sur WhatsApp et Facebook**
- L'interface boutique est optimisée pour être **cliquée depuis ces deux applications**
- Toute fonctionnalité est évaluée à l'aune de son impact sur **la réduction des messages WhatsApp et des commentaires Facebook** liés aux commandes

---

## Avantages

1. **Zéro friction à l'adoption** : les commerçants font déjà ça sur WhatsApp et Facebook. Nyosi s'intègre dans leurs habitudes existantes.
2. **Distribution gratuite** : le commerçant devient lui-même le canal de distribution en partageant son lien.
3. **Confiance** : le client reçoit le lien d'un vendeur qu'il connaît déjà sur WhatsApp ou Facebook.
4. **Pas de publicité nécessaire en phase 0** : le bouche-à-oreille via WhatsApp suffit pour démarrer.
5. **Différenciation** : aucun concurrent ne se positionne explicitement sur ce duo WhatsApp + Facebook.

---

## Limites

1. **Dépendance aux plateformes tierces** : si WhatsApp ou Facebook change ses politiques de liens, Nyosi est impacté.
2. **Pas de discovery** : Nyosi n'a pas de catalogue global. Les clients découvrent les boutiques uniquement via le partage du commerçant.
3. **Open Graph** : les aperçus de liens ne sont pas encore optimisés pour WhatsApp/Facebook (Phase 3).

---

## Conséquences

- Le bouton "Partager mon lien" est une fonctionnalité de premier plan (pas cachée dans un menu)
- `navigator.share()` est la méthode de partage principale (ouvre le menu natif Android)
- Chaque page boutique doit se charger en < 3 secondes car elle est souvent ouverte depuis un clic WhatsApp sur 3G
- L'interface est 100% en français (les utilisateurs cibles sont francophones)
- Le lien est court et mémorable : `nyosi.cm/marie-gateaux`
