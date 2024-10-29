
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
    