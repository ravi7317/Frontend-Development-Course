// DOM Elements
const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("loginbtn");
const logoutBtn = document.getElementById("logoutbtn");
const userNameSpan = document.getElementById("usernamespan");
const error = document.getElementById("error");

// Dummy user (for learning)
const USER = {
    username: "admin",
    password: "1234"
};

// Check session on page load
window.onload = function () {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
        showDashboard(JSON.parse(storedUser));
    }
};

// Login logic
loginBtn.addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        error.textContent = "All fields are required";
        return;
    }

    if (username === USER.username && password === USER.password) {
        localStorage.setItem("user", JSON.stringify({ username }));
        showDashboard({ username });
        error.textContent = "";
    } else {
        error.textContent = "Invalid username or password";
    }
});

// Show dashboard
function showDashboard(user) {
    loginBox.classList.add("hidden");
    dashboard.classList.remove("hidden");
    userNameSpan.textContent = user.username;
}

// Logout logic
logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("user");
    location.reload();
});
