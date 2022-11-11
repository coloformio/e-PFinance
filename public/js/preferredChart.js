async function preferredChart() {
    var chart = window.localStorage.getItem('chart');
    if(chart == 'trendChart'){
        await trendChart();
    }
    else if(chart == 'categoryExpenses'){
        await categoryExpenses();
    }
}

window.onload = (e) => {
    preferredChart();
}