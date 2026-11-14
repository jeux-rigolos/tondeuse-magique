# 🌼 La Tondeuse Magique

Des jeux de conduite, de récolte et de mathématiques pour les enfants, jouables directement dans le navigateur, sans installation ni dépendance externe.

- **Droite graduée (CE1 à CM2)** : quatorze univers avec cinq niveaux (CP, CE1, CE2, CM1, CM2) accessibles dans chacun. Les défis alternent repérage, lecture de nombres, bonds et valeur d’un intervalle. Situations réelles : thermomètre vertical, compteur de vitesse à aiguille, trois recettes publiées avec balance et verre doseur gradués, et gonfleur de vélo avec une valeur cachée jusqu’à validation et une question sur les intervalles avant l’indice. Les nombres négatifs restent une découverte bonus en CM2. Indices, explications, cinq défis par jeu et progression locale. Accessible au tactile, à la souris et au clavier.
- **Tondeuse 2D** : huit terrains géométriques (carré, rectangle, triangle, rond, ovale, hexagone, octogone et losange), avec ou sans obstacles. Tondeuse, tracteur et robot transformeur original : le robot se déplace sans couper, puis se transforme en tondeuse par un **double-tap sur le terrain** (ou par le bouton accessible), avec une animation ; seul son mode tondeuse coupe l'herbe. Sons, fleurs, papillons et progression.
- **Robot Forestier 2D** : jeu autonome en vue du dessus : robot transformable par double-tap ou bouton en machine à scie, pilotage en glissant le doigt ou en touchant une destination, petite forêt de 9 ou grande forêt de 18 arbres, arbres à récolter, bac limité à trois bûches, transport vers un quai, bouton de déchargement affiché sur le terrain à proximité du quai, animation de l'usine et fabrication de papier. Menu déroulant au-dessus du jeu, aides tactiles, clavier et replantation lors d'une nouvelle partie. Le papier n'est comptabilisé qu'après le passage du bois à l'usine. Accessible dans `site/foret-2d/`.
- **3D** : véritable scène WebGL 3D, herbe haute et fine, tondeuse / tracteur, caméra « Suivre ».
- **Moissonneuse 2D** : huit formes de champs et choix des obstacles, trois machines agricoles et trois cultures (blé, maïs, betteraves), récolte avec outils de coupe à l'avant.
- **Moissonneuse 3D** : blé doré, plants de maïs et betteraves, moissonneuse-batteuse, récolteuse à maïs et arracheuse à betteraves, leurs équipements spécialisés, quatre champs et trois tailles.
- **Trémies animées (2D et 3D)** : le bac visible sur chaque machine se remplit progressivement selon la part de champ récoltée. Grain doré pour blé et maïs, betteraves orangées pour l'arracheuse, avec une jauge dédiée et des particules qui rejoignent la trémie pendant la récolte. Le vidage du bac n'est pas encore une action de jeu.
- **Tactile des moissonneuses (2D et 3D)** : maintenir le doigt sur le champ et le faire glisser ; la machine suit le doigt en continu, puis s'arrête dès que le doigt est levé. Clavier et manette restent compatibles.
- **Trémie 3D plus discrète** : l'ancienne grande caisse est remplacée par une petite trémie latérale basse, afin de garder la cabine et la tête de récolte visibles.
- **Jardins** : prairie, verger, jardin en L, jardin rond, avec obstacles à contourner.
- **Taille de terrain** : Petit (surface ×1), Moyen (environ ×2,25), Grand (environ ×4). La taille est sélectionnable indépendamment du jardin et du véhicule, et son changement recommence la partie.
- **Caméras** : la vue 2D suit le véhicule sur les grands terrains ; en 3D, le suivi est proposé automatiquement en Moyen/Grand et la vue générale reste accessible.
- **Manette 🎮 dans les cinq jeux de conduite** : branchement Bluetooth et activation en appuyant sur un bouton après ouverture du jeu (selon navigateur) ; joystick gauche ou croix directionnelle pour piloter. Robot Forestier 2D : A transformation, B livraison/déchargement, X usine et Start nouvelle partie après victoire. Tondeuse 2D : A robot/transformation, B recommencer, X véhicule, Y forme. Moissonneuse 2D : A machine, B recommencer, X forme, Y taille. Jeux 3D : A caméra, B recommencer, X conduite automatique/manuelle, Y sensibilité. Un indicateur sous le jeu précise si la manette est détectée ou indisponible. La compatibilité réelle dépend du navigateur, du système de tablette et de la manette ; la logique a été testée avec des entrées simulées.
- **Commandes 2D** : flèches pour se déplacer sur le terrain, écran tactile et manette selon le navigateur.
- **Commandes des jeux 3D** : `↑` avancer, `↓` reculer, `←` et `→` tourner à gauche et à droite (rotation possible sur place). Le stick gauche de la manette pilote la direction et l'avancement. Dans le jeu de tonte 3D, toucher un point du jardin donne une destination ; dans la moissonneuse 3D, le pilotage tactile est continu tant que le doigt est posé.
- **Caméra 3D** : vue de suivi derrière le véhicule par défaut ; le bouton « Jardin » donne une vue d'ensemble.
- Sans chrono, sans échec, sans inscription et sans suivi publicitaire.

