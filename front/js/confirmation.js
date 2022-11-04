"use strict";
console.log("Confirmation");

const URL = new URLSearchParams(window.location.search);
const ID = URL.get("id");

const orderId = document.querySelector("#orderId");
orderId.innerText = ID;
