# Prompts de la démo live

Pour chaque lab, deux prompts : celui du vibe codeur (vague) et celui du développeur augmenté (cadré).
À taper en direct dans Claude Code, Cursor ou ChatGPT pour montrer que **la qualité du prompt vient de ce qu'on sait déjà**.

---

## Lab 1 — Filtre sur une liste de produits

**Vibe codeur**
```
Ajoute un filtre à ma liste de produits.
```

**Développeur augmenté**
```
Dans mon app Next.js (App Router) avec Prisma/SQLite, ajoute une recherche de produits :
- filtrage côté serveur dans une route GET /api/pro/products (paramètres q, category, page)
- valide les paramètres avec zod (q max 60 caractères, page entier ≥ 1)
- pagination : 20 résultats par page, renvoie aussi le total et le nombre de pages
- ne sélectionne que id, name, price et le nom de la catégorie
- côté client : debounce de 300 ms sur la saisie, retour à la page 1 quand le filtre change
Explique-moi chaque choix en 2 lignes.
```

**À souligner** : on ne peut demander « limit/offset » ou « debounce » que si on sait ce que c'est.

---

## Lab 2 — Déboguer

**Vibe codeur** (on colle juste l'erreur)
```
J'ai cette erreur, corrige : TypeError: Cannot read properties of undefined (reading 'map')
```

**Développeur augmenté** (on a déjà fait le diagnostic)
```
Mon composant appelle products.map() avant que l'API ait répondu : useState() n'a pas de valeur initiale.
Initialise l'état avec un tableau vide, ajoute un état de chargement, et type les produits.
```

**Erreur 2**
```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```
Raisonnement à faire à voix haute : « `<` en position 0 → la réponse est du HTML → l'API a renvoyé une page d'erreur
(500) → je vérifie le backend et j'ajoute un contrôle de `res.ok` et du `Content-Type` avant `res.json()`. »

---

## Lab 3 — Performance (N+1)

**Vibe codeur**
```
Affiche la liste des utilisateurs avec leurs articles.
```

**Développeur augmenté**
```
Récupère les utilisateurs avec leurs articles en UNE requête Prisma (include), paginée par 20,
en ne sélectionnant que les colonnes affichées. Évite toute requête dans une boucle (problème N+1).
```

---

## Lab 4 — Sécurité

**Vibe codeur**
```
Fais-moi une route de login avec SQLite.
```

**Développeur augmenté**
```
Crée une route POST de login sécurisée :
- validation des entrées avec zod (email valide, longueurs max)
- requête via l'ORM Prisma (aucune concaténation SQL)
- vérification du mot de passe avec bcrypt contre un hash stocké
- message d'erreur générique (ne pas révéler si l'email existe)
- aucun secret dans le code : lis la clé dans process.env
- ne renvoie jamais le hash ni le mot de passe
```

Payload d'injection à montrer : email `' OR 1=1 --` avec n'importe quel mot de passe.
