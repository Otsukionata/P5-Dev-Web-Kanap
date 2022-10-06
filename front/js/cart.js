"use strict";

console.log("mon panier");

// Récupération des données du localStorage
let saveInLocStorage = JSON.parse(localStorage.getItem("data"));

// Vérification de l'existence de données dans le localStorage
if (!localStorage.getItem("data")) {
   console.log("Panier vide");
 } else {
   console.log(saveInLocStorage);
 }
 
/** Étapes à suivre 
 * 1. Récupérer les données du localStorage pour les afficher sur la page
 * 2. Gérer les fonctionnalités du panier :
 *  - Ajouter un ou plusieurs articles
 *    > Regrouper les articles identiques sur une seule ligne
 *  - Retirer un ou plusieurs articles
 *  - Supprimer un ou plusieurs articles
 *  - Vider le panier
 */



/** Structure de la page
 * 
 * <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                <div class="cart__item__img">
                  <img src="" alt="">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>Nom du produit</h2>
                    <p>Vert</p>
                    <p>42,00 €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>

              <div class="cart__price">
                <p>Total (<span id="totalQuantity">
                <!-- 2 -->
              </span> articles) : <span id="totalPrice">
                <!-- 84,00 -->
              </span> €</p>
 * 
 */