// "use strict";
console.log("Mon panier");

// Vérification de l'existence de données dans le localStorage
// À trouver

/** Étapes à suivre
 * 1. Récupérer les données du localStorage pour les afficher sur la page
 * 2. Gérer les fonctionnalités du panier :
 *  - Ajouter un ou plusieurs articles
 *    > Regrouper les articles identiques sur une seule ligne
 *  - Retirer un ou plusieurs articles
 *  - Supprimer un ou plusieurs articles
 *  - Vider le panier
 */

//  1. Récupération et affichage des données

function getCart() {
  let getCart = JSON.parse(localStorage.getItem("cart"));
  return getCart;
}
