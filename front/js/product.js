"use scrict";

console.log("Kanap, le Canap");

// 1. Insérer le produit demandé : URLSearchParams ✅
// 2. Récupérer la balise contenant l'élément : /{product-ID}
// 3. Insérer la catégorie correspondante (image, titre, prix, description, couleurs) =>
/** Conteneur = section.item => article
 * image
 * h1 : nom du produit
 * span#prix : prix
 * p.description
 * menu déroulant : couleurs
 */
const URL = new URLSearchParams(document.location.search);
const ID = URL.get("id");

console.log(URL);

fetch("http://localhost:3000/api/products/" + ID)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (product) {

    // Nom de la page
    const Title = document.querySelector("title");
    Title.innerText = product.name;

    // Image
    const Image = document.createElement("img");
    Image.src = product.imageUrl;
    Image.alt = product.altTxt;
    const KanapImg = document.querySelector(".item__img");
    KanapImg.appendChild(Image);

    // Nom du produit : h1
    const KanapName = document.querySelector("#title");
    KanapName.innerText = product.name;

    // Prix
    const KanapPrice = document.querySelector("#price");
    KanapPrice.innerText = product.price;

    // Description
    const KanapText = document.querySelector("#description");
    KanapText.innerText = product.description;

    // Choix de la couleur
    const option = document.createElement("option");
    option.value = product.colors;
    option.innerText = product.colors;

    const KanapColor = document.querySelector("#colors");
    KanapColor.appendChild(option);
  });