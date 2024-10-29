//import { Ficha } from "./clases/Ficha"; 

//no me deja hacer el import nose pq estuve 2hs probando
//GET http://127.0.0.1:5500/clases/Ficha net::ERR_ABORTED 404 (Not Found) esto me tira nose, pero en el main anda la misma ruta a esto lo soluciono de una manera casera 

/*   
    for(i ; fichasPorJugador){
        llenarFichero(new Ficha) 
    }

    desde el main
*/

export class Fichero{
    constructor(fichasPorJugador, radioFicha, ctx){
        this.fichasPorJugador = fichasPorJugador;
        this.radioFicha = radioFicha;
        this.ctx = ctx;
        this.fichasCounter = [];
        this.fichasTerror = [];
        this.fichas = [];
        this.posFichaCounter = {
            x: 100,
            y: 250
        };
        this.posFichaTerror = {
            x: 100,
            y: 100
        };
    }

    llenarFichero(fichaTerror, fichaCounter, i){

        this.fichasTerror.push(fichaTerror);
        this.fichasCounter.push(fichaCounter);

        this.fichas.push(this.fichasTerror[i]);
        this.fichas.push(this.fichasCounter[i]);
    }

    dibujarFichas() {
        for (let i=0; i<this.fichasPorJugador; i++) {
            this.fichasCounter[i].dibujarFichaCircular();
            this.fichasTerror[i].dibujarFichaCircular();
        }
    }
}