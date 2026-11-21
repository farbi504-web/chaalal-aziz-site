# Chaâlal Aziz — Location de voiture (site statique)

Réservation **par téléphone uniquement** : 0550 49 69 05 (`tel:+213550496905`), WhatsApp `https://wa.me/213550496905`.

## Structure
- `index.html` accueil · `catalogue.html` catalogue + filtres · `vehicule.html?id=…` fiche véhicule
- `data.js` **seul fichier à modifier** : coordonnées, véhicules, prix, disponibilité, photos
- `i18n.js`, `ar-static.js` traductions FR/AR · `app.js` composants · `style.css`
- `logo.png`, `logo.webp`, `favicon.png` (à la racine) · `sitemap.xml`, `robots.txt`

## Lancer en local
`python3 -m http.server 8000` dans ce dossier, puis http://localhost:8000

## Déployer
Site 100 % statique : déposer les fichiers du dépôt à la racine de l’hébergement sur Netlify, Vercel, Cloudflare Pages, GitHub Pages ou un hébergement classique.
Ensuite remplacer `REPLACE-WITH-YOUR-DOMAIN` (index.html, catalogue.html, vehicule.html, sitemap.xml, robots.txt) par votre domaine et `siteUrl` dans `data.js`.

## À fournir par le propriétaire (rien n'a été inventé)
1. Liste réelle des véhicules (nom, année, boîte, carburant, places, catégorie) → remplacer les 6 véhicules « Démo » dans `data.js`.
2. Photos des véhicules → `assets/vehicles/`, puis `images:[...]`. Photo de couverture → `heroImage`.
3. Prix journaliers vérifiés (`price`) et disponibilité (`available`) : tant qu'ils sont `null`, le site affiche « nous appeler » et les filtres prix/disponibilité sont désactivés/masqués.
4. Horaires (`openingHours`), conditions de location (`conditions`), documents requis, livraison, réseaux sociaux.
5. Lien Google Maps exact de la fiche (actuellement recherche par nom + adresse).
6. Nom de domaine (canonical, Open Graph, sitemap).

## Tableau de bord (admin.html)
`admin.html` (arabe) permet de gérer sans toucher au code : véhicules (ajout, modification, suppression, photos, prix, disponibilité, fiche), infos de l'agence (téléphone, WhatsApp, adresse, horaires, réseaux, note Google, carte, photo d'accueil) et avis Google.
Le site étant statique, les modifications sont enregistrées en **brouillon dans le navigateur** (le site affiche une pastille « Brouillon » sur cet appareil uniquement). Pour publier : onglet « Publication » → télécharger le ZIP → envoyer `data.js` et `assets/` sur l'hébergement.
⚠️ Pas de mot de passe possible sans serveur : `admin.html` ne publie rien par lui-même, mais pour un vrai accès protégé multi-appareils voir ci-dessous.

## Administration complète (backend)
Un vrai tableau d'administration exige un backend (base de données, authentification, stockage d'images) : ce projet est statique, donc **aucun faux dashboard n'a été ajouté**. Voir `BACKEND-REQUIREMENTS.md`.
