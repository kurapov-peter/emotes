let gCanvas = undefined;
let step = 4;

symbols = ['\u28ff', '\u283f', '\u286a', '\u2805', '\u2802'];

// for(var i=32;i<2379;++i) console.log(String.fromCharCode(i));


// function unicodeToChar(text) {
//     return text.replace(/\\u[\dA-F]{4}/gi,
//         function (match) {
//             return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
//         });
// }


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
    let imgData = getCurrentPictureData();
    //makeItGray(imgData);

    let res = prepareText(imgData);
    // let matr = getMatrixFromImageData(imgData);

    let text = generateTextImage(res);
    printResultToTextArea(text);

    // Just print stuff for fun
    makeItBlackAndWhite(imgData);
    gCanvas.getContext("2d").putImageData(imgData, 0, 0);

    document.getElementById('preview2').src = gCanvas.toDataURL();
    // document.getElementById('output').innerHTML = text


    // let ascii = getAsciiPictureRepresentation(pic);
    // drawTheResult(ascii)
}

function getCurrentPictureData() {
    var ctx = gCanvas.getContext("2d");
    return ctx.getImageData(0, 0, gCanvas.width, gCanvas.height)
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


function generateTextImage(dataArray) {
    let text = [];
    let mult = [];
    for (let i = 0; i < dataArray.length; i += 1) {
        let tmp = [];
        for (let j = 0; j < dataArray[i].length; j += 1) {
            text.push(symbols[dataArray[i][j]]);
            tmp.push(symbols[dataArray[i][j]]);
        }
        mult.push(tmp)
    }

    console.log(mult);
    console.log(text);
    return text.join("")
}


function getMatrixFromImageData(imgData) {
    // let res = Array.matrix(50, 50, 0);
    // let res = new Array(5).fill(0).map(() => new Array(4).fill(0));
    console.log(imgData.width, imgData.height);
    let res = new Array(400*400).fill(0);
    // matrix [i][j] -> arr [ i*m + j ]

    for (let i = 0, j = 0; i < imgData.data.length; i += 4, j += 1) {
        // console.log(j, Math.floor(j / 50), j % 50);
        res[j] = (19595*imgData.data[i] + 38470*imgData.data[i + 1] + 7471*imgData.data[i + 2] + 1<<15) >> 24;
    }

    return res
}

function printResultToTextArea(str) {
    document.getElementById("pictext").value = str
}


function superTextTransform(imageData) {

}

function prepareText(imageData) {

    //console.log(imageData.data[0] + "+++++++++" + imageData.data[1] + "+++++++++" + imageData.data[2] + "+++++++++" + imageData.data[3]);

    let max = 3 * step * step * 255;
    let part = max / 4;
    let result = [];

    let row = 0;

    for (let i = 0; i < imageData.height; i += step) {
        let line = [];
        let column = 0;
        for(let m = 0; m < imageData.width * 4; m += step * 4) {
            let sum = 0;
            for (let j = 0; j < step; j++) {
                for (let k = 0; k < step * 4; k += 4) {
                    for (let p = 0; p < 3; p++) {
                        //console.log(i * imageData.width + m + j * imageData.width * 4 + k + p);
                        sum += imageData.data[i * imageData.width * 4 + m + j * imageData.width * 4 + k + p];
                    }
                }
            }
            line[column] = Math.floor(sum / part);
            column++;
            // console.log(sum);
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

function makeItGrayFast(imgData) {
    for (let i = 0; i < imgData.data.length; i += 4) {
        // console.log(j, Math.floor(j / 50), j % 50);
        let luma = (19595*imgData.data[i] + 38470*imgData.data[i + 1] + 7471*imgData.data[i + 2] + 1<<15) >> 24;
        imgData.data[i] = imgData.data[i+1] = imgData[i+2] = luma;
        image.data[i+3] = 255;
    }
}

function makeItBlackAndWhite(imageData) {
    let threshold = 125;
    for (let i = 0; i < imageData.data.length; i+=4) {
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = imageData.data[i] > threshold ? 255 : 0;
    }
}


function resizeImage(img, file) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    console.log('before:');
    console.log(canvas.width, canvas.height);
    console.log(img.width, img.height);

    let MAX_WIDTH = 256;
    // let MAX_HEIGHT = 256;
    let width = img.width;
    let height = img.height;

    height *= MAX_WIDTH / width;
    width = MAX_WIDTH;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    console.log('after:');
    console.log(canvas.width, canvas.height);
    console.log(img.width, img.height);

    return canvas;
}