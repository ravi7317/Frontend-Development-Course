import "./style.css";

/* ============================
   DOM ELEMENTS
============================ */
const productContainer = document.querySelector("#productContainer");
const productTemplate = document.querySelector("#producttemplet");
const cartCountEl = document.querySelector("#cartValue .cart-count");

/* ============================
   LOCAL STORAGE HELPERS
============================ */
function getCartProductFromLocalStorage() {
  const cartProducts = localStorage.getItem("cart");
  if (!cartProducts) return [];
  return JSON.parse(cartProducts);
}

function updateCartCount() {
  if (!cartCountEl) return;

  const cart = getCartProductFromLocalStorage();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalQty;
}

/* ============================
   API LOAD
============================ */
async function loadProductsFromAPI() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error("Failed to fetch products");

    const products = await res.json();
    showProductContainer(products);
  } catch (err) {
    console.error(err);
  }
}

/* ============================
   RENDER PRODUCTS
============================ */
function showProductContainer(products) {
  if (!products || !productContainer || !productTemplate) return;

  productContainer.innerHTML = "";

  products.forEach((product) => {
    const id = product.id;
    const name = product.title;
    const image = product.image;
    const category = product.category;
    const price = product.price;
    const stock = product.rating?.count ?? 0;

    const productClone = document.importNode(productTemplate.content, true);

    productClone.querySelector(".category").textContent = category;
    productClone.querySelector(".productName").textContent = name;

    const img = productClone.querySelector(".productImage");
    img.src = image;
    img.alt = name;

    productClone.querySelector(".productPrice").textContent = `₹${price}`;
    productClone.querySelector(".productActualPrice").textContent =
      `₹${Math.round(price * 1.2)}`;

    productClone.querySelector(".productStock").textContent = stock;

    // quantity + / -
    productClone
      .querySelector(".stockElement")
      .addEventListener("click", (event) => {
        homeQuantityToggle(event, stock);
      });

    // add to cart
    productClone
      .querySelector(".add-to-cart-button")
      .addEventListener("click", (event) => {
        addToCart(event, id);
      });

    productContainer.append(productClone);
  });
}

/* ============================
   QUANTITY TOGGLE
============================ */
function homeQuantityToggle(event, stock) {
  const target = event.target;

  if (
    !target.classList.contains("cartIncrement") &&
    !target.classList.contains("cartDecrement")
  )
    return;

  const card = target.closest(".card");
  if (!card) return;

  const qtyEl = card.querySelector(".productQuantity");
  let qty = Number(qtyEl.textContent);

  if (target.classList.contains("cartIncrement")) {
    if (qty < stock) qty++;
  } else {
    if (qty > 1) qty--;
  }

  qtyEl.textContent = qty;
}

/* ============================
   ADD TO CART (PRICE × QTY)
============================ */
function addToCart(event, id) {
  const currentCard = event.target.closest(".card");
  if (!currentCard) return;

  // Step 1: remove ₹
  const singlePrice = Number(
    currentCard
      .querySelector(".productPrice")
      .textContent.replace("₹", "")
      .trim()
  );

  // Step 2: quantity & total price
  const quantity = Number(
    currentCard.querySelector(".productQuantity").textContent
  );
  const totalPrice = singlePrice * quantity;

  // Step 3: product object
  const productData = {
    id,
    quantity,
    price: totalPrice,
  };

  // Step 4: update cart array
  const cartProducts = getCartProductFromLocalStorage();
  const existing = cartProducts.find((item) => item.id === id);

  if (existing) {
    existing.quantity += quantity;
    existing.price += totalPrice;
  } else {
    cartProducts.push(productData);
  }

  // Step 5: save to localStorage
  localStorage.setItem("cart", JSON.stringify(cartProducts));

  updateCartCount();
}

/* ============================
   INIT
============================ */
updateCartCount();
loadProductsFromAPI();
