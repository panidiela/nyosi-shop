# Playbook — Test MVP terrain

## Principe
Avant de construire l'inscription complète, tester avec une boutique créée manuellement.
Si les clients du vendeur commandent via le lien sans WhatsApp — le concept est validé.

## Ce qu'on construit pour le test
Une page HTML simple sur Vercel avec :
- Nom et photo de la boutique du vendeur
- 3–5 produits avec photos et prix en FCFA
- Bouton "Commander" qui ouvre un formulaire simple
- Formulaire : prénom, quartier, date, téléphone
- Message de confirmation après commande

Claude Code peut créer cette page en 30 minutes.

## Protocole de test (1 semaine)

### Jour 1 — Préparer
- Choisir un vendeur volontaire dans l'entourage de Pani
- Lui demander ses 3–5 produits les plus vendus avec photos et prix
- Claude Code crée la page → Vercel déploie → on obtient un lien
- Exemple : nyosi-test.vercel.app/marie-gateaux

### Jour 2 — Lancer
Le vendeur met le lien dans :
- Sa bio WhatsApp : "Commander mes gâteaux ici 👉 [lien]"
- Un message à ses 10 meilleurs clients
- Sa story Facebook

### Jours 3 à 7 — Observer sans intervenir
Questions à observer naturellement :
- Est-ce que des clients cliquent ?
- Est-ce que des clients remplissent le formulaire ?
- Est-ce que le vendeur trouve ça utile ?
- Est-ce que des clients ont commandé sans envoyer de message WhatsApp ?

### Fin de semaine — Bilan avec le vendeur
Questions à poser :
1. "Des clients ont commandé via le lien ?"
2. "Ça t'a fait gagner du temps ?"
3. "Tu veux continuer à utiliser ça ?"
4. "Tu paierais 5 000 FCFA par mois pour que ce soit plus complet ?"

---

## Critères de succès du test MVP
✓ Au moins 3 commandes reçues via le lien en 1 semaine → concept validé
✓ Le vendeur dit "je veux continuer" → produit utile confirmé
✓ Au moins 1 client a commandé sans envoyer de message WhatsApp → problème résolu
✓ Le vendeur dit "je paierais" → monétisation validée
