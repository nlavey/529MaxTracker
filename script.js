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

const form = document.getElementById("expenseForm");

const table = document.getElementById("expenseTable");

const total = document.getElementById("total");

const submitButton = document.getElementById("submitButton");

const sortOption = document.getElementById("sortOption");

const search = document.getElementById("search");

const filterCategory = document.getElementById("filterCategory");

const receiptInput = document.getElementById("receipt");

let expenses = [];

let editingIndex = -1;

let receiptImage = "";

search.addEventListener("input", displayExpenses);

filterCategory.addEventListener("change", displayExpenses);

receiptInput.addEventListener("change", loadReceipt);

sortOption.addEventListener("change", displayExpenses);

onAuthStateChanged(auth, async (user) => {

    if(user){

        expenses = await loadExpenses();

        displayExpenses();

    }

    else{

        expenses = [];

        displayExpenses();

    }

});

form.addEventListener("submit", async function(event){

    event.preventDefault();

    const expense = {

        date: document.getElementById("date").value,

        category: document.getElementById("category").value,

        description: document.getElementById("description").value,

        amount: Number(document.getElementById("amount").value),

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

}

window.editExpense = editExpense;
window.deleteExpense = deleteExpense;
window.viewReceipt = viewReceipt;