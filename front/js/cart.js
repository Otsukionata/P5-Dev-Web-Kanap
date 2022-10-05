// if (!localStorage.getItem("cart")) {
//   saveCart();
// } else {
//   getCart();
// }

function getCart() {
  let cart = localStorage.getItem("productOptions");
  if (cart == undefined) {
    return [];
  } else {
    return JSON.parse("productOptions");
  }
}
console.log(getCart());


// function removeProduct(product) {
//   let cart = getCart();
//   cart = cart.filter((prod) => prod.id != product.id);
//   saveCart(cart);
// }

// function changeQuantity(product, quantity) {
//   let cart = getCart();
//   let productExists = cart.find((prod) => prod.id == product.id);
//   if (product != undefined) {
//     productExists += product.quantity;
//     if (productExists <= 0) {
//       removeProduct(productExists);
//     } else {
//       saveCart(cart);
//     }
//   }
// }
