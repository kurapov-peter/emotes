function handleFileSelect(evt) {
    let file = evt.target.files[0];
    console.log(file.name);

    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

}

function getCurrentPicture() {
    return null
}

document.getElementById('myFile').addEventListener('change', handleFileSelect, false);


function getAsciiPictureRepresentation(pic) {
    return undefined;
}

function drawTheResult(asciiText) {
    alert(asciiText)
}

function processRequest() {
    let pic = getCurrentPicture();
    let ascii = getAsciiPictureRepresentation(pic);
    drawTheResult(ascii)
}
