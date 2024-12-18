

class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8]; 
        this.lights = 4; 
        this.unload_moment = null; 
        this.click_moment = null; 

        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];
        this.createStructure();
      
    }

    createStructure() {
        const main = document.querySelector("main");
        const section = document.createElement("section");
       
       
        const header = document.createElement("h2");
        header.textContent = "Juego de tiempo de reacción";
        section.appendChild(header);

        
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement("div");
            
            section.appendChild(light);
        }

        // Botón de arranque
        const startButton = document.createElement("button");
        startButton.textContent = "Arranque";
        startButton.type = "button";
        startButton.setAttribute("onclick", "semaforo.initSequence()"); // Asignar evento onclick
        section.appendChild(startButton);

        // Botón de reacción
        const reactionButton = document.createElement("button");
        reactionButton.textContent = "Reacción";
        reactionButton.type = "button";
        reactionButton.disabled = true;
        reactionButton.setAttribute("onclick", "semaforo.stopReaction()"); // Asignar evento onclick
        section.appendChild(reactionButton);

        main.appendChild(section);
        this.semaforoSection = section; 
        
        this.startButton = startButton;
        this.reactionButton = reactionButton;
    }

    initSequence() {
        const main = document.querySelector("main");
        main.classList.add("load"); 
        this.startButton.disabled = true; 

     
        setTimeout(() => {
            this.unload_moment = new Date(); 
            this.endSequence();
        }, 2000 + this.difficulty * 100); 
    }

    endSequence() {
        const main = document.querySelector("main");
        main.classList.remove("load"); 
        main.classList.add("unload");

        this.reactionButton.disabled = false; 
    }

    stopReaction() {
        this.click_moment = new Date();
        const reactionTime = ((this.click_moment - this.unload_moment) / 1000).toFixed(3);
    
        const paragraph = document.createElement("p");
        paragraph.textContent = `Tiempo de reacción: ${reactionTime} segundos`;
        this.semaforoSection.appendChild(paragraph);
    
        const main = document.querySelector("main");
        main.classList.remove("load");
        main.classList.remove("unload");
    
        this.startButton.disabled = false;
        this.reactionButton.disabled = true;
    
        this.createRecordForm(reactionTime, this.difficulty);
    
       
    }
    
   
    

    createRecordForm(reactionTime, difficulty) {
        console.log("Creando formulario para registrar récord...");
        const form = document.createElement('form');
        form.method = "POST";
        form.action = "semaforo.php";
    
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = "Registrar Récord";
    
        // Nombre
        const labelNombre = document.createElement('label');
        labelNombre.textContent = "Nombre:";
        const inputNombre = document.createElement('input');
        inputNombre.type = "text";
        inputNombre.name = "nombre";
        inputNombre.required = true;
        inputNombre.id = "inputNombre"; 
        labelNombre.setAttribute("for", "inputNombre");
    
        labelNombre.appendChild(document.createElement('br'));
        labelNombre.appendChild(inputNombre);
    
        // Apellidos
        const labelApellidos = document.createElement('label');
        labelApellidos.textContent = "Apellidos:";
        const inputApellidos = document.createElement('input');
        inputApellidos.type = "text";
        inputApellidos.name = "apellidos";
        inputApellidos.required = true;
        inputApellidos.id = "inputApellidos";
        labelApellidos.setAttribute("for", "inputApellidos");
    
        labelApellidos.appendChild(document.createElement('br'));
        labelApellidos.appendChild(inputApellidos);
    
        // Nivel
        const labelNivel = document.createElement('label');
        labelNivel.textContent = "Nivel:";
        const inputNivel = document.createElement('input');
        inputNivel.type = "text";
        inputNivel.name = "nivel";
        inputNivel.value = difficulty;
        inputNivel.readOnly = true;
        inputNivel.id = "inputNivel"; 
        labelNivel.setAttribute("for", "inputNivel");
    
        labelNivel.appendChild(document.createElement('br'));
        labelNivel.appendChild(inputNivel);
    
        // Tiempo de reacción
        const labelTiempo = document.createElement('label');
        labelTiempo.textContent = "Tiempo de reacción (segundos):";
        const inputTiempo = document.createElement('input');
        inputTiempo.type = "text";
        inputTiempo.name = "tiempo";
        inputTiempo.value = reactionTime;
        inputTiempo.readOnly = true;
        inputTiempo.id = "inputTiempo"; 
        labelTiempo.setAttribute("for", "inputTiempo");
    
        labelTiempo.appendChild(document.createElement('br'));
        labelTiempo.appendChild(inputTiempo);
    
     
        const submitButton = document.createElement('button');
        submitButton.type = "submit";
        submitButton.textContent = "Guardar Récord";
    
     
        fieldset.appendChild(legend);
        fieldset.appendChild(labelNombre);
        fieldset.appendChild(document.createElement('br'));
        fieldset.appendChild(labelApellidos);
        fieldset.appendChild(document.createElement('br'));
        fieldset.appendChild(labelNivel);
        fieldset.appendChild(document.createElement('br'));
        fieldset.appendChild(labelTiempo);
        fieldset.appendChild(document.createElement('br'));
        fieldset.appendChild(submitButton);
    
       
        form.appendChild(fieldset);
    
       
        this.semaforoSection.appendChild(form);
        console.log("Formulario de récord creado.");
    }
    
}

