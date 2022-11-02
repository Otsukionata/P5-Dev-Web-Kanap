"use strict";
console.log("Mon panier");

// =====================  Affichage du nom de la page dans la balise Title pour l'onglet
const Title = document.querySelector("title");
Title.innerText = "Panier";

function getCart() {
  //  =====================  Récupération et affichage des données du panier enregistré dans le LS
  let cart = localStorage.getItem("cart");

  // Ce qu'il se passe si le panier est rempli ou vide
  if (cart === null) {
    let emptyCart = document.querySelector("#cart__items");
    emptyCart.innerText = "Votre panier est vide";
    console.log("Panier vide");
    return [];
  } else {
    console.log("Il y a des articles dans le panier !");

    return JSON.parse(cart);
  }
}
let cart = getCart();

// =====================  Récupération et affichage des prix de chaque produit via l'API
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


//  =====================  Fonction de sauvegarde des modifications du panier
function saveCart(data) {
  localStorage.setItem("cart", JSON.stringify(data));
}

// let cartCopy = [];

// console.log(cart);
// // =====================  L'affichage des produits
// cart.forEach((data) => {
//   data.price = priceSettings(data);
//   cartCopy.push(data);
// });

// console.log(cartCopy);

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

//  =====================  Création de la balise article
function displayArticle(product) {
  const Article = document.createElement("article");
  Article.classList.add("cart__item");
  Article.dataset.id = product.id;
  Article.dataset.color = product.color;

  return Article;
}

// =====================  Affichage de l'image avec sa description
function displayImage(product) {
  const ImageDiv = document.createElement("div");
  ImageDiv.classList.add("cart__item__img");

  const Image = document.createElement("img");
  Image.src = product.image;
  Image.alt = product.altImg;

  ImageDiv.appendChild(Image);
  return ImageDiv;
}

// =====================  Caractéristiques de chaque produit choisi : Nom, Couleur, Prix
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

  const Price = document.createElement("p");

  // Rattachement de ces 3 élements à la div les contenant
  ItemDescription.appendChild(ProductName);
  ItemDescription.appendChild(ProductColor);
  ItemDescription.appendChild(Price);

  // Ajout de la div "ItemDescription" à la fiche du produit
  Container.appendChild(ItemDescription);
  return Container;
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

  // =====================  Modification des quantités
  QuantityChange.addEventListener("change", function () {
    product.quantity = Number(this.value);

    numberOfItems();
    saveCart(cart);

    window.location.reload(true);
  });
  return QuantityChange;
}

// =====================  La suppression d'articles
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

// =====================  Rattachement des changements du panier (suppression, quantité) au HTML
function settings(data) {
  const Settings = document.createElement("div");
  const Quantities = quantity(data);
  const DeleteProduct = deleteProduct();
  Settings.classList.add("cart__item__content__settings");

  Settings.appendChild(Quantities);
  Settings.appendChild(DeleteProduct);
  return Settings;
}

//  =====================  Afficher la quantité totale d'articles du panier
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

// =====================  Gestion du formulaire
const SubmitBtn = document.querySelector(".cart__order__form__submit");

/**
 *   if (localStorage.getItem("client")) {
    cart = JSON.parse(localStorage.getItem("client"));
  }
 */

let forename = document.querySelector("#firstName");
let surname = document.querySelector("#lastName");
let address = document.querySelector("#address");
let city = document.querySelector("#city");
let mail = document.querySelector("#email");

let forenameErrMsg = document.querySelector("#firstNameErrorMsg");
let surnameErrMsg = document.querySelector("#lastNameErrorMsg");
let addressErrMsg = document.querySelector("#addressErrorMsg");
let cityErrMsg = document.querySelector("#cityErrorMsg");
let mailErrMsg = document.querySelector("#emailErrorMsg");

let forenameInput, surnameInput, addressInput, cityInput, mailInput;

forename.addEventListener("input", function (event) {
  console.log(forename);
  forenameInput;
  if (event.target.value.length <= 1) {
    forenameInput = null;
    forenameErrMsg.innerText = "Veuillez entrer votre prénom";
    console.log("Champs vide", forenameInput);
  } else if (event.target.value.length < 2 || event.target.value.length > 25) {
    forenameErrMsg.innerText = "Le prénom doit avoir entre 2 et 25 caractères";
    forenameInput = null;
  }
  if (event.target.value.match(/^[a-z A-Z À-ÿ-]{2,25}$/u)) {
    forenameErrMsg.innerText = "";
    forenameInput = event.target.value;
    console.log("Champs non vide", forenameInput);
  } else {
    console.log("Veuillez entrer votre prénom");
    forenameErrMsg.innerText = "Veuillez entrer un prénom valide";
  }
});

