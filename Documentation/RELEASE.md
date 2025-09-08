# 📌 Gestion des versions (Semantic Versioning)

Ce projet utilise le [Semantic Versioning
(SemVer)](https://semver.org/lang/fr/) pour nommer ses versions :

    MAJOR.MINOR.PATCH

-   **MAJOR** : changement majeur, rupture de compatibilité
-   **MINOR** : ajout de fonctionnalités rétro-compatibles
-   **PATCH** : corrections de bugs ou petites améliorations

## 🔖 Créer une nouvelle version

1.  Vérifier que votre dépôt est à jour :

``` bash
git pull origin main
```

2.  Créer un tag correspondant à la nouvelle version :

``` bash
# Exemple pour une version 1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
```

3.  Pousser le tag vers GitHub :

``` bash
git push origin v1.2.0
```

## 📜 Lister les versions existantes

``` bash
git tag
```

## ⏩ Mettre à jour une version (si besoin)

Si vous avez créé un mauvais tag, vous pouvez le supprimer localement et
à distance :

``` bash
git tag -d v1.2.0
git push origin --delete v1.2.0
```

Puis recréez-le avec la bonne version.
