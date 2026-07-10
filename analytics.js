export {};

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

const DEFAULT_BUDGET = 10000;

export function calculateAnalytics(expenses, year = null){

    const analytics = {

        total: 0,

        qualified: 0,

        unqualified: 0,

        expenseCount: expenses.length,

        categoryTotals: {},

        monthlyTotals: Array(12).fill(0),

        budget: DEFAULT_BUDGET,

        budgetUsed: 0,

        budgetPercent: 0

    };

    for(const expense of expenses){

        const expenseYear =
            new Date(expense.date).getFullYear();

        if(year !== null && expenseYear != year){

            continue;

        }

        const amount = Number(expense.amount);

        analytics.total += amount;

        if(expense.qualified){

            analytics.qualified += amount;

        }

        else{

            analytics.unqualified += amount;

        }

        if(!analytics.categoryTotals[expense.category]){

            analytics.categoryTotals[expense.category] = 0;

        }

        analytics.categoryTotals[expense.category] += amount;

        const month = new Date(expense.date).getMonth();

        if(month >= 0){

            analytics.monthlyTotals[month] += amount;

        }

    }

    analytics.budgetUsed = analytics.total;

    analytics.budgetPercent =
        Math.min(
            (analytics.total / analytics.budget) * 100,
            100
        );

    return analytics;

}

export function getMonthlyChartData(analytics){

    return {

        labels: MONTHS,

        values: analytics.monthlyTotals

    };

}

export function getCategoryChartData(analytics){

    return{

        labels:Object.keys(
            analytics.categoryTotals
        ),

        values:Object.values(
            analytics.categoryTotals
        )

    };

}

export function getQualifiedChartData(analytics){

    return{

        labels:[
            "Qualified",
            "Unqualified"
        ],

        values:[
            analytics.qualified,
            analytics.unqualified
        ]

    };

}