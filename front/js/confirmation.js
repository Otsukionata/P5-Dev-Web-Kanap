"use strict";

// ===================== Récupération du numéro de commande depuis l'URL de la page affichée
const URL = new URLSearchParams(window.location.search);
const ID = URL.get("id");

// ===================== Affichage du numéro de commande dans le cadre dédié
const orderId = document.querySelector("#orderId");
orderId.innerText = ID;