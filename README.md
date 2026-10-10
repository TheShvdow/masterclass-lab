# GTECH Lab — Vibe codeur vs Développeur augmenté

Projet de démo pour la **Masterclass Dev + Agents IA** (GTECH Sénégal, 10 octobre 2026).
Quatre labs, chacun avec la version « vibe codeur » à gauche et la version « développeur augmenté » à droite,
et des mesures affichées en direct (taille téléchargée, requêtes SQL, temps serveur…).

Stack : Next.js 14 (App Router) · TypeScript · Prisma · SQLite · zod · bcryptjs.

## Installation (à faire AVANT le live)

```bash
cp .env.example .env   # variables de démo (base SQLite locale)
npm install          # installe et génère le client Prisma
npm run db:setup     # crée la base SQLite + 10 000 produits, 300 utilisateurs, 1 500 articles
npm run dev          # http://localhost:3000
```

Prérequis : Node.js 18.18 ou plus récent. Aucun service externe : tout tourne en local.

`npm run db:setup` peut être relancé à tout moment
pour remettre la base à zéro.

## Les 4 labs

| Lab | Page | Ce qu'il montre | Durée conseillée |
|-----|------|-----------------|------------------|
| 1. Même feature, deux approches | `/lab1` | Filtre sur 10 000 produits : tout charger vs filtrer + paginer côté serveur | 4 min |
| 2. Déboguer | `/lab2` | `.map()` sur undefined, puis `Unexpected token '<'` | 3 min |
| 3. Performance | `/lab3` | Requêtes N+1 : 301 requêtes SQL vs 2 | 2 min |
| 4. Sécurité | `/lab4` | Login généré : injection SQL, mot de passe en clair, clé dans le code | 3 min |

## Déroulé conseillé pendant le live

**Lab 1 (slide « Démo live »)**
1. Ouvre `/lab1`. Montre que les deux colonnes « marchent ».
2. Tape `casque` dans les deux champs. Commente les métriques : plusieurs centaines de Ko et des milliers de lignes
   à gauche, quelques Ko et 20 lignes à droite.
3. Ouvre les DevTools (onglet Réseau) pour montrer la taille de la réponse `/api/vibe/products`.
4. Montre les deux prompts dans `PROMPTS.md`.

**Lab 2 (slide « Fondamental 02 — Débogage »)**
1. Clique « Relancer les deux composants » : la colonne de gauche affiche l'erreur `reading 'map'`.
2. Fais le raisonnement à voix haute (variable undefined → pas de valeur initiale → l'API n'a pas encore répondu).
3. Coche « Simuler une panne », clique « Charger les statistiques » des deux côtés : message cryptique à gauche,
   message clair à droite.

**Lab 3 (slide « Fondamental 04 — Performance »)**
1. Exécute la version vibe : environ 301 requêtes SQL.
2. Exécute la version dev augmenté : 2 requêtes.
3. Ouvre `app/api/lab3/vibe/route.ts` pour montrer le `await` dans la boucle.

**Lab 4 (slide « Fondamental 05 — Sécurité »)**
1. Scénario « Identifiants corrects » : les deux acceptent. Mais regarde la réponse de gauche : mot de passe en
   clair et clé API renvoyés.
2. Scénario « Injection SQL » : la version vibe ouvre le compte **admin** sans mot de passe et affiche la requête
   SQL exécutée. La version dev augmenté refuse (email invalide).

## Plan B si quelque chose plante en direct

- Relance `npm run db:setup` puis `npm run dev`.
- Garde une capture d'écran de chaque lab en secours.
- Les temps (ms) varient selon la machine : insiste sur les **ratios** (taille, nombre de requêtes), qui eux ne
  changent pas.

## Avertissement

Les routes `app/api/lab4/vibe/*` et `app/api/vibe/*` sont **volontairement mal écrites** pour la démonstration.
Ne déploie jamais ce projet en ligne et ne réutilise pas ce code en production.
