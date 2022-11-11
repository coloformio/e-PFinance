async function categoryExpenses() {
    toggleDiv();
    deleteGraph();

    const op = await getData();

    let tot = 0;
    let ciboTot = 0;
    let affittoTot = 0;
    let hobbyTot = 0;
    let usciteTot = 0;
    let saluteTot = 0;
    let finanziamentoTot = 0;
    let altroTot = 0;

    for(i = 0; i < op.length; i++){

        if(op[i].type == 'out'){
            tot = Number(tot) + Number(op[i].amount);
        } else {
            tot = tot;
        }

        switch(op[i].category) {
            case 'Cibo':
                ciboTot = ciboTot + op[i].amount;
                break;
            case 'Affitto':
                affittoTot = affittoTot + op[i].amount;
                break;
            case 'Hobby':
                hobbyTot = hobbyTot + op[i].amount;
                break;
            case 'Uscite Serali':
                usciteTot = usciteTot + op[i].amount;
                break;
            case 'Salute':
                saluteTot = saluteTot + op[i].amount;
                break;
            case 'Finanziamenti':
                finanziamentoTot = finanziamentoTot + op[i].amount;
                break;
            case 'Altro':
                altroTot = altroTot + op[i].amount;
                break;
            default: 
                break;
        }
    }

    var ax = [];
    ax.push(ciboTot/tot);
    ax.push(affittoTot/tot);
    ax.push(hobbyTot/tot);
    ax.push(usciteTot/tot);
    ax.push(saluteTot/tot);
    ax.push(finanziamentoTot/tot);
    ax.push(altroTot/tot);

    var isFree = false;

    ax.forEach(item => {
        if(isNaN(item)){
            isFree = true;
        }
    });

    if(isFree){

        divText();

    } else {
        const ctx = document.getElementById('chart').getContext('2d');
        window.myChart = new Chart(ctx, {
            type: 'doughnut',
                data: {
                    labels: ['Cibo', 'Affitto','Hobby', 'Uscite Serali', 'Salute', 'Finanziamenti', 'Altro'],
                    datasets: [{
                        label: 'Categorizzazione Spese',
                        data: ax,
                        backgroundColor: [
                            'rgb(38, 84, 124)',
                            'rgb(239, 71, 111)',
                            'rgb(255, 209, 102)',
                            'rgb(6, 214, 160)',
                            'rgb(18, 234, 234)',
                            'rgb(142, 157, 204)',
                            'rgb(238, 155, 0)',
                        ]
                    }] 
                }
        });
    }
}
