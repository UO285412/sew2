/* Tu nombre y datos */
/* Nestor Fernandez Garcia UO285412 */

"use strict";

class Circuito {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // El navegador soporta la API File de HTML5
        } else {
            document.body.insertAdjacentHTML('beforeend', "<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
            this.deshabilitarCargaDeFichero();
        }
    }

    deshabilitarCargaDeFichero() {
        this.deshabilitarCargaDeFicheroXML();
        this.deshabilitarCargaDeFicheroKML();
        this.deshabilitarCargaDeFicheroSVG();
    }

    deshabilitarCargaDeFicheroXML() {
        const xmlInput = document.querySelector("section:nth-of-type(1) input[type='file']");
        if (xmlInput) {
            xmlInput.disabled = true;
        }
    }

    deshabilitarCargaDeFicheroKML() {
        const kmlInput = document.querySelector("section:nth-of-type(2) input[type='file']");
        if (kmlInput) {
            kmlInput.disabled = true;
        }
    }

    deshabilitarCargaDeFicheroSVG() {
        const svgInput = document.querySelector("section:nth-of-type(3) input[type='file']");
        if (svgInput) {
            svgInput.disabled = true;
        }
    }

    // Tarea 6: Procesado de un fichero en formato XML con el API File
    cargarXML() {
        const fileInput = document.querySelector("section:nth-of-type(1) input[type='file']");
        const file = fileInput.files[0];
    
        if (!file) return;
    
        const xmlType = "text/xml";
    
        if (file.type.match(xmlType) || file.name.endsWith('.xml')) {
            this.deshabilitarCargaDeFicheroXML();
            this.procesarXML(file);
        } else {
            this.mostrarError("Error: ¡¡¡ Archivo no válido, debe ser un XML !!!");
        }
    }
    
    
    procesarXML(archivo) {
        const lector = new FileReader();
    
        lector.onload = () => {
            const xmlContent = lector.result;
            this.crearCamposXML(archivo, xmlContent);
        };
    
        lector.onerror = () => {
            this.mostrarError("Error al leer el archivo XML.");
        };
    
        lector.readAsText(archivo);
    }
    

    crearCamposXML(archivo, xmlContent) {
        const seccion = document.querySelector("section:nth-of-type(1)");
    
        // Mostrar información del archivo
        const infoArchivo = document.createElement("div");
        infoArchivo.innerHTML = `
            <p>Nombre del archivo: ${archivo.name}</p>
            <p>Tamaño del archivo: ${archivo.size} bytes</p>
            <p>Tipo del archivo: ${archivo.type}</p>
            <p>Fecha de la última modificación: ${archivo.lastModifiedDate}</p>
            <p>Contenido del archivo XML:</p>
        `;
        seccion.appendChild(infoArchivo);
    
        // Mostrar contenido del XML en un elemento <pre>
        const preElement = document.createElement("pre");
        preElement.textContent = xmlContent;
        seccion.appendChild(preElement);
    }
    

    convertirXMLaHTML(xmlNode) {
        const container = document.createElement("div");

        const nodeName = document.createElement("strong");
        nodeName.textContent = xmlNode.nodeName;
        container.appendChild(nodeName);

        // Agrega los atributos del nodo
        if (xmlNode.attributes) {
            const attributes = Array.from(xmlNode.attributes).map(
                (attr) => `${attr.name}="${attr.value}"`
            );
            if (attributes.length > 0) {
                const attrText = document.createElement("p");
                attrText.textContent = `Atributos: ${attributes.join(", ")}`;
                container.appendChild(attrText);
            }
        }

        // Procesa los nodos hijos
        Array.from(xmlNode.childNodes).forEach((childNode) => {
            if (childNode.nodeType === Node.ELEMENT_NODE) {
                const childHTML = this.convertirXMLaHTML(childNode);
                container.appendChild(childHTML);
            } else if (childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim()) {
                const textNode = document.createElement("p");
                textNode.textContent = `Texto: ${childNode.nodeValue.trim()}`;
                container.appendChild(textNode);
            }
        });

        return container;
    }

  // Tarea 7: Lectura y procesamiento de archivos de planimetría
  cargarKML() {
    const fileInput = document.querySelector("section:nth-of-type(2) input[type='file']");
    const archivo = fileInput.files[0];

    if (!archivo) return;

    if (archivo.name.endsWith('.kml')) {
        this.procesarKML(archivo);
    } else {
        this.mostrarError("Error: ¡¡¡ Archivo no válido, debe ser un KML !!!");
    }
}

