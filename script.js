const form = document.getElementById("expenseForm");

const table = document.getElementById("expenseTable");

const total = document.getElementById("total");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

displayExpenses();

form.addEventListener("submit", function(event){

    event.preventDefault();

    const expense = {

        date: document.getElementById("date").value,

        category: document.getElementById("category").value,

        description: document.getElementById("description").value,

        amount: Number(document.getElementById("amount").value)

    };

    expenses.push(expense);

    saveExpenses();

    form.reset();

    displayExpenses();

});

function displayExpenses(){

    table.innerHTML = "";

    let sum = 0;

    for(let i = 0; i < expenses.length; i++){

        sum += expenses[i].amount;

        table.innerHTML += `
        <tr>

            <td>${expenses[i].date}</td>

            <td>${expenses[i].category}</td>

            <td>${expenses[i].description}</td>

            <td>$${expenses[i].amount.toFixed(2)}</td>

            <td>
                <button onclick="deleteExpense(${i})">
                X
                </button>
            </td>

        </tr>
        `;

    }

    total.textContent = "$" + sum.toFixed(2);

}

function deleteExpense(index){

    expenses.splice(index,1);

    saveExpenses();

    displayExpenses();

}

function saveExpenses(){

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

}