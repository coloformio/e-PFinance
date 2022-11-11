function setChartPreference() {
    var trendRadio = document.getElementById('trendChart');
    var categoryExpenses = document.getElementById('categoryExpenses');
    
    if(trendRadio.checked){
        window.localStorage.setItem('chart', 'trendChart');
    } else if(categoryExpenses.checked){
        window.localStorage.setItem('chart', 'categoryExpenses')
    }
}
