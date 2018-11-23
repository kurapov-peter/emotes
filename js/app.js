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

    ctx.putImageData(imgData, 0, 0);

    document.getElementById('preview2').src = gCanvas.toDataURL();


    // let pic = getCurrentPicture();
    // let ascii = getAsciiPictureRepresentation(pic);
    // drawTheResult(ascii)
}


function makeItGray(imageData) {
    let threshold = 200;
    for (let i = 0; i < imageData.data.length; i+=4) {
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = imageData.data[i] > threshold ? 255 : 0;
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