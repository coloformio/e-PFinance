function divText() {
    var canvasDiv = document.getElementById('canvasDiv');
    var alreadyClick = document.getElementById('noSpese');

    if(!alreadyClick){
        canvasDiv.classList.add('text-center', 'align-middle');
        var textElem = document.createElement('h5');
        textElem.setAttribute('id', 'noSpese');
        textElem.innerText = 'Non sono presenti spese!'
        canvasDiv.appendChild(textElem);
    }
}