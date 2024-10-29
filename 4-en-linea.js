let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let imageData = ctx.createImageData(width, height); 

// Colores de fondo (RGB: 74, 89, 66)
let r = 74;
let g = 89;
let b = 66;
let a = 255; // Alfa 100% opaco

// Dibujar el rectángulo del fondo
drawRect(imageData, r, g, b, a);
ctx.putImageData(imageData, 0, 0); // Colocar la imagen en el canvas

function drawRect(imageData, r, g, b, a) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
}

function setPixel(imageData, x, y, r, g, b, a) { //accedo a cada pixel
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r; // Rojo
    imageData.data[index + 1] = g; // Verde
    imageData.data[index + 2] = b; // Azul
    imageData.data[index + 3] = a; // Alfa
}

dibujarTablero();

function dibujarTablero(){
        // Definir el tamaño del tablero
    let rows = 6;
    let columns = 6;

    // Padding proporcional entre los círculos
    let padding = 20;

    // Calcular el tamaño del círculo de manera dinámica
    let circleWidth = (canvas.width - padding * (columns + 1)) / columns;
    let circleHeight = (canvas.height - padding * (rows + 1)) / rows;
    let circleRadius = Math.min(circleWidth, circleHeight) / 2;
    console.log(circleRadius);

    // Calcular las posiciones iniciales para centrar el tablero
    let startX = (canvas.width - (columns * (circleRadius * 2 + padding) - padding)) / 2;
    let startY = (canvas.height - (rows * (circleRadius * 2 + padding) - padding)) / 2;

    // Dibujar los círculos en la cuadrícula
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            let x = startX + col * (circleRadius * 2 + padding) + circleRadius;
            let y = startY + row * (circleRadius * 2 + padding) + circleRadius;

            // Dibujar el círculo
            ctx.beginPath();
            ctx.arc(x, y, circleRadius, 0, 2 * Math.PI); 
            ctx.stroke();
            ctx.fillStyle = "transparent";
            ctx.fill();
        }
    }
}

let image1 = new Image();
image1.src = "/img/counter.svg";

let image2 = new Image();
image2.src = "/img/terror.svg";

image2.onload = function() {
    myDrawImageMethod(this, 65, 230);
}

image1.onload = function() {
    myDrawImageMethod(this, 50, 60);
}

function myDrawImageMethod(image, x, y){
    ctx.drawImage(image, x, y);
}

dibujarCirculo(100, 270, 78, "transparent");

function dibujarCirculo(x, y, circleRadius, colorFill){
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, 2 * Math.PI); 
    ctx.stroke();
    ctx.fillStyle = colorFill;
    ctx.fill();
}


