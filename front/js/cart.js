"use strict";

// =====================  Affichage du nom de la page dans la balise Title pour l'onglet
const Title = document.querySelector("title");
Title.innerText = "Mon panier";

//  =====================  Récupération et affichage des données selon qu'elles soient dans le LS ou dans l'API
function getCart() {
  let cart = localStorage.getItem("cart");
  if (cart === null || cart === "[]") {
    let emptyCart = document.querySelector("#cart__items");
    emptyCart.innerText = "Votre panier est vide";
    document.querySelector(".cart__order").style.display = "none";
    return [];
  } else {
    return JSON.parse(cart);
  }
}

// *** Récupération du prix avec gestion d'erreur
async function getPriceFromApi(article) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${article.id}`
    );
    const dataFetch = await response.json();

    const completeItem = {
      ...article,
      ...dataFetch,
    };
    productDisplay(completeItem);

    return dataFetch.price;
  } catch (e) {
    console.log("Erreur");
    let fetchError = document.querySelector("#cart__items");
    fetchError.innerText = "Erreur d'accès au panier";
  }
}

// *** Affichage du panier completé et des prix et quantités totales
async function completeCart() {
  let cart = getCart();

  const totalQuantity = totalquantityCalculation(cart);
  displayTotalQuantity(totalQuantity);

  const totalPrice = await totalPriceCalculation(cart);
  displayTotalPrice(totalPrice);
}

completeCart();

//  =====================  Fonctions permettant l'affichage du panier
function container(DisplayArticle) {
  document.querySelector("#cart__items").appendChild(DisplayArticle);
}

function productDisplay(product) {
  const DisplayArticle = displayArticle(product);
  container(DisplayArticle);

  const DisplayImage = displayImage(product);
  const DisplayDescription = displayDescription(product);
  const DisplaySettings = settings(product);

  DisplayArticle.appendChild(DisplayImage);
  DisplayArticle.appendChild(DisplayDescription);
  DisplayArticle.appendChild(DisplaySettings);

  return DisplayArticle;
}

function displayArticle(product) {
  const Article = document.createElement("article");
  Article.classList.add("cart__item");
  Article.dataset.id = product.id;
  Article.dataset.color = product.color;

  return Article;
}

// ***  Affichage de l'image avec sa description
function displayImage(product) {
  const ImageDiv = document.createElement("div");
  ImageDiv.classList.add("cart__item__img");

  const Image = document.createElement("img");
  Image.src = product.image;
  Image.altTxt = product.altImg;

  ImageDiv.appendChild(Image);
  return ImageDiv;
}

// ***  Affichage nom
function displayName(product) {
  const ProductName = document.createElement("h2");
  ProductName.innerText = product.name;
  return ProductName;
}

// ***  Affichage couleur
function displayColor(product) {
  const ProductColor = document.createElement("p");
  ProductColor.innerText = product.color;
  return ProductColor;
}

// ***  Affichage prix
function displayPrice(product) {
  const Price = document.createElement("p");
  Price.innerText = product.price + "€";
  return Price;
}

// *** Rattachement des éléments sus-créés
function displayDescription(product) {
  const Card = document.createElement("div");
  Card.classList.add("cart__item__content");

  const ItemDescription = document.createElement("div");
  ItemDescription.classList.add("cart__item__content__description");

  const ProductName = displayName(product);
  const ProductColor = displayColor(product);
  const Price = displayPrice(product);

  ItemDescription.appendChild(ProductName);
  ItemDescription.appendChild(Price);
  ItemDescription.appendChild(ProductColor);

  Card.appendChild(ItemDescription);
  return Card;
}

//  =====================  Fonction de sauvegarde des modifications du panier
function saveCart(data) {
  localStorage.setItem("cart", JSON.stringify(data));
}

// ***  Création des boutons pour les changements du panier (suppression, quantité) au HTML

// Les boutons à activer
function settings(product) {
  const Settings = document.createElement("div");
  Settings.classList.add("cart__item__content__settings");

  const ProductQuantity = changeBtn(product);
  const DeleteProduct = deleteBtn();

  Settings.appendChild(ProductQuantity);
  Settings.appendChild(DeleteProduct);
  return Settings;
}

// L'input pour le changement
function changeBtn(product) {
  const ProductQuantity = document.createElement("div");
  ProductQuantity.classList.add("cart__item__content__settings__quantity");

  const QuantityNumber = document.createElement("p");
  QuantityNumber.innerText = "Qté : ";

  const QuantityChange = document.createElement("input");
  QuantityChange.setAttribute("type", "number");
  QuantityChange.classList.add("itemQuantity");
  QuantityChange.setAttribute("name", "itemQuantity");
  QuantityChange.setAttribute("min", "1");
  QuantityChange.setAttribute("max", "100");
  QuantityChange.setAttribute("value", product.quantity);
  QuantityChange.setAttribute("aria-label", "Nombre d'articles");
  QuantityChange.addEventListener("change", function () {
    let productId = this.closest("article").dataset.id;
    let productColor = this.closest("article").dataset.color;
    let productQuantity = this.value;
    modifyQuantity(productId, productColor, productQuantity);
  });

  ProductQuantity.appendChild(QuantityNumber);
  ProductQuantity.appendChild(QuantityChange);
  return ProductQuantity;
}

// Le bouton de suppression
function deleteBtn() {
  const DeleteBtn = document.createElement("div");
  DeleteBtn.classList.add("cart__item__content__settings__delete");
  DeleteBtn.addEventListener("click", function () {
    let productId = this.closest("article").dataset.id;
    let productColor = this.closest("article").dataset.color;
    deleteProduct(productId, productColor);
    window.location.reload(true);
  });

  const DeleteProduct = document.createElement("p");
  DeleteProduct.classList.add("deleteItem");
  DeleteProduct.innerText = "Supprimer";

  DeleteBtn.appendChild(DeleteProduct);

  return DeleteBtn;
}

//  =====================  Fonctions de changement au panier : ajout/soustraction/suppression d'articles
function modifyQuantity(id, color, quantity) {
  let cart = getCart();
  let getProduct = cart.find((p) => p.id == id && p.color == color);
  if (getProduct != undefined) {
    getProduct.quantity = quantity;
  }
  window.location.reload(true);

  saveCart(cart);
}

function deleteProduct(id, color) {
  let cart = getCart();
  cart = cart.filter((p) => p.color !== color && p.id === id);

  alert("Ce produit va être supprimé du panier !");

  saveCart(cart);
}

// *** Affichage des totaux
function displayTotalPrice(num) {
  const TotalPrice = document.querySelector("#totalPrice");
  TotalPrice.innerText = num;
}

function displayTotalQuantity(num) {
  const AllItems = document.querySelector("#totalQuantity");
  AllItems.innerText = num;
}

function totalquantityCalculation(cart) {
  let total = 0;
  cart.forEach((product) => {
    total += Number(product.quantity);
  });
  return total;
}

async function totalPriceCalculation(cart) {
  let totalPrice = 0;
  for (const product of cart) {
    const price = await getPriceFromApi(product);
    totalPrice += Number(price) * Number(product.quantity);
  }
  return totalPrice;
}
//  =====================  Gestion du formulaire
const SubmitBtn = document.querySelector(".cart__order__form__submit");

// Les expressions régulières pour l'identité et l'adresse postale
const RegExIdentity = (name) => {
  return /^[a-z A-Z  À-ÿ ōŌ -]{2,55}$/.test(name);
};
const RegExAdress = (postalAdress) => {
  return /([A-Z a-z à-ÿ 0-9]+)?\,?\s?(a-x)?\,?\s?(a-x)?\s([a-z A-Z à-ÿ 0-9\s]{2,})+/gi.test(
    postalAdress
  );
};

// *** Soumission du formulaire ***
SubmitBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // L'objet "contact" à envoyer au LS et au back
  const contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  // *** Contrôle du formulaire ***
  let forenameErrMsg = document.querySelector("#firstNameErrorMsg");
  let surnameErrMsg = document.querySelector("#lastNameErrorMsg");
  let addressErrMsg = document.querySelector("#addressErrorMsg");
  let cityErrMsg = document.querySelector("#cityErrorMsg");
  let mailErrMsg = document.querySelector("#emailErrorMsg");

  function forenameControl() {
    const Forename = contact.firstName;
    if (RegExIdentity(Forename)) {
      forenameErrMsg.innerText = "";
      return true;
    } else {
      forenameErrMsg.innerText = "Veuillez entrer un prénom valide";
      return false;
    }
  }

  // Nom de famille le plus long : "Pourroy de L’Auberivière de Quinsonas-Oudinot de Reggio"
  function lastnameControl() {
    const Surname = contact.lastName;
    if (RegExIdentity(Surname)) {
      surnameErrMsg.innerText = "";
      return true;
    } else {
      surnameErrMsg.innerText = "Veuillez entrer un nom valide";
      return false;
    }
  }

  function addressControl() {
    const Address = contact.address;
    if (RegExAdress(Address)) {
      addressErrMsg.innerText = "";
      return true;
    } else {
      addressErrMsg.innerText = "Veuillez entrer une adresse valide";
      return false;
    }
  }

  // Nom de ville française le plus court : "Y" ; le plus long : "Saint-Remy-en-Bouzemont-Saint-Genest-et-Isson"
  function cityControl() {
    const City = contact.city;
    if (/^[a-z A-Z À-ÿ -]{1,45}$/.test(City)) {
      cityErrMsg.innerText = "";
      return true;
    } else {
      cityErrMsg.innerText = "Veuillez entrer un nom de ville valide";
      return false;
    }
  }

  function mailControl() {
    const Email = contact.email;
    if (
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
        Email
      )
    ) {
      mailErrMsg.innerText = "";
      return true;
    } else {
      mailErrMsg.innerText = "Veuillez entrer une adresse mail valide";
      return false;
    }
  }

  // *** Vérification et envoi du formulaire validé ***
  if (
    forenameControl() &&
    lastnameControl() &&
    addressControl() &&
    cityControl() &&
    mailControl()
  ) {
    localStorage.setItem("client", JSON.stringify(contact));
  } else {
    alert("Erreur formulaire. Veuillez vérifier les champs indiqués.");
    return;
  }

  let products = [];
  let cart = getCart();
  cart.forEach((item) => {
    products.push(item.id);
  });

  const Order = {
    products,
    contact,
  };

  //  =====================  Envoi au serveur
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(Order),
  })
    .then(function (response) {
      const Response = response.json();
      return Response;
    })
    .then(function (json) {
      const ID = json.orderId;
      window.location = `./confirmation.html?id=${ID}`;
      window.localStorage.clear();
    });
});
