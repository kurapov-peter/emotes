let gCanvas = undefined;

symbols = ['.', ':', '#', String.fromCharCode(9607)];


Array.matrix = function(numrows, numcols, initial) {
    let arr = [];
    for (let i = 0; i < numrows; ++i) {
        let columns = [];
        for (let j = 0; j < numcols; ++j) {
            columns[j] = 0;
        }
        arr[i] = columns;
    }
    return arr;
};


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
    var ctx = gCanvas.getContext("2d");
    console.log(ctx);
    let imgData = ctx.getImageData(0, 0, gCanvas.width, gCanvas.height);

    makeItGray(imgData);

    console.log(imgData);

    res = prepareText(imgData);

    ctx.putImageData(imgData, 0, 0);

    document.getElementById('preview2').src = gCanvas.toDataURL();

    let matr = getMatrixFromImageData(imgData);
    console.log(matr);

    let text = generateTextImage(res);
    printResultToTextArea(text);

    // let pic = getCurrentPicture();
    // let ascii = getAsciiPictureRepresentation(pic);
    // drawTheResult(ascii)
}


function generateTextImage(dataArray) {
    let text = [];
    for (let i = 0; i < dataArray.length; i += 1) {
        for (let j = 0; j < dataArray[i].length; j += 1) {
            text.push(symbols[dataArray[i][j]])
        }
    }

    console.log(text);
    return text.join("")
}


function getMatrixFromImageData(imgData) {
    // let res = Array.matrix(50, 50, 0);
    // let res = new Array(5).fill(0).map(() => new Array(4).fill(0));
    let res = new Array(400*400).fill(0);
    // matrix [i][j] -> arr [ i*m + j ]

    for (let i = 0, j = 0; i < imgData.data.length; i += 4, j += 1) {
        // console.log(j, Math.floor(j / 50), j % 50);
        res[j] =
            imgData.data[i] +
            imgData.data[i + 1] +
            imgData.data[i + 2] +
            imgData.data[i + 3]
    }

    return res
}

function printResultToTextArea(str) {
    document.getElementById("pictext").value = str
}

function prepareText(imageData) {

    //console.log(imageData.data[0] + "+++++++++" + imageData.data[1] + "+++++++++" + imageData.data[2] + "+++++++++" + imageData.data[3]);

    let max = 3 * 8 * 8 * 255;
    let part = max / 4;
    let result = [];

    let row = 0;

    for (let i = 0; i < imageData.height; i += 8) {
        let line = [];
        let column = 0;
        for(let m = 0; m < imageData.width * 4; m += 32) {
            let sum = 0;
            for (let j = 0; j < 8; j++) {
                for (let k = 0; k < 32; k += 4) {
                    for (let p = 0; p < 3; p++) {
                        //console.log(i * imageData.width + m + j * imageData.width * 4 + k + p);
                        sum += imageData.data[i * imageData.width * 4 + m + j * imageData.width * 4 + k + p];
                    }
                }
            }
            line[column] = Math.floor(sum / part);
            column++;
            console.log(sum);
        }
        result[row] = line;
        row++;
    }

    console.log(result);

    return result;
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