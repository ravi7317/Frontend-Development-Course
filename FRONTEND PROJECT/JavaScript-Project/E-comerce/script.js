const API = "https://fakestoreapi.com/products";
const productsEl = document.getElementById("products");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const cartSidebar = document.getElementById("cartSidebar");
const cartBtn = document.getElementById("cartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* FETCH PRODUCTS */
async function loadProducts(url = API) {
  try {
    loader.style.display = "block";
    const res = await fetch(url);
    products = await res.json();
    renderProducts(products.slice(0, 12));
  } catch {
    productsEl.innerHTML = "<p>Error loading products</p>";
  } finally {
    loader.style.display = "none";
  }
}

/* RENDER PRODUCTS */
function renderProducts(list) {
  productsEl.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
      <button>Add to Cart</button>
    `;
    div.querySelector("img").onclick = () => openModal(p.id);
    div.querySelector("button").onclick = () => addToCart(p);
    productsEl.appendChild(div);
  });
}

/* SEARCH */
searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  renderProducts(products.filter(p => p.title.toLowerCase().includes(q)));
});

/* CATEGORY */
document.querySelectorAll(".dropdown-content button").forEach(btn => {
  btn.onclick = () => {
    const cat = btn.dataset.category;
    loadProducts(cat === "all" ? API : `${API}/category/${cat}`);
  };
});

/* CART */
function addToCart(product) {
  const item = cart.find(i => i.id === product.id);
  item ? item.qty++ : cart.push({ ...product, qty: 1 });
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.title.slice(0,15)} x${item.qty}</span>
      <div>
        <button onclick="changeQty(${item.id},-1)">-</button>
        <button onclick="changeQty(${item.id},1)">+</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });
  cartTotalEl.textContent = total.toFixed(2);
  cartCountEl.textContent = cart.reduce((a,b)=>a+b.qty,0);
}

function changeQty(id, delta) {
  cart = cart.map(i => i.id === id ? {...i, qty: i.qty + delta} : i)
             .filter(i => i.qty > 0);
  saveCart();
}

cartBtn.onclick = () => cartSidebar.classList.toggle("active");

document.getElementById("checkoutBtn").onclick = () => {
  alert(`Order placed! Total: $${cartTotalEl.textContent}`);
  cart = [];
  saveCart();
};

/* MODAL */
async function openModal(id) {
  const res = await fetch(`${API}/${id}`);
  const p = await res.json();
  modalContent.innerHTML = `
    <h2>${p.title}</h2>
    <img src="${p.image}" style="height:200px">
    <p>${p.description}</p>
    <p><strong>$${p.price}</strong></p>
    <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
  `;
  modal.style.display = "flex";
}

modal.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

/* MOBILE NAV */
document.getElementById("hamburger").onclick = () => {
  document.getElementById("navMenu").classList.toggle("active");
};

renderCart();
loadProducts();
