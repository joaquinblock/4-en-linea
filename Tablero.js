export class Tablero {
    constructor(filas, columnas, posIniX, posIniY, margenFichas, margenLineas, radioFicha, ctx){
        this.filas = filas;
        this.columnas = columnas;
        this.posIniX = posIniX;
        this.posIniY = posIniY;
        this.margenFichas = margenFichas;
        this.margenLineas = margenLineas;
        this.radioFicha = radioFicha;
        this.ctx = ctx;
        this.limiteBase = posIniX - radioFicha - margenLineas;
        this.matriz = [];
        this.colorLinea = "rgba(255, 215, 0)";
        this.inicializarMatriz();
    }

    dibujarTablero(columnaActual, opacidad) {
        let x = 0 ;
        let y = 0;
        let color = "white";
        for (let col = 0; col < this.columnas; col++) {
            for (let row = 0; row < this.filas; row++) {
                x = this.posIniX + this.margenFichas * col;
                y = this.posIniY + this.margenFichas * row;
                this.dibujarCirculo(x, y, opacidad);
            }
            if (col == columnaActual || col== columnaActual+1){
                color = this.colorLinea;
            }else{
                color = "white";
            }
            this.dibujarLineaColumna(x, y, color);
        }

        if(columnaActual==6){
            color = this.colorLinea;
        }else{
            color = "white";
        }

        // Línea derecha adicional
        x = this.posIniX + this.margenFichas * this.columnas;
        y = this.posIniY  + this.margenFichas * (this.filas - 1);

        this.dibujarLineaColumna(x, y, color);
    }

    dibujarLineaColumna(xCircle, yCircle, color) {
        const xLine = xCircle - this.radioFicha - this.margenLineas; 
        this.ctx.beginPath();
        this.ctx.moveTo(xLine, this.posIniY - this.radioFicha);
        this.ctx.lineTo(xLine, yCircle + this.radioFicha);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }



    dibujarCirculo(x , y, opacidad){
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.radioFicha, 0, 2 * Math.PI);  
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacidad})`;
        this.ctx.fill();
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    inicializarMatriz(){
        for (let i = 0; i < this.filas; i++) {
            const fila = []; 
            for (let j = 0; j < this.columnas; j++) {
                fila.push(0); // Llenamos cada columna con un valor inicial 0
            }
            this.matriz.push(fila); // Agregamos la fila a la matriz
        }
    }

    obtenerPrimeraFilaVacia(columna) {
        for (let fila = this.filas - 1; fila >= 0; fila--) {
            if (this.matriz[fila][columna] === 0) {
                return fila;
            }
        }
        return null; // Si la columna está llena
    }

    colocarFicha(fila, columna, jugador) {
        if (fila !== null && columna >= 0 && columna < this.columnas) {
            this.matriz[fila][columna] = jugador; // Marca la posición con el número del jugador (1 o 2)
        }
    }

    estaOcupada(fila, columna) {
        return this.matriz[fila][columna] !== 0;
    }

    imprimirTablero() {
        console.log("hola");
        console.table(this.matriz);
    }

    obtenerColumna(mouseX){
        let columna = -1; // Inicializa columna como no válida

        // Verifica en qué columna está el mouse
        switch (true) {
            case (mouseX >= this.limiteBase && mouseX < this.limiteBase + this.margenFichas):
                columna = 0; // Primera columna
                break;
            case (mouseX >= this.limiteBase + this.margenFichas && mouseX < this.limiteBase + (2 * this.margenFichas)):
                columna = 1; // Segunda columna
                break;
            case (mouseX >= this.limiteBase + (2 * this.margenFichas) && mouseX < this.limiteBase + (3 * this.margenFichas)):
                columna = 2; // Tercera columna
                break;
            case (mouseX >= this.limiteBase + (3 * this.margenFichas) && mouseX < this.limiteBase + (4 * this.margenFichas)):
                columna = 3; // Cuarta columna
                break;
            case (mouseX >= this.limiteBase + (4 * this.margenFichas) && mouseX < this.limiteBase + (5 * this.margenFichas)):
                columna = 4; // Quinta columna
                break;
            case (mouseX >= this.limiteBase + (5 * this.margenFichas) && mouseX < this.limiteBase + (6 * this.margenFichas)):
                columna = 5; // Sexta columna
                break;
            case (mouseX >= this.limiteBase + (6 * this.margenFichas) && mouseX < this.limiteBase + (7 * this.margenFichas)):
                columna = 6; // Séptima columna
                break;
        }

        return columna;
    }
}