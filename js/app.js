function handleFileSelect(evt) {
    let file = evt.target.files[0];
    console.log(file.name);

    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                console.log("LOADED");
                let canvas = resizeImage(this, file);

                document.getElementById('preview').src = canvas;
            };

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

function resizeImage(img, file) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var MAX_WIDTH = 400;
    var MAX_HEIGHT = 400;
    var width = img.width;
    var height = img.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }

    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    dataurl = canvas.toDataURL(file.type);

    return dataurl;
}