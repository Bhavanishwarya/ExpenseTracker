const form = document.getElementById("expense-form");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");
const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");
const exportBtn = document.getElementById("export-csv");
const themeToggle = document.getElementById("toggle-theme");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function renderExpenses() {
  expenseList.innerHTML = "";
  let total = 0;

  expenses.forEach((expense, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.category}</td>
      <td>₹${expense.amount.toFixed(2)}</td>
      <td>${expense.note}</td>
      <td><button class="delete-btn" onclick="deleteExpense(${index})">X</button></td>
    `;
    expenseList.appendChild(row);
    total += expense.amount;
  });

  totalDisplay.textContent = total.toFixed(2);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  renderExpenses();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const category = categoryInput.value;
  const amount = parseFloat(amountInput.value);
  const note = noteInput.value;

  if (!category || isNaN(amount)) return;

  expenses.push({ category, amount, note });
  categoryInput.value = "";
  amountInput.value = "";
  noteInput.value = "";
  renderExpenses();
});

exportBtn.addEventListener("click", () => {
  const csv = "Category,Amount,Note\n" +
    expenses.map(e => `${e.category},${e.amount},${e.note}`).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderExpenses();
