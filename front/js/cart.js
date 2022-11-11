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
