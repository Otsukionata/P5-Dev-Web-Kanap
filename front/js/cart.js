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
    // Cacher le formulaire
    document.querySelector(".cart__order").style.display = "none";
    return [];
  } else {
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
      return { TotalPrice, Price };
    });
}

//  =====================  Fonction de sauvegarde des modifications du panier
function saveCart(data) {
  localStorage.setItem("cart", JSON.stringify(data));
}

let cartCopy = [];

// =====================  L'affichage des produits
cart.forEach((data) => {
  productDisplay(data);
  data.price = priceSettings(data);
  cartCopy.push(data);
});

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

  // const ProductPrice = priceSettings(product).Price;

  // Rattachement de ces 3 élements à la div les contenant
  ItemDescription.appendChild(ProductName);
  ItemDescription.appendChild(ProductColor);
  // ItemDescription.appendChild(ProductPrice);

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

// L'expression régulière pour les nom et prénom
const RegExIdentity = (name) => {
  return /^[a-z A-Z  À-ÿ ōŌ -]{2,55}$/.test(name);
};

// *** Soumission du formulaire ***
SubmitBtn.addEventListener("click", function (e) {

  // L'objet "contact" à envoyer au local storage et au back pour terminer la commande
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
    if (
      /^(\d+)?\,?\s?(a-x)?\,?\s?(a-x)?\s([a-zA-Zà-ÿ0-9\s]{2,})+$/gi.test(
        Address
      )
    ) {
      addressErrMsg.innerText = "";
      return true;
    } else {
      addressErrMsg.innerText = "Veuillez entrer une adresse valide";
      return false;
    }
  }

  // Nom de ville française le plus court : "Y", nom le plus long : "Saint-Remy-en-Bouzemont-Saint-Genest-et-Isson"
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
  }

  let products = [];
  cart.forEach((item) => {
    products.push(item.id);
  });

  const Order = {
    products,
    contact,
  };

  // ===================== Envoi au serveur
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
    });
});

// *** Récupération d'éventuelles données de client existantes ***
const ExistingContact = JSON.parse(localStorage.getItem("client"));
if (ExistingContact) {
  // Remplissage des champs avec les données trouvées
  function ClientFromLS(input) {
    document.querySelector(`#${input}`).value = ExistingContact[input];
  }
  ClientFromLS("firstName");
  ClientFromLS("lastName");
  ClientFromLS("address");
  ClientFromLS("city");
  ClientFromLS("email");
} else {
  console.log("Création fichier client");
}
