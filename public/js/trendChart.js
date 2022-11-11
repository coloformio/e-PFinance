async function trendChart() {
    toggleDiv();
    deleteGraph();
    deleteText();

    const op = await getData();
    var tot = 0;
    var ax = [];
    ax.push('Registrazione');
    var ay = [];
    ay.push(0);

    for(i = 0; i < op.length; i++){

        if(op[i].type == 'in'){
            tot = Number(tot) + Number(op[i].amount);
        } else if(op[i].type == 'out'){
            tot = Number (tot) - Number(op[i].amount);
        }

        var savedDate = new Date(op[i].dateOp);
        correctMonth = Number(savedDate.getMonth()) + 1;
        formattedData = savedDate.getDate() + '/' + correctMonth + '/' + savedDate.getFullYear();

        ax.push(formattedData);
        ay.push(Number(tot)); 
    }

    const ctx = document.getElementById('chart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'line',
            data: {
                labels: ax,
                datasets: [{
                    label: 'Andamento Bilancio',
                    data: ay,
                    borderColor: 'rgb(18, 234, 234)',
                    tension: 0.1
                }] 
            }
    });
}