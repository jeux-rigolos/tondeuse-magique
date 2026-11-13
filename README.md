# 🌼 La Tondeuse Magique

Quatre jeux de conduite et de récolte pour les enfants, jouables directement dans le navigateur, sans installation ni dépendance externe.

- **2D** : jardin vu du dessus, tondeuse rouge / tracteur-tondeuse vert, sons, fleurs, papillons, progression.
- **3D** : véritable scène WebGL 3D, herbe haute et fine, tondeuse / tracteur, caméra « Suivre ».
- **Moissonneuse 2D** : vue du dessus, trois machines agricoles et trois cultures (blé, maïs, betteraves), récolte avec outils de coupe à l'avant.
- **Moissonneuse 3D** : blé doré, plants de maïs et betteraves, moissonneuse-batteuse, récolteuse à maïs et arracheuse à betteraves, leurs équipements spécialisés, quatre champs et trois tailles.
- **Jardins** : prairie, verger, jardin en L, jardin rond, avec obstacles à contourner.
- **Taille de terrain** : Petit (surface ×1), Moyen (environ ×2,25), Grand (environ ×4). La taille est sélectionnable indépendamment du jardin et du véhicule, et son changement recommence la partie.
- **Caméras** : la vue 2D suit le véhicule sur les grands terrains ; en 3D, le suivi est proposé automatiquement en Moyen/Grand et la vue générale reste accessible.
- **Commandes 2D** : flèches pour se déplacer sur le terrain, écran tactile et manette selon le navigateur.
- **Commandes des jeux 3D** : `↑` avancer, `↓` reculer, `←` et `→` tourner à gauche et à droite (rotation possible sur place). Le stick gauche de la manette pilote aussi la direction et l'avancement. Toucher le jardin fait conduire automatiquement vers le point visé.
- **Caméra 3D** : vue de suivi derrière le véhicule par défaut ; le bouton « Jardin » donne une vue d'ensemble.
- Sans chrono, sans échec, sans inscription et sans suivi publicitaire.

## URLs après publication

Si le dépôt est `jeux-rigolos/tondeuse-magique`, les liens seront normalement :

- Accueil : `https://jeux-rigolos.github.io/tondeuse-magique/`
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

## Notes techniques

Les pages utilisent des liens relatifs : le site fonctionne donc dans le sous-chemin d’un dépôt GitHub Pages. Les jeux ne chargent aucune librairie depuis un CDN. La version 3D nécessite WebGL ; un lien vers la 2D s’affiche si WebGL n’est pas pris en charge.