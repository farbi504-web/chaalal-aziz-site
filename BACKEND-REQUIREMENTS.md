# Administration — prérequis backend (non implémentée volontairement)
Pour gérer véhicules, textes, FAQ, bannières et paramètres sans modifier `js/data.js`, il faut :
- Base de données (ex. Supabase/Postgres) : tables vehicles, vehicle_images, settings, faqs, banners.
- Authentification sécurisée (compte propriétaire, mot de passe fort, sessions HTTPS).
- Stockage d'images (upload/remplacement) avec redimensionnement.
- API ou accès direct sécurisé (règles RLS) ; le site public lit ces données au lieu de `data.js`.
- Contenu bilingue FR/AR dans chaque champ texte.
Pas de réservation en ligne : aucune table de réservations n'est nécessaire.
