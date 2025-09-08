# 🚀 Plan de déploiement

## 1. Environnements
- **Développement** : Docker Compose (API Spring Boot + DB MySQL + Vue.js)
- **Tests** : Base de données H2 en mémoire
- **Production** : Déploiement conteneurisé (Docker) avec base externe sécurisée

## 2. Étapes de déploiement
1. Récupération du code (`git clone` ou `git pull`)
2. Configuration des variables d’environnement (`.env`)
3. Lancement avec Docker :
   ```bash
   docker compose up -d
   ```
4. Accès aux services :
   - API : `http://localhost:8080`
   - Frontend : `http://localhost:5173`

## 3. Rollback
- Arrêt de la version déployée
- Relancer avec la version précédente (`git checkout tag` + `docker compose up`)

## 4. Automatisation
- GitHub Actions : build, tests, déploiement conditionnel
