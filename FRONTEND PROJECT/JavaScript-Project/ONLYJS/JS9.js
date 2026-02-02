const user = {
    id: 101,
    name: "Ravi",
    isLoggedIn: false,
    cart: []
};

function login(){
    user.isLoggedIn = true;
    localStorage.setItem("user" ,JSON.stringify(user));
    updateUI();
}

function logout(){
    localStorage.removeItem("user");
    updateUI();
}

function setTheam(){
    localStorage.setItem("theme", theme);
    applyTheme();
}

function applyTheme(){
    const theme = localStorage.getItem("theme");
    document.body.className = theme ==="dark" ? "dark" : "";
}

function addToCart() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    alert("Please login first");
    return;
  }

  storedUser.cart.push({
    id: Date.now(),
    name: "Product",
    price: 500
  });

  localStorage.setItem("user", JSON.stringify(storedUser));
  updateUI();
}

function clearCart() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) return;

  storedUser.cart = [];
  localStorage.setItem("user", JSON.stringify(storedUser));
  updateUI();
}


function updateUI() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  document.getElementById("loginStatus").innerText =
    storedUser?.isLoggedIn
      ? `Logged in as ${storedUser.name}`
      : "User Logged Out";

  document.getElementById("cartInfo").innerText =
    storedUser
      ? `Cart Items: ${storedUser.cart.length}`
      : "Cart is empty";

  applyTheme();
}


updateUI();

