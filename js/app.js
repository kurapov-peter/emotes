let gCanvas = undefined;


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
                gCanvas = resizeImage(this, file);

                document.getElementById('preview').src = gCanvas.toDataURL(file.type);
            };

        };
        reader.readAsDataURL(file);
    }

}


document.getElementById('myFile').addEventListener('change', handleFileSelect, false);


function processRequest() {
    // var img = document.getElementById("preview");
    // console.log(img);
    // var canvas = document.createElement("canvas");
    // var ctx = canvas.getContext("2d");
    // ctx.drawImage(img, 0, 0);
    //
    // console.log(ctx);
    //
    // let imgData = ctx.getImageData(0, 0, img.width, img.height);
    // console.log(imgData);
    //
    // document.getElementById('preview2').src = canvas.toDataURL();

    var ctx = gCanvas.getContext("2d");
    console.log(ctx);
    let imgData = ctx.getImageData(0, 0, gCanvas.width, gCanvas.height);

    makeItGray(imgData);

    console.log(imgData);

    prepareText(imgData);

    ctx.putImageData(imgData, 0, 0);

    document.getElementById('preview2').src = gCanvas.toDataURL();


    // let pic = getCurrentPicture();
    // let ascii = getAsciiPictureRepresentation(pic);
    // drawTheResult(ascii)
}


function prepareText(imageData) {
    let max = 8 * 8 * 255;
    let part = max / 4;
    let result = [];

    for (let i = 0; i < imageData.height; i += 8) {
        let line = [];
        let column = 0;
        let row = 0;
        for(let m = 0; m < imageData.width; m += 8) {
            let sum = 0;
            for (let j = 0; j < 8; j++) {
                for (let k = 0; k < 8; k++) {
                    //console.log(i * 8 * imageData.width + m + j * imageData.width + k);
                    sum += imageData.data[i * 8 * imageData.width + m + j * imageData.width + k];
                }
            }
            line[column] = sum % part;
            console.log(line[column]);
        }
        result[row] = line;
        row++;
    }

    console.log(result);

    /*for (let i = 0; i < imageData.height; i += 8) {
        let line = [];
        let column = 0;
        let row = 0;
        for (let j = 0; j < imageData.width; j += 8) {
            let sum = 0;
            for (let k = 0; k < 8; k ++) {
                for (let l = 0; l < 8; l++) {
                    sum += imageData[i + k][j + l];
                }
            }
            line[column] = sum % part;
            console.log(line[column]);
        }
        result[row] = line;
        row++;
    }*/
}

function makeItGray(imageData) {
    for (let i = 0; i < imageData.data.length; i+=4) {
        var luma = Math.floor(imageData.data[i] * 0.3 +
            imageData.data[i+1] * 0.59 +
            imageData.data[i+2] * 0.11);
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = luma;
        imageData.data[i+3] = 255;
    }
}

function getCurrentPicture() {
    let img = document.getElementById("preview");
    console.log(img);
    return img
}

function getAsciiPictureRepresentation(pic) {
    var ctx = pic.getContext("2d");
    let imgData = ctx.getImageData(0, 0, pic.width, pic.height);
    console.log(imgData);
    return undefined;
}

function drawTheResult(asciiText) {
    alert(asciiText)
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

    // dataurl = canvas.toDataURL(file.type);

    return canvas;
}