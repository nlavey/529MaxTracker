const form = document.getElementById("expenseForm");

const table = document.getElementById("expenseTable");

const total = document.getElementById("total");

const submitButton = document.getElementById("submitButton");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let editingIndex = -1;

displayExpenses();

form.addEventListener("submit", function(event){

    event.preventDefault();

    const expense = {

        date: document.getElementById("date").value,

        category: document.getElementById("category").value,

        description: document.getElementById("description").value,

        amount: Number(document.getElementById("amount").value)

    };

    const search = document.getElementById("search");

    const filterCategory = document.getElementById("filterCategory");

    search.addEventListener("input", displayExpenses);

    filterCategory.addEventListener(
        "change",
        displayExpenses
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

    displayExpenses();

});

function displayExpenses(){

    table.innerHTML = "";

    let sum = 0;

    const searchText =
    search.value.toLowerCase();

    const selectedCategory =
    filterCategory.value;

    for(let i = 0; i < expenses.length; i++){

        const expense = expenses[i];

        const matchesSearch =
        expense.description
        .toLowerCase()
        .includes(searchText);

        const matchesCategory =

        selectedCategory === "All" ||

        expense.category === selectedCategory;

        if(matchesSearch && matchesCategory){

            sum += expense.amount;

            table.innerHTML += `

            <tr>

                <td>${expense.date}</td>

                <td>${expense.category}</td>

                <td>${expense.description}</td>

                <td>$${expense.amount.toFixed(2)}</td>

                <td>

                    <button onclick="editExpense(${i})">

                        Edit

                    </button>

                    <button onclick="deleteExpense(${i})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        }

    }

    total.textContent =
    "$" + sum.toFixed(2);

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