"use strict";
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

const Cart = [];

// La boucle d'affichage
for (let i = 0; i < localStorage.length; i++) {
  const Key = localStorage.getItem(localStorage.key(i));
  const Item = JSON.parse(Key);
  Cart.push(Item);
  Cart.forEach((Key) => itemDisplay(Key));

  function itemDisplay(Key) {
    const DisplayArticle = displayArticle(Key);
    container(DisplayArticle);

    const DisplayImage = displayImage(Key);
    const DisplayDescription = displayDescription(Key);
    const ContentSettings = settings(Key);

    console.log(ContentSettings);

    console.log(DisplayArticle);

    DisplayArticle.appendChild(DisplayImage);
    DisplayArticle.appendChild(DisplayDescription);
    DisplayArticle.appendChild(ContentSettings);
  }

  function container(DisplayArticle) {
    document.querySelector("#cart__items").appendChild(DisplayArticle);
  }
} // Fin de la boucle d'affichage

console.log(Cart);

//  --------- Création de la balise article
function displayArticle(Key) {
  const Article = document.createElement("article");
  Article.classList.add("cart__item");
  Article.dataset.id = Key.idProduct;
  Article.dataset.color = Key.productColor;

  return Article;
}

// Affichage de l'image
function displayImage(Key) {
  const ImageDiv = document.createElement("div");
  ImageDiv.classList.add("cart__item__img");

  const Image = document.createElement("img");
  Image.src = Key.productImage;
  // Ne pas oublier la description de l'image
  Image.alt = Key.altImg;

  ImageDiv.appendChild(Image);
  return ImageDiv;
}

// Récapitulatif du produit choisi : Nom, Couleur, Prix
function displayDescription(Key) {
  const Container = document.createElement("div");
  Container.classList.add("cart__item__content");

  const ItemDescription = document.createElement("div");
  ItemDescription.classList.add("cart__item__content__description");

  const ProductName = document.createElement("h2");
  ProductName.innerText = Key.productName;

  const ProductColor = document.createElement("p");
  ProductColor.innerText = Key.productColor;

  const ProductPrice = document.createElement("p");
  ProductPrice.innerText = Key.productPrice + "€";

  ItemDescription.appendChild(ProductName);
  ItemDescription.appendChild(ProductColor);
  ItemDescription.appendChild(ProductPrice);

  Container.appendChild(ItemDescription);
  return Container;
}

// Changements au panier
function settings(Key) {
  const Settings = document.createElement("div");
  Settings.classList.add("cart__item__content__settings");

  // Les quantités
  const ProductQuantity = document.createElement("div");
  ProductQuantity.classList.add("cart__item__content__settings__quantity");

  const QuantityNumber = document.createElement("p");
  QuantityNumber.innerText = "Qté : " + Key.productQuantity;

  ProductQuantity.appendChild(QuantityNumber);

  // const QuantityChange = document.createElement("input");
  // QuantityChange.setAttribute("type", "number");
  // QuantityChange.classList.add("itemQuantity");
  // QuantityChange.setAttribute("name", "itemQuantity");
  // QuantityChange.setAttribute("min", "1");
  // QuantityChange.setAttribute("max", "100");
  // QuantityChange.setAttribute("value", "42");
  // QuantityChange.setAttribute("aria-label", "Nombre d'articles");

  // ProductQuantity.appendChild(QuantityChange);

  // // La suppression
  // const DeleteDiv = document.createElement("div");
  // DeleteDiv.classList.add("cart__item__content__settings__delete");

  // const DeleteProduct = document.createElement("p");
  // DeleteProduct.classList.add("deleteItem");
  // DeleteProduct.innerText = "Supprimer";

  // DeleteDiv.appendChild(DeleteProduct);
  Settings.appendChild(ProductQuantity);
  return Settings;
}

// // Le montant total du panier
// const TotalResults = document.querySelector(".cart__price");

// const TotalQuantity = document.querySelector(".totalQuantity");
// //  Ajouter la quantité totale d'articles du panier

// const TotalPrice = document.querySelector("totalPrice");
// // Ajouter le montant total du panier
