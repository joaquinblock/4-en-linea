export class Cronometro {
    constructor(elementId, duracionMinutos = 10) { // Duración en minutos
        this.duracion = duracionMinutos; // Duración total en minutos
        this.segundos = duracionMinutos * 60; // Convertir a segundos
        this.intervalId = null;
        this.elementoHTML = document.getElementById(elementId);
    }

    iniciar() {
        this.actualizarDisplay();
        this.intervalId = setInterval(() => {
            this.segundos--;
            this.actualizarDisplay();

            // Si el cronómetro llega a 0, se detiene automáticamente
            if (this.segundos <= 0) {
                this.detener();
                this.notificarTiempoFinalizado();
                location.reload();
            }
        }, 1000);


    }

    detener() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    actualizarDisplay() {
        const minutos = Math.floor(this.segundos / 60);
        const segundos = this.segundos % 60;
        const minutosTexto = minutos < 10 ? `0${minutos}` : minutos;
        const segundosTexto = segundos < 10 ? `0${segundos}` : segundos;

        this.elementoHTML.textContent = `${minutosTexto}:${segundosTexto}`;
    }
    notificarTiempoFinalizado() {
        alert("¡El tiempo ha terminado!");
       
    }
}