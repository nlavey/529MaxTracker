const form = document.getElementById("expenseForm");

const table = document.getElementById("expenseTable");

const total = document.getElementById("total");

const submitButton = document.getElementById("submitButton");

const sortOption = document.getElementById("sortOption");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let editingIndex = -1;

let receiptImage = "";

displayExpenses();

form.addEventListener("submit", function(event){

    event.preventDefault();

    const expense = {

        date: document.getElementById("date").value,

        category: document.getElementById("category").value,

        description: document.getElementById("description").value,

        amount: Number(document.getElementById("amount").value),

        receipt: receiptImage

    };

    const search = document.getElementById("search");

    const filterCategory = document.getElementById("filterCategory");

    search.addEventListener("input", displayExpenses);

    filterCategory.addEventListener(
        "change",
        displayExpenses
    );

    document.getElementById("receipt").addEventListener(
        "change",
        loadReceipt
    );

    if(editingIndex === -1){

        expenses.push(expense);

    }

    else{

        expenses[editingIndex] = expense;

        editingIndex = -1;

        submitButton.textContent = "Add Expense";

    }

    saveExpenses();

    form.reset();

    receiptImage = "";

    displayExpenses();

});

sortOption.addEventListener(
    "change",
    displayExpenses
);

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

function deleteExpense(index){

    expenses.splice(index,1);

    if(editingIndex === index){

        editingIndex = -1;

        form.reset();

        submitButton.textContent = "Add Expense";

    }

    saveExpenses();

    displayExpenses();

}

function saveExpenses(){

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}