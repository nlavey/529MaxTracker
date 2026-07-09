import { loadExpenses } from "./firestore.js";

export async function generateYearReport(uid, year){

    const expenses = await loadExpenses(uid);

    const yearlyExpenses = expenses.filter(expense=>{

        return expense.date.startsWith(year);

    });

    let qualified = 0;
    let nonQualified = 0;

    const categoryTotals = {};

    yearlyExpenses.forEach(expense=>{

        if(expense.qualified){

            qualified += Number(expense.amount);

        }else{

            nonQualified += Number(expense.amount);

        }

        if(!categoryTotals[expense.category]){

            categoryTotals[expense.category]=0;

        }

        categoryTotals[expense.category]+=Number(expense.amount);

    });

    return{

        yearlyExpenses,
        qualified,
        nonQualified,
        categoryTotals

    };

}