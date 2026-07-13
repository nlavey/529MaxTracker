import {
    saveExpense,
    loadExpenses,
    deleteExpense as deleteExpenseFirestore,
    updateExpense
} from "./firestore.js";

import {
    auth,
    onAuthStateChanged
} from "./firebase.js";

import {
    calculateAnalytics
} from "./analytics.js";

import {
    updateCharts
} from "./charts.js";

import {
    getAnnualBudget,
    setAnnualBudget
} from "./analytics.js";

import { generateYearReport } from "./reports.js";

const form = document.getElementById("expenseForm");

const table = document.getElementById("expenseTable");

const yearSelect = document.getElementById("reportYear");

yearSelect.addEventListener("change", () => {

    const selectedYear =
        Number(yearSelect.value);

    updateDashboard(selectedYear);

});

const currentYear = new Date().getFullYear();

for(let year=currentYear; year>=2020; year--){

    const option=document.createElement("option");

    option.value=year;

    option.textContent=year;

    yearSelect.appendChild(option);

}

const total = document.getElementById("total");

const submitButton = document.getElementById("submitButton");

const sortOption = document.getElementById("sortOption");

const search = document.getElementById("search");

const filterCategory = document.getElementById("filterCategory");

const receiptInput = document.getElementById("receipt");

let expenses = [];

let editingIndex = -1;

let receiptImage = "";

let currentUser = null;

search.addEventListener("input", displayExpenses);

filterCategory.addEventListener("change", displayExpenses);

receiptInput.addEventListener("change", loadReceipt);

sortOption.addEventListener("change", displayExpenses);

onAuthStateChanged(auth, async (user) => {

    currentUser = user;

    if(user){

        expenses = await loadExpenses();

        displayExpenses();
        updateDashboard();

    }

    else{

        expenses = [];

        displayExpenses();
        updateDashboard();

    }

});

form.addEventListener("submit", async function(event){

    event.preventDefault();

    const expense = {

        date: document.getElementById("date").value,

        category: document.getElementById("category").value,

        description: document.getElementById("description").value,

        amount: Number(document.getElementById("amount").value),

        qualified: document.getElementById("qualified").checked,

        receipt: receiptImage

    };

    if(editingIndex === -1){

        await saveExpense(expense);

    }

    else{

    await updateExpense(

        expenses[editingIndex].id,

        expense

    );

    editingIndex = -1;

    submitButton.textContent = "Add Expense";

}

    form.reset();

    receiptImage = "";

    expenses = await loadExpenses();

    displayExpenses();
    updateDashboard();

});

document.getElementById("generateReport")
.addEventListener("click", async () => {

    if (!currentUser) return;

    const report = await generateYearReport(
        currentUser.uid,
        yearSelect.value
    );

    displayReport(report);

});

const budgetInput =
    document.getElementById("annualBudget");

const saveBudgetBtn =
    document.getElementById("saveBudget");

budgetInput.value = getAnnualBudget();

saveBudgetBtn.addEventListener("click", () => {

    const newBudget = Number(budgetInput.value);

    if (Number.isNaN(newBudget)) return;

    setAnnualBudget(newBudget);
    budgetInput.value = getAnnualBudget();

    const selectedYear = yearSelect.value
        ? Number(yearSelect.value)
        : null;

    updateDashboard(selectedYear);

});

document.getElementById("downloadCSV")
.addEventListener("click", async () => {

    if (!currentUser) return;

    const report = await generateYearReport(
        currentUser.uid,
        yearSelect.value
    );

    exportCSV(report);

});

