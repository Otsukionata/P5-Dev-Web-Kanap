"use scrict";
console.log("Kanap, le Canap");

// 1. Récupérer la balise contenant l'élément : /{product-ID} et Insérer le produit demandé : URLSearchParams ✅
// 2. Insérer la catégorie correspondante (image, titre, prix, description, couleurs) =>
/** Conteneur = section.item => article
 * image
 * h1 : nom du produit
 * span#prix : prix
 * p.description
 * menu déroulant : couleurs
 * ✅
 */
// 3. Envoyer le choix clientèle au panier
// ************************************************************************

// 1. Affichage du produit choisi depuis la page d'accueil
const URL = new URLSearchParams(window.location.search);
const ID = URL.get("id");

console.log(URL);

// 2. Ajout des caractéristiques ddu produit choisi
fetch("http://localhost:3000/api/products/" + ID)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (data) {
    // Affichage du nom de la page dans la balise Title pour l'onglet
    const Title = document.querySelector("title");
    Title.innerText = data.name;

    // Affichage de l'image
    const Image = document.createElement("img");
    Image.src = data.imageUrl;
    // Ne pas oublier la description de l'image
    Image.alt = data.altTxt;

    // Ajout de l'image dans la balise correspondante
    const KanapImg = document.querySelector(".item__img");
    KanapImg.appendChild(Image);

    // Affichage du nom de produit dans la balise h1
    const KanapName = document.querySelector("#title");
    KanapName.innerText = data.name;

    // Insertion du Prix dans le span dédié
    const KanapPrice = document.querySelector("#price");
    const Price = data.price;
    KanapPrice.innerText = Price;

    // Description du produit
    const KanapText = document.querySelector("#description");
    KanapText.innerText = data.description;

    // Choix de la couleur
    const KanapColor = document.querySelector("#colors");

    // Pour chaque produit affiché, prendre ses couleurs disponibles dans l'api et les injecter dans select => option
    const Colors = data.colors;

    // Ajout des options de couleur
    for (let i = 0; i < Colors.length; i++) {
      const Option = Colors[i];
      const Element = document.createElement("option");
      Element.textContent = Option;
      Element.value = Option;
      KanapColor.appendChild(Element);
    }

    // console.log(KanapColor);
    // Activation du bouton
    const SendBtn = document.querySelector("#addToCart");

    SendBtn.addEventListener("click", function () {
      const KanapQuantity = document.querySelector("#quantity").value;
      const ColorChoice = document.querySelector("#colors").value;

      // Gestion de la mise en panier

      if (ColorChoice === "") {
        //  Pour s'assurer qu'une couleur a été choisie
        alert("Veuillez choisir une couleur");
      } else if (KanapQuantity == 0) {
        //  Pour s'assurer qu'une quantité a été entrée
        alert("Veuillez choisir une quantité");
      } else {
        //Si tout est bon :

        // Création de l'objet contenant les informations à stocker dans le localStorage
        console.log(localStorage.getItem("cart"));
        let cart = [];

        if (localStorage.getItem("cart")) {
          cart = JSON.parse(localStorage.getItem("cart"));
        }
        console.log(cart);

        // Création de l'entrée pour chaque article ajouté au panier
        let product = {
          id: ID,
          name: data.name,
          color: ColorChoice,
          price: data.price,
          quantity: Number(KanapQuantity),
          image: data.imageUrl,
          altImg: data.altTxt,
        }; // Fin de l'objet à envoyer au panier

        // Gestion de l'ajout de produits identiques
        let foundProduct = cart.find((p) => p.color == product.color);
        console.log(foundProduct.quantity);
        
        if (foundProduct != undefined) {
          foundProduct.quantity += quantity;
        }
        console.log(foundProduct.quantity);
        cart.push(product);
        // Fin de gestion

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Votre produit a été ajouté au panier");
        // window.location.href = "./cart.html";
      }
    }); // Fin de l'eventlistener
  });
