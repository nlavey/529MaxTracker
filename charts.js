export {};

import {
    calculateAnalytics,
    getMonthlyChartData,
    getCategoryChartData,
    getQualifiedChartData
} from "./analytics.js";

let monthlyChart = null;
let categoryChart = null;
let qualifiedChart = null;

export function updateCharts(expenses, year = null){

    if (expenses.length === 0) {

        if (monthlyChart) {
            monthlyChart.destroy();
            monthlyChart = null;
        }

        if (categoryChart) {
            categoryChart.destroy();
            categoryChart = null;
        }

        if (qualifiedChart) {
            qualifiedChart.destroy();
            qualifiedChart = null;
        }

        return;
    }

    const analytics =
        calculateAnalytics(expenses, year);

    drawMonthlyChart(
        getMonthlyChartData(analytics)
    );

    drawCategoryChart(
        getCategoryChartData(analytics)
    );

    drawQualifiedChart(
        getQualifiedChartData(analytics)
    );

}

function drawMonthlyChart(data){

    const ctx =
        document
        .getElementById("monthlyChart");

    if(monthlyChart){

        monthlyChart.destroy();

    }

    monthlyChart = new Chart(ctx,{

        type:"line",

        data:{

            labels:data.labels,

            datasets:[{

                label:"Monthly Spending",

                data:data.values,

                borderWidth:3,

                tension:.35,

                fill:true,

                pointRadius:5,

                pointHoverRadius:8

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            animation:{

                duration:900

            },

            plugins:{

                tooltip:{

                    callbacks:{

                        label:function(context){

                            return "$" +
                                context.raw.toFixed(2);

                        }

                    }

                }

            }

        }

    });

}

function drawCategoryChart(data){

    const ctx =
        document
        .getElementById("categoryChart");

    if(categoryChart){

        categoryChart.destroy();

    }

    categoryChart = new Chart(ctx,{

        type:"pie",

        data:{

            labels:data.labels,

            datasets:[{

                data:data.values,

                hoverOffset:18

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            animation:{

                duration:900

            },

            plugins:{

                tooltip:{

                    callbacks:{

                        label:function(context){

                            return "$" +
                                context.raw.toFixed(2);

                        }

                    }

                }

            }

        }

    });

}

function drawQualifiedChart(data){

    const ctx =
        document
        .getElementById("qualifiedChart");

    if(qualifiedChart){

        qualifiedChart.destroy();

    }

    qualifiedChart = new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:data.labels,

            datasets:[{

                data:data.values,

                cutout:"65%",

                hoverOffset:20

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            animation:{

                duration:900

            },

            plugins:{

                tooltip:{

                    callbacks:{

                        label:function(context){

                            return "$" +
                                context.raw.toFixed(2);

                        }

                    }

                }

            }

        }

    });

}