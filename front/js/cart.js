"use strict";
console.log("Mon panier");

// Cacher le formulaire
document.querySelector(".cart__order").style.display = "none";

// Affichage du nom de la page dans la balise Title pour l'onglet
const Title = document.querySelector("title");
Title.innerText = "Panier";

function getCart() {
  //  1. Récupération et affichage des données du panier enregistré dans le LS
  let cart = localStorage.getItem("cart");

  // Ce qu'il se passe si le panier est rempli ou vide
  if (cart === null) {
    let emptyCart = document.querySelector("#cart__items");
    emptyCart.innerText = "Votre panier est vide";
    console.log("Panier vide");
    return [];
  } else {
    console.log("Il y a des articles dans le panier !");
    // console.log(cart);

    return JSON.parse(cart);
  }
}
let cart = getCart();

//  Fonction de sauvegarde des modifications du panier
function saveCart(data) {
  localStorage.setItem("cart", JSON.stringify(data));
}

// L'affichage des produits
cart.forEach((data) => productDisplay(data));

function productDisplay(data) {
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

//  --------- Création de la balise article
function displayArticle(product) {
  const Article = document.createElement("article");
  Article.classList.add("cart__item");
  Article.dataset.id = product.id;
  Article.dataset.color = product.color;

  return Article;
}

// Affichage de l'image avec sa description
function displayImage(product) {
  const ImageDiv = document.createElement("div");
  ImageDiv.classList.add("cart__item__img");

  const Image = document.createElement("img");
  Image.src = product.image;
  Image.alt = product.altImg;

  ImageDiv.appendChild(Image);
  return ImageDiv;
}

// Caractéristiques de chaque produit choisi : Nom, Couleur, Prix
function displayDescription(product) {
  const Container = document.createElement("div");
  Container.classList.add("cart__item__content");

  const ItemDescription = document.createElement("div");
  ItemDescription.classList.add("cart__item__content__description");

  // Nom du produit
  const ProductName = document.createElement("h2");
  ProductName.innerText = product.name;

  // Couleur choisie
  const ProductColor = document.createElement("p");
  ProductColor.innerText = product.color;

  // Stockage en variables des id des articles et des conteneurs à créer dans le HTML
  const Price = priceSettings(product);

  // Rattachement de ces 3 élements à la div les contenant
  ItemDescription.appendChild(ProductName);
  ItemDescription.appendChild(ProductColor);
  ItemDescription.appendChild(Price);

  // Ajout de la div "ItemDescription" à la fiche du produit
  Container.appendChild(ItemDescription);
  return Container;
}

function priceSettings(data) {
  const ID = data.id;
  const Price = document.createElement("p");

  // Récupération et affichage du prix de chaque produit dans l'API via leurs id respectifs et calcul selon sa quantité
  fetch("http://localhost:3000/api/products/" + ID)
    .then((response) => response.json())
    .then(function (p) {
      let productPrice = p.price;
      Price.innerText = `${productPrice}€`;

      // Le montant total du panier
      const TotalPrice = document.querySelector("#totalPrice");
      let total = [];
      cart.forEach((sumPrice) => {
        total.push(productPrice * sumPrice.quantity);
      });

      TotalPrice.innerText = `${eval(total.join("+"))}` + ",00";
      return TotalPrice;
    });

  return Price;
}

// Affichage des quantités et de leurs boutons associés
function quantity(product) {
  const ProductQuantity = document.createElement("div");
  ProductQuantity.classList.add("cart__item__content__settings__quantity");

  const QuantityChange = quantityInput(product);

  const QuantityNumber = document.createElement("p");
  QuantityNumber.innerText = "Qté : " + product.quantity;

  ProductQuantity.appendChild(QuantityNumber);
  ProductQuantity.appendChild(QuantityChange);
  return ProductQuantity;
}

function quantityInput(product) {
  const QuantityChange = document.createElement("input");
  QuantityChange.setAttribute("type", "number");
  QuantityChange.classList.add("itemQuantity");
  QuantityChange.setAttribute("name", "itemQuantity");
  QuantityChange.setAttribute("min", "1");
  QuantityChange.setAttribute("max", "100");
  QuantityChange.setAttribute("value", product.quantity);
  QuantityChange.setAttribute("aria-label", "Nombre d'articles");

  // Modification des quantités
  QuantityChange.addEventListener("change", function () {
    product.quantity = Number(this.value);

    numberOfItems();
    saveCart(cart);

    window.location.reload(true);
  });
  return QuantityChange;
}

// La suppression d'articles
function deleteProduct() {
  const DeleteBtn = document.createElement("div");
  DeleteBtn.classList.add("cart__item__content__settings__delete");

  const DeleteProduct = document.createElement("p");
  DeleteProduct.classList.add("deleteItem");
  DeleteProduct.innerText = "Supprimer";

  DeleteBtn.appendChild(DeleteProduct);

  DeleteBtn.addEventListener("click", function () {
    let deleteProduct = DeleteBtn.closest("article");
    let cart = JSON.parse(localStorage.getItem("cart"));

    let updateLocalStorage = cart.filter(
      (element) =>
        element.id !== deleteProduct.dataset.id ||
        element.color !== deleteProduct.dataset.color
    );

    localStorage.setItem("cart", JSON.stringify(updateLocalStorage));

    alert("Ce produit va être supprimé du panier.");

    deleteProduct.remove();
    numberOfItems();
  });
  return DeleteBtn;
}

// Rattachement des changements du panier (suppression, quantité) au HTML
function settings(data) {
  const Settings = document.createElement("div");
  const Quantities = quantity(data);
  const DeleteProduct = deleteProduct();
  Settings.classList.add("cart__item__content__settings");

  Settings.appendChild(Quantities);
  Settings.appendChild(DeleteProduct);
  return Settings;
}

//  Afficher la quantité totale d'articles du panier
function numberOfItems() {
  const TotalQuantity = document.querySelector("#totalQuantity");
  let number = [];
  cart.forEach((sumItem) => {
    number.push(sumItem.quantity);
  });
  TotalQuantity.innerText = `${eval(number.join("+"))}`;
  return TotalQuantity;
}

numberOfItems();

// Fin de la fonction d'affichage

// Gestion du formulaire

/**
 *   const validEmail = function (inputEmail) {
  let emailRegExp = new RegExp(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )};
 */
