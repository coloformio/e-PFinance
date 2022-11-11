function deleteGraph() {
    if(window.myChart instanceof Chart){
        window.myChart.destroy();
    }
}