## URLs après publication

Si le dépôt est `jeux-rigolos/tondeuse-magique`, les liens seront normalement :

- Accueil : `https://jeux-rigolos.github.io/tondeuse-magique/`
- La mission des graduations : `https://jeux-rigolos.github.io/tondeuse-magique/droite-graduee/`
- Le défi du petit pâtissier : `https://jeux-rigolos.github.io/tondeuse-magique/droite-graduee/recette/`
- Le compteur magique : `https://jeux-rigolos.github.io/tondeuse-magique/droite-graduee/compteur/`
- Le gonfleur de vélo : `https://jeux-rigolos.github.io/tondeuse-magique/droite-graduee/gonfleur/`
- 2D : `https://jeux-rigolos.github.io/tondeuse-magique/2d/`
- 3D : `https://jeux-rigolos.github.io/tondeuse-magique/3d/`
- Moissonneuse 2D : `https://jeux-rigolos.github.io/tondeuse-magique/moisson-2d/`
- Moissonneuse 3D : `https://jeux-rigolos.github.io/tondeuse-magique/moisson/`

Ces liens seront disponibles **une fois** GitHub Pages activé et le workflow déployé avec succès.

## Installation et publication

1. Créer sur GitHub un dépôt **public** `jeux-rigolos/tondeuse-magique`, avec une branche `main` (idéalement vide si vous utilisez `git init`).
2. Ajouter à la racine du dépôt tous les fichiers et dossiers de cette archive, y compris le dossier caché `.github`.
3. Dans **Settings > Pages > Build and deployment > Source**, sélectionner **GitHub Actions**.
4. Pousser un commit sur `main` (ou lancer le workflow manuellement via **Actions**).
5. Dans **Actions**, vérifier que « Déployer les jeux sur GitHub Pages » a réussi.

Chaque nouveau push sur `main` redéploie automatiquement le site.

### Exemple pour un dépôt vide

Après extraction de l’archive, dans le dossier du projet :

```bash
git init
git branch -M main
git add .
git commit -m "Ajouter les jeux 2D et 3D et GitHub Pages"
git remote add origin https://github.com/jeux-rigolos/tondeuse-magique.git
git push -u origin main
```

L’accès en écriture à ce dépôt est nécessaire pour l’envoyer. Selon les réglages de l’organisation GitHub, une autorisation peut être nécessaire.

## Arborescence

```text
.github/workflows/deploy-pages.yml   Déploiement automatique
site/index.html                     Page d'accueil
site/2d/index.html                  Jeu 2D
site/3d/index.html                  Jeu 3D WebGL
site/moisson-2d/index.html           Jeu de récolte 2D : blé, maïs, betteraves
site/moisson/index.html              Jeu de récolte 3D : blé, maïs, betteraves
site/.nojekyll                      Site statique sans Jekyll
README.md                           Documentation
```

## Progression et pédagogie

Choisir CP, CE1, CE2, CM1 ou CM2 sur l'accueil des graduations. Les onze jeux de base adaptent leurs graduations et, selon la classe, le type d'interaction : placer un nombre, lire un repère, avancer par bonds ou découvrir la valeur d'une unité. Le compteur, les recettes et le gonfleur proposent aussi les cinq classes. L'élève peut revenir sur un niveau précédent ; le progrès est mémorisé localement par classe.

**Gonfleur :** la pression du manomètre n'est pas affichée avant validation. Pour activer l'indice, l'enfant répond d'abord à la question « combien vaut une graduation ? », puis obtient l'explication. Les pressions de jeu sont fictives et ne remplacent pas l'étiquette d'un vrai pneu.

## Recettes authentiques utilisées pour le jeu

- Crêpes de Chef Damien (750g) : https://www.750g.com/pate-a-crepes-r5436.htm
- Pancakes maison (Mathilde, 750g) : https://www.750g.com/pancakes-r39365.htm
- Gâteau au chocolat facile (Anne Hervier, 750g) : https://www.750g.com/gateau-au-chocolat-r10420.htm

Le jeu fait mesurer les ingrédients quantifiables avec les instruments disponibles et rappelle les compléments à ajouter dans une vraie cuisine. Pour préparer ces recettes, consulter les instructions originales et cuisiner avec un adulte.

## Notes techniques

Les pages utilisent des liens relatifs : le site fonctionne donc dans le sous-chemin d’un dépôt GitHub Pages. Les jeux ne chargent aucune librairie depuis un CDN. La version 3D nécessite WebGL ; un lien vers la 2D s’affiche si WebGL n’est pas pris en charge.