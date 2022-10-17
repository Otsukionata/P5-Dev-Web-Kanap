"use strict";
console.log("Mon panier");

function getCart() {
  //  1. Récupération et affichage des données du panier
  let cart = localStorage.getItem("cart");

  // Ce qu'il se passe si le panier est rempli ou vide
  if (cart == null) {
    let emptyCart = document.querySelector("#cart__items");
    emptyCart.innerText = "Votre panier est vide";
    console.log("Panier vide");
    return [];
  } else {
    console.log("Il y a des articles dans le panier !");
    return JSON.parse(localStorage.getItem("cart"));
  }
}

// L'affichage des produits
let cart = getCart();

cart.forEach((data) => itemDisplay(data));
function itemDisplay(data) {
  const DisplayArticle = displayArticle(data);
  container(DisplayArticle);

  const DisplayImage = displayImage(data);
  const DisplayDescription = displayDescription(data);
  const DisplaySettings = settings(data);

  DisplayArticle.appendChild(DisplayImage);
  DisplayArticle.appendChild(DisplayDescription);
  DisplayArticle.appendChild(DisplaySettings);

  console.log(DisplayArticle);
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
  let itemPrice = data.price;
  itemPrice *= data.quantity;
  ProductPrice.innerText = `${itemPrice}€`;

  ItemDescription.appendChild(ProductName);
  ItemDescription.appendChild(ProductColor);
  ItemDescription.appendChild(ProductPrice);

  Container.appendChild(ItemDescription);
  return Container;
}

// Les quantités et leur modification
function changeQuantities(data) {
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

  QuantityChange.addEventListener("change", function () {
    console.log(QuantityChange.value);
  });

  ProductQuantity.appendChild(QuantityChange);
  return ProductQuantity;
}

// La suppression d'articles
function deleteItem() {
  const DeleteDiv = document.createElement("div");
  DeleteDiv.classList.add("cart__item__content__settings__delete");

  const DeleteProduct = document.createElement("p");
  DeleteProduct.classList.add("deleteItem");
  DeleteProduct.innerText = "Supprimer";

  DeleteDiv.appendChild(DeleteProduct);
  return DeleteDiv;
}

// Changements au panier
function settings(data) {
  const Settings = document.createElement("div");
  const Quantities = changeQuantities(data);
  const DeleteProduct = deleteItem();
  Settings.classList.add("cart__item__content__settings");

  Settings.appendChild(Quantities);
  Settings.appendChild(DeleteProduct);
  return Settings;
}

// // Le montant total du panier
const TotalResults = document.querySelector(".cart__price");

/**
 *   const ProductPrice = document.createElement("p");
  let itemPrice = data.price;
  itemPrice *= data.quantity;
  ProductPrice.innerText = `${itemPrice}€`;
 */

//  Ajouter la quantité totale d'articles du panier
function numberOfItems(data) {
  const TotalQuantity = document.querySelector("#totalQuantity");
  let number = 0;
  for (let product of data) {
    number += data.quantity;
    return number;
  }
  TotalQuantity.innerText = number;
}

function cartPrice(data) {
  const TotalPrice = document.querySelector("#totalPrice");
  let total = 0;
  for (let product of data) {
    total += data.price;
    return total;
  }
  TotalPrice.innerText = total + ",00€";
}
// // Ajouter le montant total du panier
