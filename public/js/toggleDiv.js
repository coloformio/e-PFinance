function toggleDiv() {
    const canvasDiv = document.getElementById('canvasDiv');

    if(canvasDiv.classList.contains('d-none')){
        canvasDiv.classList.remove('d-none');
    }
}