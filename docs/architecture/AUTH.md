# Authentification Nyosi — Phase 3

## Vue d'ensemble

Chaque commerçant possède un compte sécurisé. L'auth utilise **Supabase Auth** (email + mot de passe). Aucun SMS OTP requis.

---

## Astuce : Connexion par téléphone sans SMS

Les commerçants camerounais ont un téléphone, pas toujours un email. Pour éviter l'OTP SMS (payant, compliqué), on utilise une **adresse email synthétique** :

```
Téléphone : 677 12 34 56
Email Supabase : tel_677123456@nyosi.app
```

Le commerçant se connecte avec son numéro de téléphone → notre code le transforme en email synthétique → Supabase ne voit que des emails. Simple.

---

## Configuration Supabase requise

### 1. Désactiver la confirmation email (OBLIGATOIRE)

Dans ton dashboard Supabase :
→ **Authentication** → **Providers** → **Email**
→ Désactiver **"Confirm email"** (sinon les comptes restent bloqués)

### 2. SQL — Ajouter user_id à la table boutiques

```sql
ALTER TABLE boutiques
ADD COLUMN user_id UUID REFERENCES auth.users(id) DEFAULT NULL;
```

À exécuter une seule fois dans **Supabase** → **SQL Editor**.

---

## Fichiers

| Fichier | Rôle |
|---|---|
| `lib/auth.ts` | Toutes les fonctions auth (inscrire, connecter, déconnecter, etc.) |
| `app/login/page.tsx` | Page de connexion |
| `app/register/page.tsx` | Page d'inscription |
| `app/dashboard/layout.tsx` | Protection de toutes les routes `/dashboard` |

---

## Fonctions exportées (`lib/auth.ts`)

```typescript
inscrire(nomComplet, telephone, email, motDePasse)
// → Crée un compte. Email optionnel (synthétique si absent).

connecter(identifiant, motDePasse)
// → identifiant = téléphone OU email

deconnecter()
// → Efface la session

getUtilisateur(): Promise<User | null>
getSession(): Promise<Session | null>

ecouterAuth(callback): () => void
// → Pour réagir aux déconnexions en temps réel (useEffect)
```

---

## Protection des routes

`app/dashboard/layout.tsx` vérifie la session au montage :
- Supabase absent → accès libre (compatibilité localStorage MVP)
- Session active → affiche le dashboard
- Pas de session → redirige vers `/login`
- Déconnexion en temps réel → redirige vers `/login`

---

## Flux commerçant

```
Inscription → /register
    ↓ inscrire()
    ↓ connecter() automatique
    ↓ boutique créée avec user_id
    → /creer-boutique
    → /dashboard

Connexion → /login
    ↓ connecter()
    → /dashboard
    ↓ (si pas de nyosi_current_slug)
    → getBoutiquesUtilisateur() récupère la boutique par user_id
    → setSlugActuel() sauvegarde le slug localement

Déconnexion → bouton dans le header du dashboard
    ↓ deconnecter()
    → layout.tsx écoute → redirect /login
```

---

## Compatibilité arrière

- Les boutiques existantes (créées avant Phase 3) ont `user_id = NULL` dans Supabase → elles continuent de fonctionner
- Les pages client (`/[slug]`) ne sont jamais protégées — les clients commandent sans compte
- Si `NEXT_PUBLIC_SUPABASE_URL` est absent → toute la couche auth est ignorée silencieusement

---

## Multi-boutique (futur)

Quand un commerçant aura plusieurs boutiques :
1. `getBoutiquesUtilisateur()` retournera plusieurs résultats
2. Un écran "Choisir ma boutique" remplacera la détection automatique du premier slug
3. La clé `nyosi_current_slug` pointera vers la boutique sélectionnée
