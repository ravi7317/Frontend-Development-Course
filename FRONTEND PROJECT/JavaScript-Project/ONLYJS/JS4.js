const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");


emailInput.addEventListener("input", () => {
  if (emailInput.value.includes("@")) {
    message.textContent = "Valid email";
    message.className = "success";
  } else {
    message.textContent = "Invalid email";
    message.className = "error";
  }
});


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    message.textContent = "All fields required";
    message.className = "error";
    return;
  }

  if (email === "admin@gmail.com" && password === "1234") {
    message.textContent = "Login successful";
    message.className = "success";
  } else {
    message.textContent = "Invalid credentials";
    message.className = "error";
  }
});
