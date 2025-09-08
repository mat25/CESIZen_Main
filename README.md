# CESIZen – Bloc 3 : Déploiement & Sécurisation

## 📌 Présentation
**CESIZen** est une application web dédiée à la santé mentale, proposant :
- Des informations de prévention,
- Un module de diagnostic de stress,
- Des activités de détente,
- La gestion des comptes utilisateurs avec rôles (utilisateur, administrateur).

Le projet est découpé en **frontend**, **backend** et une **infrastructure conteneurisée** pour simplifier le déploiement.

---

## 🏗️ Architecture

### Vue d’ensemble
```
┌──────────────────┐       ┌──────────────────┐
│  Frontend (Vue)  │ <–––> │  Backend (Java)  │
└──────────────────┘       └─────────┬────────┘
                                      │
                             ┌────────▼────────┐
                             │   Base MySQL    │
                             └─────────────────┘
```

- **Frontend** : Vue 3 + Element Plus  
- **Backend** : Spring Boot (API REST sécurisée avec JWT, rôles et statuts utilisateurs)  
- **BDD** : MySQL  
- **Infrastructure** : orchestrée via `docker-compose`  
- **CI/CD** : automatisation des builds et tests avec GitHub Actions

---

## 🚀 Déploiement continu (CI/CD)

Le projet utilise **GitHub Actions** pour l’intégration et le déploiement continu.  
Pipeline typique :

1. **Déclencheur** : push ou pull request.  
2. **Étapes CI** :
   - Vérification du code (lint + build),
   - Tests unitaires du backend (`mvn test`),
   - Tests du frontend (`npm run test`).  
3. **Build Docker** :
   - Construction des images pour le frontend et le backend,  
   - Exécution des conteneurs via `docker-compose`.  
4. **(Optionnel)** : push des images vers Docker Hub.  

👉 Avantage : automatisation complète, détection rapide des erreurs et cohérence des environnements.

---

## ⚙️ Environnements

- **Développement** : exécution locale avec Docker (`docker-compose up`).  
- **Tests** : pipeline CI lance les builds + tests unitaires.  
- **Production** : déploiement via conteneurs (scalable).  

---

## 🔒 Sécurisation
- Authentification avec JWT, gestion des rôles (USER, ADMIN, SUPER_ADMIN).  
- Données personnelles sécurisées (hashage des mots de passe avec BCrypt).  
- Conformité RGPD (suppression/désactivation de compte, soft delete).  
- Bonnes pratiques : séparation des couches (API, frontend, BDD), logs centralisés.

---

## ▶️ Lancer le projet
```bash
# Cloner le projet
git clone https://github.com/mat25/CESIZen_Main.git
cd CESIZen_Main

# Lancer avec Docker
docker-compose up --build
```

Accès :
- Frontend : [http://localhost:8080](http://localhost:8080)  
- API : [http://localhost:8081/api](http://localhost:8081/api)  
