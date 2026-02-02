const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const btnInput = document.getElementById("btn");
const totalEl = document.getElementById("total");
const list = document.getElementById("list");

let expenses = [];

btnInput.addEventListener("click", addExpense);

function addExpense() {
  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);

  if (!name || !amount) return;

  expenses.push({
    id: Date.now(),
    name,
    amount
  });

  render();
  saveToLocalStorage();

  nameInput.value = "";
  amountInput.value = "";
}

function render() {
  list.innerHTML = "";
  let total = 0;

  expenses.forEach((exp) => {
    total += exp.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      ${exp.name} - ₹${exp.amount}
      <button onclick="deleteExpense(${exp.id})">X</button>
    `;
    list.appendChild(li);
  });

  totalEl.textContent = total;
}

function deleteExpense(id) {
  expenses = expenses.filter((exp) => exp.id !== id);
  render();
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("expenses");
  if (data) expenses = JSON.parse(data);
  render();
}

loadFromLocalStorage();
