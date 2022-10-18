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

//  Fonction de sauvegarde des modifications du panier
function saveCart(data) {
  localStorage.setItem("cart", JSON.stringify(data));
}

// L'affichage des produits
let cart = getCart();
console.log(cart);

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
}

function container(DisplayArticle) {
  document.querySelector("#cart__items").appendChild(DisplayArticle);
}
// Affichage du nombre total de produit (fonction ligne 176)
numberOfItems();

// Affichage du montant total du panier (fonction ligne 186)
cartPrice();

// Fin de la fonction d'affichage

//  --------- Création de la balise article
function displayArticle(data) {
  const Article = document.createElement("article");
  Article.classList.add("cart__item");
  Article.dataset.id = data.id;
  Article.dataset.color = data.color;

  return Article;
}

// Affichage de l'image avec sa description
function displayImage(data) {
  const ImageDiv = document.createElement("div");
  ImageDiv.classList.add("cart__item__img");

  const Image = document.createElement("img");
  Image.src = data.image;
  Image.alt = data.altImg;

  ImageDiv.appendChild(Image);
  return ImageDiv;
}

// Caractéristiques de chaque produit choisi : Nom, Couleur
function displayDescription(data) {
  const Container = document.createElement("div");
  Container.classList.add("cart__item__content");

  const ItemDescription = document.createElement("div");
  ItemDescription.classList.add("cart__item__content__description");

  // Nom du produit
  const ProductName = document.createElement("h2");
  ProductName.innerText = data.name;

  // Couleur choisie
  const ProductColor = document.createElement("p");
  ProductColor.innerText = data.color;

  // Prix => (fonction ligne 107)
  const ProductPrice = price(data);

  // Rattachement de ces 3 élements à la div les contenant
  ItemDescription.appendChild(ProductName);
  ItemDescription.appendChild(ProductColor);
  ItemDescription.appendChild(ProductPrice);

  // Ajout de la div "ItemDescription" à la fiche du produit
  Container.appendChild(ItemDescription);
  return Container;
}

// Affichage du prix
function price(data) {
  const ProductPrice = document.createElement("p");
  let itemPrice = data.price;
  itemPrice *= data.quantity;
  ProductPrice.innerText = `${itemPrice}€`;
  return ProductPrice;
}

// Les quantités et leur modification
function quantity(data) {
  const ProductQuantity = document.createElement("div");
  ProductQuantity.classList.add("cart__item__content__settings__quantity");

  const QuantityChange = quantityInput(data);

  const QuantityNumber = document.createElement("p");
  QuantityNumber.innerText = "Qté : " + data.quantity;

  ProductQuantity.appendChild(QuantityNumber);
  ProductQuantity.appendChild(QuantityChange);
  return ProductQuantity;
}

function quantityInput(data) {
  const QuantityChange = document.createElement("input");
  QuantityChange.setAttribute("type", "number");
  QuantityChange.classList.add("itemQuantity");
  QuantityChange.setAttribute("name", "itemQuantity");
  QuantityChange.setAttribute("min", "1");
  QuantityChange.setAttribute("max", "100");
  QuantityChange.setAttribute("value", data.quantity);
  QuantityChange.setAttribute("aria-label", "Nombre d'articles");

  // Modification des quantités
  QuantityChange.addEventListener("change", function () {
    data.quantity = Number(this.value);

    saveCart(cart);
  });
  return QuantityChange;
}

// La suppression d'articles
function deleteItem() {
  const DeleteBtn = document.createElement("div");
  DeleteBtn.classList.add("cart__item__content__settings__delete");

  const DeleteProduct = document.createElement("p");
  DeleteProduct.classList.add("deleteItem");
  DeleteProduct.innerText = "Supprimer";

  DeleteBtn.appendChild(DeleteProduct);

  DeleteBtn.addEventListener("click", function () {
    let deleteItem = cart.filter(
      (item) => cart.id !== item.id || cart.color !== item.color
    );
    console.log(deleteItem);
  });
  return DeleteBtn;
}

// Changements au panier
function settings(data) {
  const Settings = document.createElement("div");
  const Quantities = quantity(data);
  const DeleteProduct = deleteItem();
  Settings.classList.add("cart__item__content__settings");

  Settings.appendChild(Quantities);
  Settings.appendChild(DeleteProduct);
  return Settings;
}

// // Le montant total du panier
const TotalResults = document.querySelector(".cart__price");

//  Ajouter la quantité totale d'articles du panier
function numberOfItems() {
  const TotalQuantity = document.querySelector("#totalQuantity");
  let number = [];
  cart.forEach((sumItem) => {
    number.push(sumItem.quantity);
  });
  TotalQuantity.innerText = `${eval(number.join("+"))}`;
  return TotalQuantity;
}

function cartPrice() {
  const TotalPrice = document.querySelector("#totalPrice");
  let total = [];
  cart.forEach((sumPrice) => {
    total.push(sumPrice.price * sumPrice.quantity);
  });
  console.log(total);

  TotalPrice.innerText = `${eval(total.join("+"))}` + ",00";
  return TotalPrice;
}
