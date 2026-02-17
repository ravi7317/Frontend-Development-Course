let products = [];
let filters = {
  q: "",
  category: "ALL",
  minPrice: 0,
  maxPrice: 9999,
  sort: "NONE",
};

let cart = {};

const productsGrid = document.getElementById("products-grid");
const cartItems = document.getElementById("cart-items");
const cartCount = document.querySelector(".cart-count");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const productsCountEl = document.getElementById("products-count");

const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const priceSlider = document.getElementById("price-slider");
const sliderValue = document.getElementById("slider-value");
const sortSelect = document.getElementById("sort");
const clearFiltersBtn = document.getElementById("clear-filters");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-btn");

// API URL
const API_URL = "https://fakestoreapi.com/products";

// Initialize the app
async function init() {
  try {
    // Load products from API
    await loadProducts();

    // Load cart from localStorage
    loadCart();

    // Build category dropdown
    buildCategoryFilter();

    // Render initial views
    renderProducts(applyFilters(products));
    renderCart();

    // Setup event listeners
    setupEventListeners();

    console.log("App initialized successfully");
  } catch (error) {
    console.error("Error initializing app:", error);
    productsGrid.innerHTML = `
      <div class="loading error">
        <i class="fas fa-exclamation-triangle"></i> 
        <p>Failed to load products. Please check your connection and try again.</p>
      </div>
    `;
  }
}

async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");

    products = await response.json();
    console.log(`Loaded ${products.length} products from API`);
  } catch (error) {
    console.error("Error loading products:", error);
    throw error;
  }
}
// filter function
function buildCategoryFilter() {
  const categories = [
    "ALL",
    ...new Set(products.map((product) => product.category)),
  ];

  while (categorySelect.options.length > 1) {
    categorySelect.remove(1);
  }

  categories.forEach((category) => {
    if (category === "ALL") return;

    const option = document.createElement("option");
    option.value = category;
    const formattedCategory = category
      .replace(/'s /g, "'s ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    option.textContent = formattedCategory;
    categorySelect.appendChild(option);
  });
}

function applyFilters(productsList) {
  let filtered = [...productsList];

  // 🔍 Search filter
  if (filters.q.trim()) {
    const searchTerm = filters.q.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  }

  // 📂 Category filter
  if (filters.category !== "ALL") {
    filtered = filtered.filter(
      (product) => product.category === filters.category
    );
  }

  // 💰 Price filter
  filtered = filtered.filter(
    (product) =>
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice
  );

  // ↕ Sort
  if (filters.sort !== "NONE") {
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case "LOW":
          return a.price - b.price;
        case "HIGH":
          return b.price - a.price;
        case "RATING":
          return b.rating.rate - a.rating.rate;
        default:
          return 0;
      }
    });
  }

  return filtered;
}

// Cart Management Functions
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1
    };
  }
  
  // Update state
  saveCart();
  renderCart();
  renderCartCount();
  
  // Show feedback
  showNotification(`Added "${product.title}" to cart`);
}

function incQty(id) {
  if (cart[id]) {
    cart[id].qty += 1;
    saveCart();
    renderCart();
    renderCartCount();
  }
}

function decQty(id) {
  if (cart[id] && cart[id].qty > 1) {
    cart[id].qty -= 1;
    saveCart();
    renderCart();
    renderCartCount();
  }
}

function removeItem(id) {
  if (cart[id]) {
    const productName = cart[id].title;
    delete cart[id];
    saveCart();
    renderCart();
    renderCartCount();
    
    // Show feedback
    showNotification(`Removed "${productName}" from cart`);
  }
}

function clearCart() {
  if (Object.keys(cart).length === 0) return;
  
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = {};
    saveCart();
    renderCart();
    renderCartCount();
    
    // Show feedback
    showNotification('Cart cleared');
  }
}
function getTotals() {
  const items = Object.values(cart);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // Shipping: free over $100, otherwise $10
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 10;
  
  const total = subtotal + shipping;
  
  return { subtotal, shipping, total };
}

