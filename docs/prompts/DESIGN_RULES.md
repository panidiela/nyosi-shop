# Règles Design — Nyosi

> Document à utiliser au début de chaque session avec un designer ou un LLM travaillant sur l'interface.

---

## Identité visuelle

**Nyosi est inspiré de WhatsApp.**

Pourquoi : WhatsApp est l'application la plus connue et utilisée par nos commerçants cibles. Cette familiarité crée une confiance immédiate. Le commerçant reconnaît les codes visuels sans formation.

---

## Palette OBLIGATOIRE

| Rôle | Couleur | Hex |
|---|---|---|
| Header / Navigation | Vert foncé | `#075E54` |
| Boutons CTA / Prix | Vert | `#25D366` |
| Fond application | Gris clair | `#F0F2F5` |
| Cartes / Formulaires | Blanc | `#FFFFFF` |
| Texte principal | Noir doux | `#1A1A1A` |
| Texte secondaire | Gris | `#667781` |
| Bordures | Gris très clair | `#E8E8E4` |
| Accent Nyosi | Jaune | `#FCB001` |

### Règles d'utilisation du jaune `#FCB001`

✅ Autorisé uniquement pour :
- Le logo Nyosi et l'icône abeille
- Les badges promotionnels
- Les textes d'accroche marketing
- Les illustrations et éléments décoratifs

❌ Interdit pour :
- Les boutons d'action
- Les fonds de pages entières
- Les prix des produits
- Les headers ou barres de navigation

---

## Logo

| Contexte de fond | Logo à utiliser |
|---|---|
| Fond vert foncé `#075E54` | Logo blanc (`brightness-0 invert` en CSS) |
| Fond blanc `#FFFFFF` ou gris `#F0F2F5` | Logo couleurs normales |

Ne jamais distordre le logo. Ne jamais ajouter d'effets.

---

## Structure de page

Toutes les pages suivent ce modèle :

```
1. Header vert sticky (#075E54)
2. Hero zone verte (#075E54) avec titre blanc
3. Contenu sur fond gris (#F0F2F5) avec -mt-3 pour superposition
4. Cartes blanches (bg-white, rounded-2xl, shadow-sm)
5. Footer discret
```

---

## Typographie

- Police : système (pas de Google Fonts)
- Titres : `font-bold`, 24–30px
- Corps : 14–16px
- Texte secondaire : 12–14px, couleur `#667781`
- Prix : `font-bold`, vert `#25D366`, 18–20px

---

## Boutons

| Type | Style |
|---|---|
| Principal | `bg-[#25D366] text-white font-bold py-4 rounded-xl w-full active:bg-[#1db857]` |
| Secondaire | `bg-white border border-[#E8E8E4] text-[#1A1A1A] font-bold py-3 rounded-xl w-full` |
| Destructeur | `text-[#667781] text-sm underline` (discret, jamais rouge vif) |

Hauteur minimale : `py-3` (48px) ou `py-4` (56px) — cibles tactiles Android.

---

## Animations

| Classe | Effet | Usage |
|---|---|---|
| `card-fade-in` | Apparition douce de bas en haut | Cartes produits |
| `sheet-slide-up` | Glissement depuis le bas | Formulaires, bottom sheets |
| `pop-in` | Rebond d'apparition | Check de confirmation |

---

## Règles UX

1. **Un seul CTA principal par écran** — visible sans scroll.
2. **Pas de hover** — interface tactile uniquement. Utiliser `active:`.
3. **Tailles tactiles** — aucun bouton < 44px de hauteur.
4. **Pas de pagination** — tout scroll vertical sur une page.
5. **Feedback immédiat** — chaque tap donne un retour visuel.
6. **Erreurs en douceur** — card rouge clair, jamais de popup.

---

## Ce que le designer ne doit pas proposer

- ❌ Police Google Fonts (performance 3G)
- ❌ Animations lourdes ou JavaScript externe
- ❌ Bibliothèques d'icônes (SVG inline uniquement)
- ❌ Fond jaune `#FCB001` plein écran
- ❌ Interface en anglais ou bilingue
- ❌ Éléments non tactiles (dropdown hover, tooltips desktop)
- ❌ Layout landscape ou multi-colonnes complexes sur mobile
- ❌ Tailles de texte < 14px
