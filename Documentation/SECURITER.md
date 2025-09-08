# 🔐 Plan de sécurisation de l'application

## 1. Risques et vulnérabilités identifiés
- Fuite de données personnelles
- Injections SQL
- Attaques XSS / CSRF
- Vol ou fuite de jetons JWT
- Mots de passe faibles

## 2. Actions préventives
- Hashage des mots de passe (BCrypt)
- Validation des entrées utilisateur
- Utilisation de JWT avec expiration et refresh
- Séparation des rôles et des privilèges
- Sauvegarde sécurisée des secrets (GitHub Secrets, .env non versionné)

## 3. Actions correctives
- Système de patch rapide via GitHub Actions
- Rotation des clés en cas de compromission
- Audit régulier du code et des dépendances

## 4. Gestion de crise (incident de sécurité)
- Détection et alerte via logs
- Communication interne et externe planifiée
- Escalade vers l’administrateur sécurité
- Publication d’un correctif prioritaire

## 5. Conformité RGPD
- Collecte minimale de données
- Droits d’accès, rectification, suppression
- Journalisation des accès aux données sensibles