// Get cart item count
function getCartCount() {
  return Object.values(cart).reduce((count, item) => count + item.qty, 0);
}
// Persistence
function saveCart() {
  localStorage.setItem('shopEasyCart', JSON.stringify(cart));
}
function loadCart() {
  const savedCart = localStorage.getItem('shopEasyCart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      renderCartCount();
      console.log(`Loaded cart with ${Object.keys(cart).length} items`);
    } catch (error) {
      console.error('Error loading cart:', error);
      cart = {};
    }
  }
}
// Rendering Functions
function renderProducts(productsList) {
  if (productsList.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search term</p>
      </div>
    `;
    productsCountEl.textContent = '0';
    return;
  }
  
  const productsHTML = productsList.map(product => {
    const isInCart = cart[product.id] ? true : false;
    
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-img">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <span class="product-category">${product.category}</span>
          <div class="product-bottom">
            <div class="price-rating">
              <div class="product-price">$${product.price.toFixed(2)}</div>
              <div class="product-rating">
                <i class="fas fa-star"></i>
                <span>${product.rating.rate}</span>
                <span class="rating-count">(${product.rating.count})</span>
              </div>
            </div>
          </div>
          <button class="add-to-cart" ${isInCart ? 'disabled' : ''}>
            ${isInCart ? 
              '<i class="fas fa-check"></i> In Cart' : 
              '<i class="fas fa-cart-plus"></i> Add to Cart'}
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  productsGrid.innerHTML = productsHTML;
  productsCountEl.textContent = productsList.length;
}
function renderCart() {
  const cartItemsArray = Object.values(cart);
  
  if (cartItemsArray.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-cart-arrow-down"></i>
        <p>Your cart is empty</p>
        <p>Add some products from the store</p>
      </div>
    `;
    
    // Update totals
    const totals = getTotals();
    subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
    totalEl.textContent = `$${totals.total.toFixed(2)}`;
    
    // Disable checkout button
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> Cart is Empty';
    
    return;
  }
  
  // Render cart items
  const cartItemsHTML = cartItemsArray.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn dec-qty">-</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn inc-qty">+</button>
          <button class="remove-item">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
  
  cartItems.innerHTML = cartItemsHTML;
  
  // Update totals
  const totals = getTotals();
  subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
  totalEl.textContent = `$${totals.total.toFixed(2)}`;
  
  // Enable checkout button
  checkoutBtn.disabled = false;
  checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> Proceed to Checkout ($' + totals.total.toFixed(2) + ')';
}

function renderCartCount() {
  const count = getCartCount();
  cartCount.textContent = count;
  
  // Update product cards if any are in cart
  document.querySelectorAll('.product-card').forEach(card => {
    const id = parseInt(card.dataset.id);
    const addButton = card.querySelector('.add-to-cart');
    
    if (cart[id]) {
      addButton.disabled = true;
      addButton.innerHTML = '<i class="fas fa-check"></i> In Cart';
    } else {
      addButton.disabled = false;
      addButton.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
    }
  });
}
function renderTotals() {
  const totals = getTotals();
  subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
  totalEl.textContent = `$${totals.total.toFixed(2)}`;
}

// Event Listeners Setup
function setupEventListeners() {
  // Filter event listeners
  searchInput.addEventListener('input', (e) => {
    filters.q = e.target.value;
    renderProducts(applyFilters(products));
  });
  
  categorySelect.addEventListener('change', (e) => {
    filters.category = e.target.value;
    renderProducts(applyFilters(products));
  });
  
  minPriceInput.addEventListener('input', (e) => {
    filters.minPrice = parseFloat(e.target.value) || 0;
    renderProducts(applyFilters(products));
  });
  
  maxPriceInput.addEventListener('input', (e) => {
    filters.maxPrice = parseFloat(e.target.value) || 9999;
    renderProducts(applyFilters(products));
  });
  
  priceSlider.addEventListener('input', (e) => {
    const maxPrice = parseInt(e.target.value);
    filters.maxPrice = maxPrice;
    sliderValue.textContent = maxPrice;
    
    // Update max price input
    maxPriceInput.value = maxPrice;
    
    renderProducts(applyFilters(products));
  });
  
  sortSelect.addEventListener('change', (e) => {
    filters.sort = e.target.value;
    renderProducts(applyFilters(products));
  });
  
  clearFiltersBtn.addEventListener('click', () => {
    // Reset filters
    filters = {
      q: "",
      category: "ALL",
      minPrice: 0,
      maxPrice: 9999,
      sort: "NONE"
    };
    
    // Reset UI elements
    searchInput.value = '';
    categorySelect.value = 'ALL';
    minPriceInput.value = '';
    maxPriceInput.value = '';
    priceSlider.value = 1000;
    sliderValue.textContent = '1000';
    sortSelect.value = 'NONE';
    
    renderProducts(applyFilters(products));
    showNotification('Filters cleared');
  });
  
  // Cart event listeners
  clearCartBtn.addEventListener('click', clearCart);
  
  checkoutBtn.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) return;
    
    // Simulate checkout
    const totals = getTotals();
    alert(`Thank you for your order!\n\nTotal: $${totals.total.toFixed(2)}\n\nThis is a demo store, so no real transaction occurred.`);
  });
  
  // Event delegation for product grid
  productsGrid.addEventListener('click', (e) => {
    // Handle Add to Cart button clicks
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
      const addButton = e.target.classList.contains('add-to-cart') ? 
        e.target : e.target.closest('.add-to-cart');
      
      const productCard = addButton.closest('.product-card');
      const productId = parseInt(productCard.dataset.id);
      
      addToCart(productId);
    }
  });
  
  // Event delegation for cart items
  cartItems.addEventListener('click', (e) => {
    const cartItem = e.target.closest('.cart-item');
    if (!cartItem) return;
    
    const productId = parseInt(cartItem.dataset.id);
    
    // Handle quantity decrease
    if (e.target.classList.contains('dec-qty')) {
      decQty(productId);
    }
    
    // Handle quantity increase
    if (e.target.classList.contains('inc-qty')) {
      incQty(productId);
    }
    
    // Handle remove item
    if (e.target.classList.contains('remove-item')) {
      removeItem(productId);
    }
  });
}

// Helper function to show notifications
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  // Add styles for notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #2ecc71;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    max-width: 350px;
  `;
  
  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

