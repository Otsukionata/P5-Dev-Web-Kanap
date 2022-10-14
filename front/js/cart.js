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

//  1. Récupération et affichage des données du panier
let cart = JSON.parse(localStorage.getItem("cart"));

// Ce qu'il se passe si le panier est rempli ou vide
if (cart) {
  console.log("Il y a des articles dans le panier !");
} else {
  let emptyCart = document.querySelector("#cart__items");
  emptyCart.innerText = "Votre panier est vide";
}

// L'affichage des produits
cart.forEach((data) => itemDisplay(data));
function itemDisplay(data) {
  const DisplayArticle = displayArticle(data);
  container(DisplayArticle);

  const DisplayImage = displayImage(data);
  const DisplayDescription = displayDescription(data);
  const ContentSettings = settings(data);

  DisplayArticle.appendChild(DisplayImage);
  DisplayArticle.appendChild(DisplayDescription);
  DisplayArticle.appendChild(ContentSettings);

  console.log(DisplayArticle);
  // return DisplayArticle;
}

function container(DisplayArticle) {
  document.querySelector("#cart__items").appendChild(DisplayArticle);
}
// Fin de la boucle d'affichage

//  --------- Création de la balise article
function displayArticle(data) {
  const Article = document.createElement("article");
  Article.classList.add("cart__item");
  Article.dataset.id = data.id;
  Article.dataset.color = data.color;

  return Article;
}

// Affichage de l'image
function displayImage(data) {
  const ImageDiv = document.createElement("div");
  ImageDiv.classList.add("cart__item__img");

  const Image = document.createElement("img");
  Image.src = data.image;
  // Ne pas oublier la description de l'image
  Image.alt = data.altImg;

  ImageDiv.appendChild(Image);
  return ImageDiv;
}

// Récapitulatif du produit choisi : Nom, Couleur, Prix
function displayDescription(data) {
  const Container = document.createElement("div");
  Container.classList.add("cart__item__content");

  const ItemDescription = document.createElement("div");
  ItemDescription.classList.add("cart__item__content__description");

  const ProductName = document.createElement("h2");
  ProductName.innerText = data.name;

  const ProductColor = document.createElement("p");
  ProductColor.innerText = data.color;

  const ProductPrice = document.createElement("p");
  ProductPrice.innerText = data.price + "€";

  ItemDescription.appendChild(ProductName);
  ItemDescription.appendChild(ProductColor);
  ItemDescription.appendChild(ProductPrice);

  Container.appendChild(ItemDescription);
  return Container;
}

// Changements au panier
function settings(data) {
  const Settings = document.createElement("div");
  Settings.classList.add("cart__item__content__settings");

  // Les quantités
  const ProductQuantity = document.createElement("div");
  ProductQuantity.classList.add("cart__item__content__settings__quantity");

  const QuantityNumber = document.createElement("p");
  QuantityNumber.innerText = "Qté : " + data.quantity;

  ProductQuantity.appendChild(QuantityNumber);

  const QuantityChange = document.createElement("input");
  QuantityChange.setAttribute("type", "number");
  QuantityChange.classList.add("itemQuantity");
  QuantityChange.setAttribute("name", "itemQuantity");
  QuantityChange.setAttribute("min", "1");
  QuantityChange.setAttribute("max", "100");
  QuantityChange.setAttribute("value", data.quantity);
  QuantityChange.setAttribute("aria-label", "Nombre d'articles");

  ProductQuantity.appendChild(QuantityChange);

  // La suppression
  const DeleteDiv = document.createElement("div");
  DeleteDiv.classList.add("cart__item__content__settings__delete");

  const DeleteProduct = document.createElement("p");
  DeleteProduct.classList.add("deleteItem");
  DeleteProduct.innerText = "Supprimer";

  DeleteDiv.appendChild(DeleteProduct);
  Settings.appendChild(ProductQuantity);
  return Settings;
}

// // Le montant total du panier
// const TotalResults = document.querySelector(".cart__price");

// const TotalQuantity = document.querySelector(".totalQuantity");
// //  Ajouter la quantité totale d'articles du panier

// const TotalPrice = document.querySelector("totalPrice");
// // Ajouter le montant total du panier
