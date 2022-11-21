"use strict";

async function getProducts() {
  const Response = await fetch("http://localhost:3000/api/products");
  const Products = await Response.json();
  createProduct(Products);
}
getProducts();

/**
 *
 * @param { Array } product
 */

function createProduct(product) {
  for (let i = 0; i < product.length; i++) {
    // Balise récupérant les cartes dans le DOM
    const SectionCards = document.querySelector("#items");

    // Faire de chaque carte un lien vers la page produit correspondante
    const Link = document.createElement("a");
    Link.href = "./product.html?id=" + product[i]._id;
    const Cards = document.createElement("article");

    // Image du canapé
    const ImgKanap = document.createElement("img");
    ImgKanap.src = product[i].imageUrl;
    ImgKanap.alt = product[i].altTxt;
    Cards.appendChild(ImgKanap);

    // Nom de marque du canapé
    const NameKanap = document.createElement("h3");
    NameKanap.innerText = product[i].name;
    NameKanap.classList.add("productName");
    Cards.appendChild(NameKanap);

    // Description
    const DescriptionKanap = document.createElement("p");
    DescriptionKanap.innerText = product[i].description;
    DescriptionKanap.classList.add("productDescription");
    Cards.appendChild(DescriptionKanap);

    // Adoption des éléments précédents par leurs parents respectifs
    Link.appendChild(Cards);
    SectionCards.appendChild(Link);
  }
}
