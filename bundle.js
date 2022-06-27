(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


const getCanvasPixelColor = require('get-canvas-pixel-color');

// let canvas;
// let ctx; 
// let output;

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
                    fetchData(output)
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
    let canvas = document.querySelector('canvas');
    let pastExisted = false;
    const result = [...Array(ctx.canvas.width).keys()].map(x => {
        return [...Array(ctx.canvas.height).keys()].map( y => {
            const { r, g, b } = getCanvasPixelColor(canvas, x, y);
            const isFloor = r*g*b > 1 ? true : false;
            if ( isFloor == true && pastExisted == false){
                pastExisted = true;
                output = { x, y, build: true};
                drawPixel(x, y, r, g, b, 255);
            } else if ( isFloor == true && pastExisted == true) {
                pastExisted = true;
                output = { x, y, build: false};
            } else if ( isFloor == false && pastExisted == true) {
                pastExisted = false;
                output = { x, y, build: false};
            } else {
                output = { x, y, build: false};
            }
            
            return output;
        })
    })
    .flatMap(_ => _)
    .filter(coord => coord.build > 0)
    .map(coord => `${coord.x}, ${coord.y}, ${0}`);

    updateCanvas2();
    return result;
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
},{"get-canvas-pixel-color":2}],2:[function(require,module,exports){
/*! npm.im/get-canvas-pixel-color 2.0.1 */
'use strict';

/**
 * getCanvasPixelColor
 * @param  {canvas element|context} ctx  The canvas from which to take the color
 * @param  {int} x                       The x coordinate of the pixel to read
 * @param  {int} y                       The y coordinate of the pixel to read
 * @return {array/object}                The rgb values of the read pixel
 */
var index = function (ctx, x, y) {
	// if it's not a context, it's probably a canvas element
	if (!ctx.getImageData) {
		ctx = ctx.getContext('2d');
	}

	// extract the pixel data from the canvas
	var pixel = ctx.getImageData(x, y, 1, 1).data;

	// set each color property
	pixel.r = pixel[0];
	pixel.g = pixel[1];
	pixel.b = pixel[2];
	pixel.a = pixel[3];

	// convenience CSS strings
	pixel.rgb = 'rgb('+pixel.r+','+pixel.g+','+pixel.b+')';
	pixel.rgba = 'rgba('+pixel.r+','+pixel.g+','+pixel.b+','+pixel.a+')';

	return pixel;
};

module.exports = index;

},{}]},{},[1]);
