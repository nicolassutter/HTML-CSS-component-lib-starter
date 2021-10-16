# HTML - CSS component lib starter

Ce starter de projet permet de développer des librairies de composants HTML / CSS statiques.

- 🪐 Serveur de dev avec Node / Express.
- 📦 Compilation des assets avec Rollup.
- 🖌️ SASS, Postcss et Tailwind intégrés par défaut.
- ↺ Rechargements automatiques avec Browsersync.
- 📏 Eslint, stylelint intégrés.
- 💚 Templates de pages avec EJS pour une expérience HTML plus confortable.

## Développement des composants

Les composants sont écris avec EJS dans le dossier `components`

Ex: `components/button.ejs`

Les parties de composants peuvent être placées dans `components/parts`, elle serviront principalement pour faires des `<%- include('parts/header.ejs') %>`.

## Styles globaux et styles de composants

Les styles globaux peuvent être placés dans le fichier `asssets/css/app.scss`.

Un composant devrait avoir son propre fichier `scss` dans le dossier `assets/css/components/`.

Ce fichier doit ensuite être `@import` dans le fichier `assets/css/app.scss`

## Config

Une config minimale est disponible dans le fichier `config/config.ts`.

## Scripts

**Dev**
```sh
npm i && npm run dev
```

**Build**
```sh
npm i && npm run build
```

**Lint**
```sh
npm i && npm run lint
```
```sh
npm i && npm run lint-fix
```

## Note de fin

Au build, tous les composants sont générés dans un fichier HTML `dist/components/xxx.html`

Le fichier css final est `dist/output.css`

Le fichier `dist/output.js` est inutile et n'as pas besoin d'être inclus autre part.

Pour finir, si quelque chose est manquant ou non fonctionnel, les contributions sont les bienvenues 🙂
