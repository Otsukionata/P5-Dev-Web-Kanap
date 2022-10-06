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
  .then(function (product) {
    // Affichage du nom de la page dans la balise Title pour l'onglet
    const Title = document.querySelector("title");
    Title.innerText = product.name;

    // Affichage de l'image
    const Image = document.createElement("img");
    Image.src = product.imageUrl;
    // Ne pas oublier la description de l'image
    Image.alt = product.altTxt;

    // Ajout de l'image dans la balise correspondante
    const KanapImg = document.querySelector(".item__img");
    KanapImg.appendChild(Image);

    // Affichage du nom de produit dans la balise h1
    const KanapName = document.querySelector("#title");
    KanapName.innerText = product.name;

    // Insertion du Prix dans le span dédié
    const KanapPrice = document.querySelector("#price");
    KanapPrice.innerText = product.price;

    // Description du produit
    const KanapText = document.querySelector("#description");
    KanapText.innerText = product.description;

    // Choix de la couleur
    const KanapColor = document.querySelector("#colors");

    // Pour chaque produit affiché, prendre ses couleurs disponibles dans l'api et les injecter dans select => option
    const Colors = product.colors;

    // Ajout des options de couleur
    for (let i = 0; i < Colors.length; i++) {
      const Option = Colors[i];
      const Element = document.createElement("option");
      Element.textContent = Option;
      Element.value = Option;
      KanapColor.appendChild(Element);
    }

    console.log(KanapColor);
    // Activation du bouton
    const SendBtn = document.querySelector("#addToCart");

    SendBtn.addEventListener("click", function () {
      const KanapQuantity = document.querySelector("#quantity").value;
      const ColorChoice = document.querySelector("#colors").value;

      // Gestion de la mise en panier

      if (ColorChoice === "") {   //  Pour s'assurer qu'une couleur a été choisie
        alert("Veuillez choisir une couleur");
      } else if (KanapQuantity == 0) {   //  Pour s'assurer qu'une quantité a été entrée
        alert("Veuillez choisir une quantité");
      } else {  //Si tout est bon :
        // Création de l'objet contenant les informations à stocker dans le localStorage
        let cart = {
          idProduct: ID,
          productName: product.name,
          productColor: ColorChoice,
          productPrice: product.price,
          productQuantity: Number(KanapQuantity),
          productImage: product.imageUrl,
          altImg: product.altTxt,
          productTxt: product.description,
        }; // Fin de l'objet à envoyer au panier

        let saveInLocStorage = JSON.parse(localStorage.getItem("data"));

        // fonction gérant l'ajout d'objet au local storage
        const localSave = () => {
          saveInLocStorage.push(cart);
          localStorage.setItem("data", JSON.stringify(saveInLocStorage));
        };

        // Vérification de l'existence d'un objet dans le localStorage. Si absent, création d'un tableau dans lequel sera stocké l'objet
        if (saveInLocStorage) {
          localSave();
          alert("Votre produit a été ajouté au panier");
          window.location.href = "./cart.html";
        } else {
          saveInLocStorage = [];
          localSave();
        }
        // console.log(ColorChoice, KanapQuantity, cart);
        // console.log(saveInLocStorage);

      }
    }); // Fin de l'eventlistener
  });
