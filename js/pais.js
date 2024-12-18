class Pais {
    #nombrePais;
    #nombreCapital;
    #cantidadPoblacion;
    #nombreCircuito;
    #tipoGobierno;
    #coordenadasMetaLatitud;
    #coordenadasMetaLongitud;
    #religionMayoritaria;

    constructor(nombrePais, nombreCapital, cantidadPoblacion) {
        this.#nombrePais = nombrePais;
        this.#nombreCapital = nombreCapital;
        this.#cantidadPoblacion = cantidadPoblacion;
    }
   
    rellenarInformacionRestante()
    {
        this.#nombreCircuito = "Shanghai";
        this.#tipoGobierno = "Gobierno popular estatal";
        this.#coordenadasMetaLatitud = "31.337238171688075"
        this.#coordenadasMetaLongitud = "121.22028643578226";
        this.#religionMayoritaria ="Budismo";
    }

    getNombrePais()
    {
        return ""+this.#nombrePais;
    }

    getNombreCapital()
    {
        return ""+this.#nombreCapital;
    }

    getInformacionSecundaria()
    {
        
        return ""+
        "<ul>"+
            "<li>"+
                "<h4>Nombre del circuito:</h4>"+
                "<p>"+this.#nombreCircuito+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Cantidad de poblacion:</h4>"+
                "<p>"+this.#cantidadPoblacion+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Forma de gobierno:</h4>"+
                "<p>"+this.#tipoGobierno+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Religión mayoritaria:</h4>"+
                "<p>"+this.#religionMayoritaria+"</p>"+
            "</li>"+
        "</ul>";
    }

    escribeCoordenadas()
    {
         
        document.write(
            "<p>Latitud: "+this.#coordenadasMetaLatitud+"</p>"+
            "<p>Longitud: "+this.#coordenadasMetaLongitud+"</p>"
        );
    }
    mostrarInformacionCompleta() {
        console.log("Información completa del país.");
        this.rellenarInformacionRestante();
    
        // Información del país
        const informacionPais = `
            <h3>Información del País</h3>
            <p><strong>Nombre del País:</strong> ${this.getNombrePais()}</p>
            <p><strong>Capital:</strong> ${this.getNombreCapital()}</p>
            ${this.getInformacionSecundaria()}
        `;
    
        // Información del tiempo (placeholder antes de la carga)
        const tiempoPlaceholder = `<p>Cargando datos del tiempo...</p>`;
    
        // Generar el HTML completo para el documento
        const htmlCompleto = `
            <section>
               
                <article>
                    ${informacionPais}
                </article>
            </section>
            <section>
                <h2>Previsión meteorológica</h2>
                <article>
                    ${tiempoPlaceholder}
                </article>
            </section>
        `;
    
        // Sobrescribir el contenido del documento con document.write
        document.write(htmlCompleto);
    
        // Obtener la previsión meteorológica
        const infoTiempoArticle = document.querySelector('main > section:nth-of-type(2) > article');
        this.obtenerPrevisionTiempo(infoTiempoArticle);
    }
    

    
obtenerPrevisionTiempo($previsionArticle) {
    const meteorologia = {
        apiKey: "d2b34fee546c2de560551f6b17f107ce",
        lat: 31.33721258891535,
        lon: 121.22029650718295,
        url: "https://api.openweathermap.org/data/2.5/forecast?" +
             "lat=31.33721258891535&lon=121.22029650718295&" +
             "mode=xml&lang=es&units=metric&appid=d2b34fee546c2de560551f6b17f107ce"
    };

    $.ajax({
        url: meteorologia.url,
        method: 'GET',
        dataType: 'xml',
        success: (data) => {
            this.procesarPrevisionTiempo(data, $previsionArticle);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(`Error al obtener la previsión del tiempo: ${textStatus}, ${errorThrown}`);
            $previsionArticle.html(`<p>Error al cargar los datos del tiempo.</p>`);
        }
    });
}

procesarPrevisionTiempo(xmlData, previsionArticle) {
    const $xml = $(xmlData);

    // Limpiar contenido previo
    previsionArticle.innerHTML = '';

    const pronosticos = $xml.find('time[from$="12:00:00"]');

    pronosticos.each(function (index) {
        if (index < 5) { // Mostrar las primeras 5 previsiones
            const $this = $(this);

            const fecha = $this.attr('from').split('T')[0];
            const tempMax = $this.find('temperature').attr('max');
            const tempMin = $this.find('temperature').attr('min');
            const humedad = $this.find('humidity').attr('value');
            const simboloClima = $this.find('symbol').attr('var');
            const iconUrl = `https://openweathermap.org/img/wn/${simboloClima}@2x.png`;
            const lluvia = $this.find('precipitation').attr('value') || 'No disponible';

            // Crear un elemento <article> usando DOM
            const pronosticoElement = document.createElement('article');
            pronosticoElement.innerHTML = `
                <h4>${fecha}</h4>
                <img src="${iconUrl}" alt="Icono del clima">
                <p>Temperatura Máxima: ${tempMax} °C</p>
                <p>Temperatura Mínima: ${tempMin} °C</p>
                <p>Humedad: ${humedad}%</p>
                <p>Lluvia: ${lluvia}</p>
            `;

            // Añadir el pronóstico al contenedor
            previsionArticle.appendChild(pronosticoElement);
        }
    });
}

}
