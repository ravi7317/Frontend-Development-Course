/* ============================
   DOM ELEMENTS
============================ */
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");

/* ============================
   LOCAL STORAGE
============================ */
function getCartProductFromLocalStorage() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

/* ============================
   RENDER CART
============================ */
function renderCart() {
  const cart = getCartProductFromLocalStorage();

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty</p>";
    cartTotalEl.textContent = "";
    return;
  }

  let grandTotal = 0;

  cart.forEach((item) => {
    grandTotal += item.price;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <p><strong>Product ID:</strong> ${item.id}</p>
      <p><strong>Quantity:</strong> ${item.quantity}</p>
      <p><strong>Total Price:</strong> ₹${item.price}</p>
      <button onclick="removeItem(${item.id})">Remove</button>
      <hr>
    `;

    cartItemsEl.appendChild(div);
  });

  cartTotalEl.textContent = `Grand Total: ₹${grandTotal}`;
}

/* ============================
   REMOVE ITEM
============================ */
function removeItem(id) {
  let cart = getCartProductFromLocalStorage();
  cart = cart.filter((item) => item.id !== id);

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* ============================
   INIT
============================ */
renderCart();
