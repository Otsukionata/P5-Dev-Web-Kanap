"use strict";
console.log("Mon panier");

// =====================  Affichage du nom de la page dans la balise Title pour l'onglet
const Title = document.querySelector("title");
Title.innerText = "Mon panier";

//  =====================  Récupération et affichage des données selon qu'elles soient dans le LS ou dans l'API
function getCart() {
  let cart = localStorage.getItem("cart");
  if (cart === null) {
    let emptyCart = document.querySelector("#cart__items");
    emptyCart.innerText = "Votre panier est vide";
    document.querySelector(".cart__order").style.display = "none";
    return [];
  } else {
    return JSON.parse(cart);
  }
}

async function getPriceFromApi(article) {
  let dataFetch = await fetch(
    `http://localhost:3000/api/products/${article.id}`
  )
    .then((products) => products.json())
    .then((product) => {
      return product;
    });

  const apiProduct = {
    price: dataFetch.price,
  };

  const completeItem = {
    ...article,
    ...apiProduct,
  };

  productDisplay(completeItem);
}

function completeCart() {
  let cart = getCart();
  cart.forEach((item) => {
    getPriceFromApi(item);
  });
}

completeCart();

//  =====================  Fonction de sauvegarde des modifications du panier
function saveCart(data) {
  localStorage.setItem("cart", JSON.stringify(data));
}

//  =====================  Affichage du panier
function container(DisplayArticle) {
  document.querySelector("#cart__items").appendChild(DisplayArticle);
}

function productDisplay(completeItem) {
  const DisplayArticle = displayArticle(completeItem);
  container(DisplayArticle);

  const DisplayImage = displayImage(completeItem);
  const DisplayDescription = displayDescription(completeItem);
  const DisplaySettings = settings(completeItem);

  DisplayArticle.appendChild(DisplayImage);
  DisplayArticle.appendChild(DisplayDescription);
  DisplayArticle.appendChild(DisplaySettings);

  return DisplayArticle;
}

//  ***  Création de la balise article
function displayArticle(completeItem) {
  const Article = document.createElement("article");
  Article.classList.add("cart__item");
  Article.dataset.id = completeItem.id;
  Article.dataset.color = completeItem.color;

  return Article;
}

// ***  Affichage de l'image avec sa description
function displayImage(completeItem) {
  const ImageDiv = document.createElement("div");
  ImageDiv.classList.add("cart__item__img");

  const Image = document.createElement("img");
  Image.src = completeItem.image;
  Image.altTxt = completeItem.altImg;

  ImageDiv.appendChild(Image);
  return ImageDiv;
}

// ***  Affichage nom
function displayName(completeItem) {
  const ProductName = document.createElement("h2");
  ProductName.innerText = completeItem.name;
  return ProductName;
}

// ***  Affichage couleur
function displayColor(completeItem) {
  const ProductColor = document.createElement("p");
  ProductColor.innerText = completeItem.color;
  return ProductColor;
}

// ***  Affichage prix
function displayPrice(completeItem) {
  const Price = document.createElement("p");
  Price.innerText = completeItem.price + "€";
  return Price;
}

// *** Affichage des totaux

function displayTotalQuantity() {
  const AllItems = document.querySelector("#totalQuantity");
  AllItems.innerText = totalquantityCalculation();
  return AllItems;
}

function totalquantityCalculation() {
  let cart = getCart();
  let number = [];
  cart.forEach((sumItem) => {
    number.push(sumItem.quantity);
  });
  let totalNumber = `${eval(number.join("+"))}`;
  console.log(totalNumber);
  return totalNumber;
}
displayTotalQuantity();

function displayTotalPrice() {
  const TotalPrice = document.querySelector("#totalPrice");
  return TotalPrice;
}

function totalPrice() {
  
}

// *** Rattachement des éléments sus-créés
function displayDescription(completeItem) {
  const Card = document.createElement("div");
  Card.classList.add("cart__item__content");

  const ItemDescription = document.createElement("div");
  ItemDescription.classList.add("cart__item__content__description");

  const ProductName = displayName(completeItem);
  const ProductColor = displayColor(completeItem);
  const Price = displayPrice(completeItem);

  ItemDescription.appendChild(ProductName);
  ItemDescription.appendChild(Price);
  ItemDescription.appendChild(ProductColor);

  Card.appendChild(ItemDescription);
  return Card;
}

// ***  Création des boutons pour les changements du panier (suppression, quantité) au HTML
function settings(completeItem) {
  const Settings = document.createElement("div");
  Settings.classList.add("cart__item__content__settings");

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
  QuantityChange.setAttribute("value", completeItem.quantity);
  QuantityChange.setAttribute("aria-label", "Nombre d'articles");
  QuantityChange.addEventListener("change", () => modifyQuantity());

  ProductQuantity.appendChild(QuantityNumber);
  ProductQuantity.appendChild(QuantityChange);

  const DeleteProduct = deleteBtn();

  Settings.appendChild(ProductQuantity);
  Settings.appendChild(DeleteProduct);
  return Settings;
}

function deleteBtn() {
  const DeleteBtn = document.createElement("div");
  DeleteBtn.classList.add("cart__item__content__settings__delete");
  DeleteBtn.addEventListener("click", () => deleteProduct());

  const DeleteProduct = document.createElement("p");
  DeleteProduct.classList.add("deleteItem");
  DeleteProduct.innerText = "Supprimer";

  DeleteBtn.appendChild(DeleteProduct);

  return DeleteBtn;
}

//  =====================  Fonctions de changement au panier : ajout/soustraction/suppression d'articles
function modifyQuantity() {}

function deleteProduct() {}

//  =====================  Gestion du formulaire
const SubmitBtn = document.querySelector(".cart__order__form__submit");

// Les expressions régulières pour l'identité et l'adresse postale
const RegExIdentity = (name) => {
  return /^[a-z A-Z  À-ÿ ōŌ -]{2,55}$/.test(name);
};
const RegExAdress = (address) => {
  return /^(.){2,50}$/.test(address);
};

// *** Soumission du formulaire ***
SubmitBtn.addEventListener("click", function () {
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
      // window.localStorage.clear();
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
