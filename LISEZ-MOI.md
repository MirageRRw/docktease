# Docktease — version JavaScript pour Netlify

Même site, même design, mêmes fonctions que la version PHP, réécrit en JavaScript (Netlify Functions).
Les données (comptes, ventes, locations, logs, photos des fiches) sont stockées dans **Netlify Blobs** :
elles restent en place à chaque nouveau déploiement. Rien à configurer côté base de données.

## Mettre en ligne (méthode simple : GitHub + Netlify)

1. Créez un dépôt sur github.com (privé de préférence, il contient votre site) et envoyez-y **tout le contenu de ce dossier**
   (bouton « Add file › Upload files », puis glissez les fichiers et dossiers : `netlify`, `public`, `package.json`, `netlify.toml`…).
2. Sur app.netlify.com : **Add new site › Import an existing project › GitHub**, choisissez le dépôt.
3. Ne changez aucun réglage de build (tout est déjà dans `netlify.toml`) puis cliquez sur **Deploy**.
   Netlify installe seul la dépendance `@netlify/blobs`.
4. Ouvrez l'adresse `xxxx.netlify.app` : connexion **admin** / **docktease2026**, puis changez ce mot de passe tout de suite
   (Panel admin › Comptes › Changer le mot de passe).

> Avant la première visite, vous pouvez définir votre propre mot de passe admin : Netlify › Site configuration › Environment variables
> › ajoutez `ADMIN_PASSWORD`. Il sert uniquement à créer le compte admin au tout premier lancement.

Autre méthode, sans GitHub : installez Netlify CLI (`npm i -g netlify-cli`), faites `netlify login`, `netlify link` (ou `netlify init`),
puis `netlify deploy --prod` dans ce dossier. Le glisser-déposer du dossier sur Netlify Drop n'est pas recommandé :
il n'installe pas toujours les dépendances des fonctions.

## Connexion avec Discord

Dans Panel admin › Discord, l'adresse de retour à ajouter dans le portail développeur Discord (OAuth2 › Redirects) est affichée :
c'est `https://VOTRE-SITE.netlify.app/discord-callback`. Les webhooks (ventes / locations) se règlent au même endroit.
Netlify autorise les connexions sortantes vers Discord, donc tout fonctionne en ligne.

## Tester sur votre ordinateur

Avec Node.js 20 ou plus : `node local.mjs` puis http://localhost:8888 (données écrites dans le dossier `data`).

## Différences avec la version PHP

- Les adresses n'ont plus de `.php` (`/login`, `/vente`…). Les anciennes adresses en `.php` marchent encore.
- Accès de secours administrateur : `/login?admin=1`.
- Les données PHP (dossier `data/`) ne sont pas reprises : le compte admin est recréé au premier lancement.
- Photos des fiches : 5 Mo maximum en tout (limite de Netlify). Les grandes photos sont réduites automatiquement dans le navigateur.
- La session reste valable 30 jours (cookie signé). Une clé de signature est créée automatiquement et stockée avec les données ;
  vous pouvez imposer la vôtre avec la variable `SESSION_SECRET`.

## Plan de fichiers

- `netlify/functions/app.mjs` : point d'entrée et liste des pages
- `netlify/functions/lib/core.mjs` : onglets, grades, stockage, sessions, Discord
- `netlify/functions/lib/pages-main.mjs`, `pages-admin.mjs`, `views.mjs` : les pages
- `public/assets/` : style et logo