surname.addEventListener("input", function (event) {
  console.log(surname);
  surnameInput;
  if (event.target.value.length <= 1) {
    surnameInput = null;
    surnameErrMsg.innerText = "Veuillez entrer votre nom";
    console.log("Champs vide", surnameInput);
  } else if (event.target.value.length < 2 || event.target.value.length > 25) {
    surnameErrMsg.innerText = "Le nom doit avoir entre 2 et 25 caractères";
    surnameInput = null;
  }
  if (event.target.value.match(/^[a-z A-Z  À-ÿ -]{2,25}$/)) {
    surnameErrMsg.innerText = "";
    surnameInput = event.target.value;
    console.log("Champs non vide", surnameInput);
  } else {
    surnameErrMsg.innerText = "Veuillez entrer un nom valide";
  }
});

address.addEventListener("input", function (event) {
  console.log(address);
  addressInput;
  if (event.target.value.length == 0) {
    addressInput = null;
    addressErrMsg.innerText = "Veuillez entrer votre ville";
    console.log("Champs vide", addressInput);
  } else if (event.target.value.length < 1 || event.target.value.length > 42) {
    addressErrMsg.innerText = "La ville doit avoir entre 1 et 45 caractères";
    addressInput = null;
  }
  if (event.target.value.match(/^[0-9][a-x] [a-z A-Z À-ÿ - 0-9]$/)) {
    addressErrMsg.innerText = "";
    addressInput = event.target.value;
    console.log("Champs non vide", addressInput);
  }
});

city.addEventListener("input", function (event) {
  console.log(city);
  cityInput;
  if (event.target.value.length == 0) {
    cityInput = null;
    cityErrMsg.innerText = "Veuillez entrer votre ville";
    console.log("Champs vide", cityInput);
  } else if (event.target.value.length < 1 || event.target.value.length > 42) {
    cityErrMsg.innerText = "La ville doit avoir entre 1 et 45 caractères";
    cityInput = null;
  }
  if (event.target.value.match(/^[a-z A-Z À-ÿ -]{1,45}$/)) {
    cityErrMsg.innerText = "";
    cityInput = event.target.value;
    console.log("Champs non vide", cityInput);
  } else {
    cityErrMsg.innerText = "Veuillez entrer un nom de ville valide";
  }
});

mail.addEventListener("input", function (event) {
  console.log(mail);
  mailInput;
  if (event.target.value.length == 0) {
    mailInput = null;
    mailErrMsg.innerText = "Veuillez entrer votre adresse mail";
    console.log("Champs vide", mailInput);
  } else if (event.target.value.length < 1 || event.target.value.length > 64) {
    mailErrMsg.innerText = "Adresse mail invalide";
    mailInput = null;
  }
  if (
    event.target.value.match(
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    )
  ) {
    mailErrMsg.innerText = "";
    mailInput = event.target.value;
    console.log("Champs non vide", mailInput);
  } else {
    console.log("Veuillez entrer une adresse mail valide", mailInput);
    mailErrMsg.innerText = "Adresse mail invalide";
  }
});

SubmitBtn.addEventListener("click", function (e) {
  // Gestion de la mise en LS
  let contact = [];

  // Création de l'objet contenant les informations à stocker dans le localStorage
  console.log(localStorage.getItem("client"));
  // Création de l'entrée client
  let client = {
    firstName: forenameInput,
    lastName: surnameInput,
    address: addressInput,
    city: cityInput,
    email: mailInput,
  };

  switch (client) {
    case "firstName":
    case "lastName":
    case "address":
    case "city":
    case "email":
      console.log(client);
      contact.push(client);
      console.log(contact);
      break;

    default:
      e.preventDefault();
      console.log("Erreur formulaire");
      break;
  }

  // const Order = {
  //   cart,
  //   contact
  // }

  // if (forenameInput == 0) {
  //   e.preventDefault();
  //   console.log("Erreur formulaire");
  // } else if (surnameInput == 0) {
  //   console.log("Erreur formulaire");
  // } else if (addressInput == 0) {
  //   console.log("Erreur formulaire");
  // } else {
  //   contact.push(client);
  // }

  localStorage.setItem("client", JSON.stringify(contact));
}); // Fin de l'eventlistener
