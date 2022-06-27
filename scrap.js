

const getCanvasPixelColor = require('get-canvas-pixel-color');

let canvas;
let dotCanvas;
let ctx;
let ctx2;
let output;
let dotCanvasData;

imageListener();

function imageListener() {
    let imgInput = document.getElementById('imageInput');
    imgInput.addEventListener('change', async function (e) {
        if (e.target.files) {
            let imageFile = e.target.files[0]; //here we get the image file
            var reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onloadend = function (e) {
                var caveImage = new Image(); // Creates image object
                caveImage.src = e.target.result; // Assigns converted image to image object
                caveImage.onload = function (ev) {
                    updateCanvas(caveImage);
                    updateDotCanvas(caveImage);
                    output = getPixelList();
                    console.log(output);
                    // fetchData(output)
                }
            }
        }
    })
}

function updateCanvas(img) {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = img.width;
    ctx.canvas.height = heightAdjustedImage(img.height);
    ctx.drawImage(img, 10, 10);
}

function updateDotCanvas(img) {
    dotCanvas = document.getElementById("dotCanvas");
    ctx2 = dotCanvas.getContext("2d");
    ctx2.canvas.width = img.width;
    ctx2.canvas.height = heightAdjustedImage(img.height);
    dotCanvasData = ctx2.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function heightAdjustedImage(height) {
    percentHeightNeededToRemoveCredit = 2;
    return height - height * (percentHeightNeededToRemoveCredit / 100);
}

async function fetchData(data){
    const body = data;
    const fetchOtions = fetchOptions(body);
    return fetch('http://localhost:3000/pixelData', fetchOtions);
}

function fetchOptions(body) {
    const header = {
        'Content-Type': 'application/json',
    };
    return {
        method: 'POST',
        headers: header,
        body: `${JSON.stringify({data: body})}`
    };
}

function getPixelList() {
    const pastExisted = false;
    let canvas = document.getElementById('dotCanvas');
    const output = [...Array(ctx.canvas.width).keys()].map(x => {
        return [...Array(ctx.canvas.height).keys()].map( y => {
            let output;
            const { r, g, b } = getCanvasPixelColor(canvas, x, y);
            const isFloor = r*g*b > 1 ? true : false;
            output = { x, y, build: isFloor};
            drawPixel(x, y, r, g, b, 255);
            return output;
        })
    })
    .flatMap(_ => _)
    .filter(coord => coord.build > 0)
    .map(coord => `${coord.x}, ${coord.y}, ${0}`);
    updateCanvas2();
    return output;
}

function drawPixel(x, y, r, g, b, a) {
    const index = (x + y * ctx2.canvas.width) * 4;
    dotCanvasData.data[index + 0] = r;
    dotCanvasData.data[index + 1] = g;
    dotCanvasData.data[index + 2] = b;
    dotCanvasData.data[index + 3] = a;
}

function updateCanvas2() {
    ctx2.putImageData(dotCanvasData, 0, 0);
}

// const isFloor = r*g*b > 1 ? true : false;
// if ( isFloor == true && pastExisted == false){
//     pastExisted = true;
//     output = { x, y, build: true};
// } else if ( isFloor == true && pastExisted == true) {
//     pastExisted = true;
//     output = { x, y, build: false};
// } else if ( isFloor == false && pastExisted == true) {
//     pastExisted = false;
//     output = { x, y, build: false};
// } else {
//     output = { x, y, build: false};
// }