function displayExpenses(){

    table.innerHTML = "";

    let sum = 0;

    const searchText =
    search.value.toLowerCase();

    const selectedCategory =
    filterCategory.value;

    let filteredExpenses = [...expenses];

    filteredExpenses = filteredExpenses.filter(function(expense){

        const matchesSearch =
        expense.description
        .toLowerCase()
        .includes(searchText);

        const matchesCategory =

        selectedCategory === "All"

        ||

        expense.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    switch(sortOption.value){

        case "dateNewest":

            filteredExpenses.sort(function(a,b){

                return new Date(b.date) - new Date(a.date);

            });

            break;

        case "dateOldest":

            filteredExpenses.sort(function(a,b){

                return new Date(a.date) - new Date(b.date);

            });

            break;

        case "amountHigh":

            filteredExpenses.sort(function(a,b){

                return b.amount-a.amount;

            });

            break;

        case "amountLow":

            filteredExpenses.sort(function(a,b){

                return a.amount-b.amount;

            });

            break;

    }

    for(const expense of filteredExpenses){

        sum += expense.amount;

        const originalIndex = expenses.indexOf(expense);

        table.innerHTML += `

        <tr>

            <td>${expense.date}</td>

            <td>${expense.category}</td>

            <td>${expense.description}</td>

            <td>$${expense.amount.toFixed(2)}</td>

            <td>
                ${expense.qualified ? "✅ Qualified" : "❌ Unqualified"}
            </td>

            <td>

            ${expense.receipt ?

            
            `<button class="receipt-link" onclick="viewReceipt(${originalIndex})">🧾</button>`

            :

            ""

            }

            </td>

            <td>

            <button onclick="editExpense(${originalIndex})">

            Edit

            </button>

            <button onclick="deleteExpense(${originalIndex})">

            Delete

            </button>

            </td>

        </tr>

        `;

    }

    total.textContent =
    "$" + sum.toFixed(2);

}

function updateDashboard(year = null){

    const analytics =
        calculateAnalytics(expenses, year);

    document.getElementById("totalSpending")
        .textContent =
        "$" + analytics.total.toFixed(2);

    document.getElementById("qualifiedTotal")
        .textContent =
        "$" + analytics.qualified.toFixed(2);

    document.getElementById("unqualifiedTotal")
        .textContent =
        "$" + analytics.unqualified.toFixed(2);

    document.getElementById("expenseCount")
        .textContent =
        analytics.expenseCount;

    document.getElementById("budgetText")
        .textContent =
        "$" +
        analytics.total.toFixed(2)
        +
        " / $"
        +
        analytics.budget.toLocaleString();

    const progress =
    document.getElementById("budgetProgress");

    progress.value =
        analytics.budgetPercent;

    if (analytics.budgetPercent >= 90) {

        progress.className = "danger";

    }
    else if (analytics.budgetPercent >= 75) {

        progress.className = "warning";

    }
    else {

        progress.className = "good";

    }

    updateCharts(expenses, year);

}

function viewReceipt(index) {
    const win = window.open("", "_blank");
    win.document.write(`<img src="${expenses[index].receipt}" style="max-width:100%">`);
}

function loadReceipt(event){

    const file = event.target.files[0];

    if(!file){

        receiptImage = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = function(){

        receiptImage = reader.result;

    };

    reader.readAsDataURL(file);

}

function editExpense(index){

    document.getElementById("date").value =
    expenses[index].date;

    document.getElementById("category").value =
    expenses[index].category;

    document.getElementById("description").value =
    expenses[index].description;

    document.getElementById("amount").value =
    expenses[index].amount;

    document.getElementById("qualified").checked =
    expenses[index].qualified;

    receiptImage =
    expenses[index].receipt;

    editingIndex = index;

    submitButton.textContent = "Save Changes";

}

async function deleteExpense(index){

    await deleteExpenseFirestore(

        expenses[index].id

    );

    if(editingIndex === index){

        editingIndex = -1;

        form.reset();

        submitButton.textContent = "Add Expense";

    }

    expenses = await loadExpenses();

    displayExpenses();
    updateDashboard();

}

function displayReport(report){

    const output=document.getElementById("reportOutput");

    let html="";

    html+=`
    <h3>Year Summary</h3>

    <p>
    Qualified Expenses:
    $${report.qualified.toFixed(2)}
    </p>

    <p>
    Non-Qualified Expenses:
    $${report.nonQualified.toFixed(2)}
    </p>

    <p>
    Total:
    $${(report.qualified+report.nonQualified).toFixed(2)}
    </p>

    <h3>Category Totals</h3>
    `;

    html+="<ul>";

    for(const category in report.categoryTotals){

        html+=`
        <li>
        ${category}
        :
        $${report.categoryTotals[category].toFixed(2)}
        </li>
        `;

    }

    html+="</ul>";

    output.innerHTML=html;

}

function exportCSV(report){

    let csv="Category,Total\n";

    for(const category in report.categoryTotals){

        csv+=`${category},${report.categoryTotals[category]}\n`;

    }

    csv+=`\n`;

    csv+=`Qualified,${report.qualified}\n`;

    csv+=`Non Qualified,${report.nonQualified}\n`;

    csv+=`Overall,${report.qualified+report.nonQualified}`;

    const blob=new Blob([csv],{

        type:"text/csv"

    });

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="529-report.csv";

    a.click();

}

window.editExpense = editExpense;
window.deleteExpense = deleteExpense;
window.viewReceipt = viewReceipt;