procesarKML(archivo) {
    const lector = new FileReader();

    lector.onload = () => {
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(lector.result, "application/xml");

        if (kmlDoc.querySelector("parsererror")) {
            this.mostrarError("Error: No se pudo procesar el archivo KML.");
            return;
        }

        this.crearCamposKML(kmlDoc);
    };

    lector.onerror = () => {
        this.mostrarError("Error al leer el archivo KML.");
    };

    lector.readAsText(archivo);
}

crearCamposKML(kmlDoc) {
    const seccion = document.querySelector("section:nth-of-type(2)");

    // Eliminar cualquier mapa anterior
    const mapaExistente = seccion.querySelector("article:nth-of-type(2)");
    if (mapaExistente) mapaExistente.remove();

    // Crear contenedor para el mapa
    const mapaContainer = document.createElement("article");
  
    seccion.appendChild(mapaContainer);

    // Inicializar el mapa
    mapboxgl.accessToken = "pk.eyJ1IjoibmVzdG9yMjU0MCIsImEiOiJjbTNmMDhzNWQwanppMmxzYWR4NGhxdTg5In0.3yLmtGrb9H9BRfeqAq0rsQ";

    const map = new mapboxgl.Map({
        container: mapaContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 2,
        attributionControl: false
    });

    const allCoords = []; // Almacenar todas las coordenadas para ajustar el mapa

    map.on('load', () => {
        // Procesar cada <Placemark> en el archivo KML
        const placemarks = kmlDoc.querySelectorAll("Placemark");
        placemarks.forEach((placemark, index) => {
            // Líneas (LineString)
            if (placemark.querySelector("LineString")) {
                const coordinatesText = placemark.querySelector("LineString coordinates").textContent.trim();
                
                // Convertir coordenadas al formato correcto
                const coords = coordinatesText
                    .split(/\s+/)
                    .map(coord => {
                        const match = coord.match(/([\d.]+)°?([EW]),([\d.]+)°?([NS]),?([\d.]*)?/);
                        if (match) {
                            let [_, lon, lonDir, lat, latDir, alt] = match;
                            lon = parseFloat(lon) * (lonDir === 'W' ? -1 : 1); // Convertir longitud
                            lat = parseFloat(lat) * (latDir === 'S' ? -1 : 1); // Convertir latitud
                            return [lon, lat, parseFloat(alt) || 0];
                        }
                        return null;
                    })
                    .filter(coord => coord); // Filtrar coordenadas inválidas

                if (coords.length > 0) {
                    allCoords.push(...coords);

                    map.addSource(`line-${index}`, {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: coords.map(([lon, lat]) => [lon, lat]) // Mapear solo longitud y latitud
                            }
                        }
                    });

                    map.addLayer({
                        id: `line-${index}`,
                        type: 'line',
                        source: `line-${index}`,
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#FF0000',
                            'line-width': 4
                        }
                    });
                }
            }
        });

        // Ajustar el mapa para mostrar todas las coordenadas
        if (allCoords.length > 0) {
            const bounds = allCoords.reduce(
                (bounds, coord) => bounds.extend([coord[0], coord[1]]),
                new mapboxgl.LngLatBounds([allCoords[0][0], allCoords[0][1]], [allCoords[0][0], allCoords[0][1]])
            );
            map.fitBounds(bounds, { padding: 20 });
        } else {
            this.mostrarError("No se encontraron coordenadas válidas en el archivo KML.");
        }
    });
}

// Función para mostrar errores
mostrarError(mensaje) {
    alert(mensaje); // Puedes personalizar esta función para mostrar errores en el DOM
}




    // Tarea 8: Lectura y procesamiento de archivos de altimetría
    cargarSVG() {
        const fileInput = document.querySelector("section:nth-of-type(3) input[type='file']");
        const archivo = fileInput.files[0];

        if (!archivo) return;

        if (archivo.name.endsWith('.svg')) {
            this.deshabilitarCargaDeFicheroSVG();
            this.procesarSVG(archivo);
        } else {
            this.mostrarError("Error: ¡¡¡ Archivo no válido, debe ser un SVG !!!");
        }
    }

    procesarSVG(archivo) {
        const lector = new FileReader();

        lector.onload = () => {
            const svgContent = lector.result;
            this.crearCamposSVG(svgContent);
        };

        lector.onerror = () => {
            this.mostrarError("Error al leer el archivo SVG.");
        };

        lector.readAsText(archivo);
    }

    crearCamposSVG(svgContent) {
        const seccion = document.querySelector("section:nth-of-type(3)");

        const contenedorSVG = document.createElement("div");
        contenedorSVG.innerHTML = svgContent;
        seccion.appendChild(contenedorSVG);
    }

    // Método para mostrar errores
    mostrarError(mensaje) {
        const errorPara = document.createElement('p');
        errorPara.textContent = mensaje;
        document.body.appendChild(errorPara);
    }
}

// Instanciar la clase
const circuito = new Circuito();
