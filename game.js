import { Fichero } from "./Fichero.js";
import { Ficha } from "./Ficha.js";
import { Tablero } from "./Tablero.js";
import { Cronometro } from "./cronometro.js";


window.onload = () => {
    const cronometro = new Cronometro("cronometro", 10); // Cuenta regresiva de 10
    cronometro.iniciar();
    
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;

    let sizeTablero = { filas: 6, columnas: 7 }; 
    let filas = sizeTablero.filas;
    let columnas = sizeTablero.columnas;

    const selectTablero = document.getElementById("tamanioTablero");

    const tamaniosTablero = {
        4: { filas: 6, columnas: 7 },
        5: { filas: 7, columnas: 8 },
        6: { filas: 8, columnas: 9 },
        7: { filas: 9, columnas: 10 }
    };

    

    inicializarJuego(filas, columnas);



    // Espera a que la imagen se cargue antes de dibujarla en el canvas
    function inicializarJuego(filas, columnas){
        
        const background = new Image();
        background.src = '../img/background-cs.jpeg';
        let modoJuego = "4 en linea";

        background.onload = () => {
            dibujarFondo();
            dibujarIconReset();
            dibujarSelectorJuego();
    
            const radioFicha = 50;
            const margenFichas = (radioFicha*2) + 50; //el diametro + un numero x
            const posIniX = width*0.33;
            const posIniY = height*0.16;
            const margenLineas = 25;
            const opacidad = 1; //valores entre 0 y 1
            
            let tablero1 = new Tablero(filas, columnas, posIniX, posIniY, margenFichas, margenLineas, radioFicha, ctx);
            
            tablero1.dibujarTablero( undefined, opacidad);
    
            let posFichaCounter = {
                x: 100,
                y: 100
            };
    
            let posFichaTerror = {
                x: 100,
                y: 250
            };
    
            const fichasTotales= columnas * filas;
            const fichasPorJugador = fichasTotales / 2;
    
            let estaAgarrando = false;
            let fichaAgarrada = null;
    
            let fichero = new Fichero(fichasPorJugador, radioFicha, ctx);
    
            for(let i=0; i<fichasPorJugador; i++){
                fichero.llenarFichero(new Ficha("red", "../img/terror.svg", posFichaTerror.x, posFichaTerror.y, radioFicha, ctx), new Ficha("blue", "../img/counter.svg", posFichaCounter.x, posFichaCounter.y, radioFicha, ctx), i);
            }
    
            fichero.dibujarFichas();
            
            let turnoJugador = Math.random() < 0.5 ? "red" : "blue"; //elije o red o blue
    
            dibujarTurno(turnoJugador);
    
            // Eventos de mouse
            canvas.addEventListener('mousedown', (e) => { //detecta el click sobre el canvas cuando el usuario mantiene abajo el click, es decir mientras lo esta apretando
                const mouseX = getMousePos(e).x;
                const mouseY = getMousePos(e).y;
    
                fichaAgarrada = mouseEnFicha(mouseX, mouseY);
    
                console.log(fichaAgarrada);
    
                if(fichaAgarrada){
                    estaAgarrando = true;
                }
    
            });
    
            canvas.addEventListener('mousemove', dibujar);
    
            function dibujar(e){
                if (estaAgarrando){
                    const mouseX = getMousePos(e).x;
                    const mouseY = getMousePos(e).y;
    
                    fichaAgarrada.x = mouseX;
                    fichaAgarrada.y = mouseY;
    
                    limpiarCanvas();
    
                    // Cálculo base para las posiciones de las columnas
                
    
                    let columna = tablero1.obtenerColumna(mouseX);
                    dibujarFondo();
                    if (columna>-1 && columna<7){
                        tablero1.dibujarTablero(columna, 1);
                    }else{
                        tablero1.dibujarTablero();
                    }
                    fichero.dibujarFichas();
                }
            }
    
            let tablero = tablero1.matriz;
    
    
            canvas.addEventListener('mouseup', (e) => { //cuando el usuario levanta el click o lo deja de apretar
                estaAgarrando = false;
    
                if (!estaAgarrando){
                    const mouseX = getMousePos(e).x;
    
                    const columna = tablero1.obtenerColumna(mouseX); // Encuentra la columna más cercana
                    if (columna !== -1) {
    
                        // Alinea la ficha al centro de la columna y anima la caída
                        fichaAgarrada.x = posIniX + columna * margenFichas;
                        redibujarCanvas();
                        caerFicha(fichaAgarrada, columna);
                    } else {
                        // Si no es una columna válida, suelta la ficha sin alinear
                        fichaAgarrada = null;
                    }
                }
            });
    
            function caerFicha(ficha, columna) {
                const yObjetivo = obtenerYObjetivo(columna); // Calcula la posición de caída
    
                // Verifica si yObjetivo es null (columna llena)
                if (yObjetivo === null) {
                    return;
                }
    
                if (ficha.y < yObjetivo) {
                    ficha.y += 30; // Ajusta la velocidad de caída
    
                    // Redibuja el canvas
                    redibujarCanvas();
    
                    // Llama a la animación para el siguiente cuadro
                    requestAnimationFrame(() => caerFicha(ficha, columna));
                } else {
                    ficha.y = yObjetivo; // Ajusta la posición final si se pasa
    
                    redibujarCanvas();
    
                    // Marca la posición en el tablero como ocupada
                    const filaObjetivo = Math.round((yObjetivo - posIniY) / margenFichas);
                    tablero[filaObjetivo][columna] = ficha; // Marca esta posición como ocupada
    
                    ficha.enTablero = true; // Marca la ficha como colocada en el tablero
    
                        // Verificar ganador después de colocar la ficha
                    if (verificarGanador(4)) {
                        alert(`¡El jugador ${turnoJugador} ha ganado!`);
                        location.reload(); // Recarga la página al cerrar el alert
                    }
                    
                    
                    // Cambiar el turno después de colocar la ficha
                    if (turnoJugador == "red"){
                        turnoJugador = "blue"
                    }else if (turnoJugador ="blue"){
                        turnoJugador = "red";
                    }
    
                    dibujarTurno(turnoJugador); // Dibuja el turno actual después de limpiar
                    
                }
            }
    
            //Funciona bien
    
            function verificarGanador(nEnLinea) {
                // Revisa las filas
                for (let fila = 0; fila < filas; fila++) {
                    for (let col = 0; col <= columnas - nEnLinea; col++) {
                        let consecutivas = 0;
                        for (let i = 0; i < nEnLinea; i++) {
                            if (tablero[fila][col + i] && tablero[fila][col + i].color === turnoJugador) {
                                consecutivas++;
                            } else {
                                break;
                            }
                        }
                        if (consecutivas === nEnLinea) {
                            return true;
                        }
                    }
                }
            
                // Revisa las columnas
                for (let col = 0; col < columnas; col++) {
                    for (let fila = 0; fila <= filas - nEnLinea; fila++) {
                        let consecutivas = 0;
                        for (let i = 0; i < nEnLinea; i++) {
                            if (tablero[fila + i][col] && tablero[fila + i][col].color === turnoJugador) {
                                consecutivas++;
                            } else {
                                break;
                            }
                        }
                        if (consecutivas === nEnLinea) {
                            return true;
                        }
                    }
                }
            
                // Revisa diagonales (de izquierda a derecha)
                for (let fila = 0; fila <= filas - nEnLinea; fila++) {
                    for (let col = 0; col <= columnas - nEnLinea; col++) {
                        let consecutivas = 0;
                        for (let i = 0; i < nEnLinea; i++) {
                            if (tablero[fila + i][col + i] && tablero[fila + i][col + i].color === turnoJugador) {
                                consecutivas++;
                            } else {
                                break;
                            }
                        }
                        if (consecutivas === nEnLinea) {
                            return true;
                        }
                    }
                }
            
                // Revisa diagonales (de derecha a izquierda)
                for (let fila = 0; fila <= filas - nEnLinea; fila++) {
                    for (let col = nEnLinea - 1; col < columnas; col++) {
                        let consecutivas = 0;
                        for (let i = 0; i < nEnLinea; i++) {
                            if (tablero[fila + i][col - i] && tablero[fila + i][col - i].color === turnoJugador) {
                                consecutivas++;
                            } else {
                                break;
                            }
                        }
                        if (consecutivas === nEnLinea) {
                            return true;
                        }
                    }
                }
            
                return false;
            }
    
            function redibujarCanvas(){
                limpiarCanvas();
                dibujarFondo();
                dibujarIconReset();
                tablero1.dibujarTablero();
                fichero.dibujarFichas();
            }
    
            function obtenerYObjetivo(columna) {
                for (let fila = filas - 1; fila >= 0; fila--) {
                    if (tablero[fila][columna] === 0) { // Encuentra la primera fila vacía desde abajo
                        // Calcula y devuelve la posición en píxeles de la fila vacía encontrada
                        return posIniY + fila * margenFichas;
                    }
                }
                return null; // Si la columna está llena, devuelve null para manejar ese caso
            }
                
            function getMousePos(event){
                return { //objeto
                    x: Math.round(event.clientX - canvas.offsetLeft),  //math round devuelve un valor redondo
                    y: Math.round(event.clientY - canvas.offsetTop)
                };
            }
    
            function mouseEnFicha(mouseX, mouseY) {
                for (const ficha of fichero.fichas) {
                    if (ficha.enTablero) continue; // Omite las fichas que ya están en el tablero
    
                    // Verifica si es el turno del jugador correspondiente
                    
                    if (ficha.color !== turnoJugador) continue;
                    
                    const distanciaX = mouseX - ficha.x;
                    const distanciaY = mouseY - ficha.y;
                    const distanciaAlCentro = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);
                    
                    if (distanciaAlCentro <= radioFicha) {
                        return ficha;
                    }
                }
                return null;
            }
    
            function limpiarCanvas(){
                // Limpia el canvas antes de redibujar
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
    
            function dibujarTurno(turnoJugador) {
                ctx.font = "30px Arial";
                ctx.fillText(`Turno del jugador: ${turnoJugador}`, 10, 30); // Dibuja el turno en la parte superior izquierda
            }
        };
    
        function dibujarFondo(){
            ctx.save();
    
            // Dibuja la imagen de fondo
            ctx.drawImage(background, 0, 0, width, height);
    
            // Añade un rectángulo negro semitransparente encima para crear el efecto de sombra
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Negro con 50% de opacidad
            ctx.fillRect(0, 0, width, height);
    
            // Restaura el contexto a su estado anterior, eliminando la opacidad y el color negro
            ctx.restore();
    
            //sino tambien se pintan los circulos de negro
        }
    
        function dibujarIconReset(){
            const iconReset = new Image();
            iconReset.src = '../img/icon-reset.png';
    
            // Espera a que la imagen se cargue antes de dibujarla en el canvas
            iconReset.onload = () => {
                ctx.save();
    
                // Dibuja la imagen de fondo
                ctx.drawImage(iconReset, 1800, 50);
    
                // Restaura el contexto a su estado anterior, eliminando la opacidad y el color negro
                ctx.restore();
            }
        }
        let tiempoRestante = 60; // Tiempo inicial en segundos
    
        
        function dibujarSelectorJuego(){
            ctx.save();
            // Configura el estilo del texto para el reloj
            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
    
            // Dibuja el tiempo restante en la esquina superior derecha
            ctx.fillText(`Modo de juego: ${modoJuego}`, 50, 1000);
            ctx.restore();
        }
    }
}

