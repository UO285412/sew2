class Semaforo {
    constructor(difficulty) {
        this.difficulty = difficulty; // Nivel de dificultad
        this.reactionTime = null; // Tiempo de reacción
        this.startTime = null; // Momento en que el semáforo se puso en verde
        this.isGameRunning = false; // Indica si el juego está en curso
    }

    startReactionGame() {
        this.isGameRunning = true;
        this.startTime = null;

        // Simular cambio a verde después de un tiempo aleatorio
        const randomDelay = Math.random() * 5000 + 1000; // Entre 1 y 6 segundos
        setTimeout(() => {
            this.startTime = performance.now();
            this.changeToGreen(); // Método para cambiar el semáforo a verde
        }, randomDelay);
    }

    stopReaction() {
        if (!this.isGameRunning || !this.startTime) {
            alert("El semáforo no está en verde aún.");
            return;
        }

        const endTime = performance.now();
        this.reactionTime = ((endTime - this.startTime) / 1000).toFixed(3); // Tiempo en segundos
        this.isGameRunning = false;

        alert(`¡Juego terminado! Tiempo de reacción: ${this.reactionTime} segundos`);

        // Llamar al método para crear el formulario de récord
        this.createRecordForm();
    }

    createRecordForm() {
        // Crear el formulario usando jQuery
        const form = $(`
            <form method="POST" action="semaforo.php">
                <fieldset>
                    <legend>Registrar Récord</legend>
                    <label>
                        Nombre:
                        <input type="text" name="nombre" required>
                    </label>
                    <label>
                        Apellidos:
                        <input type="text" name="apellidos" required>
                    </label>
                    <label>
                        Nivel:
                        <input type="text" name="nivel" value="${this.difficulty}" readonly>
                    </label>
                    <label>
                        Tiempo de reacción (segundos):
                        <input type="text" name="tiempo" value="${this.reactionTime}" readonly>
                    </label>
                    <button type="submit">Guardar Récord</button>
                </fieldset>
            </form>
        `);

        // Añadir el formulario debajo del semáforo
        $("main").append(form);
    }

    changeToGreen() {
        // Simulación de cambio de color a verde
        console.log("¡Semáforo en verde! Haz clic ahora.");
    }
}

$(document).ready(() => {
    // Ejemplo de inicialización
    const difficulty = "Intermedio"; // Nivel de dificultad como ejemplo
    const semaforo = new Semaforo(difficulty);

    // Botón para iniciar el juego
    $("button[data-action='start-game']").on("click", () => semaforo.startReactionGame());

    // Botón para detener el juego y calcular tiempo
    $("button[data-action='stop-game']").on("click", () => semaforo.stopReaction());
});
