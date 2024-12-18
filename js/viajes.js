class Viajes {
    constructor() {
        this.latitude = null;
        this.longitude = null;
        this.errorMessage = null;

        this.initGeolocation();
        this.initLoadMapsButton(); // Configurar botón
    }

    initGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this.storePosition.bind(this),
                this.handleError.bind(this)
            );
        } else {
            this.errorMessage = "Geolocalización no soportada por el navegador.";
            this.displayError();
        }
    }

    storePosition(position) {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.displayPosition();
    }

    handleError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.errorMessage = "Permiso denegado para geolocalización.";
                break;
            case error.POSITION_UNAVAILABLE:
                this.errorMessage = "Información de geolocalización no disponible.";
                break;
            case error.TIMEOUT:
                this.errorMessage = "Tiempo de espera agotado para obtener la ubicación.";
                break;
            case error.UNKNOWN_ERROR:
                this.errorMessage = "Error desconocido en la geolocalización.";
                break;
        }
        this.displayError();
    }

    displayPosition() {
        const locationArticle = document.querySelector("main > article:nth-of-type(2)");
        
        const latElement = document.createElement("p");
        latElement.textContent = "Latitud: " + this.latitude;
        locationArticle.appendChild(latElement);

        const lonElement = document.createElement("p");
        lonElement.textContent = "Longitud: " + this.longitude;
        locationArticle.appendChild(lonElement);
    }

    displayError() {
        const main = document.querySelector("main");
        const errorParagraph = document.createElement("p");
        errorParagraph.textContent = this.errorMessage;
        main.appendChild(errorParagraph);
    }

    displayStaticMap() {
        const mapArticle = document.querySelector("main > article:nth-of-type(3) > div");

        const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+fb0e55(${this.longitude},${this.latitude})/${this.longitude},${this.latitude},16,0/400x500?access_token=pk.eyJ1IjoibmVzdG9yMjU0MCIsImEiOiJjbTNmMDhzNWQwanppMmxzYWR4NGhxdTg5In0.3yLmtGrb9H9BRfeqAq0rsQ`;

        mapArticle.innerHTML = `<img src="${mapUrl}" alt="Mapa estático de Mapbox">`;
    }

    displayDynamicMap() {
        const mapContainer = document.querySelector("main > article:nth-of-type(4) > div");

        mapboxgl.accessToken = "pk.eyJ1IjoibmVzdG9yMjU0MCIsImEiOiJjbTNmMDhzNWQwanppMmxzYWR4NGhxdTg5In0.3yLmtGrb9H9BRfeqAq0rsQ";

        const map = new mapboxgl.Map({
            container: mapContainer,
            style: "mapbox://styles/mapbox/streets-v9",
            center: [this.longitude, this.latitude],
            zoom: 14
        });

        new mapboxgl.Marker()
            .setLngLat([this.longitude, this.latitude])
            .addTo(map);
    }

    initLoadMapsButton() {
        // Seleccionamos el botón que está en main, y que no está dentro de los article
        const button = document.querySelector("main > button");
        if (button) {
            button.addEventListener("click", () => {
                if (this.latitude && this.longitude) {
                    this.displayStaticMap();
                    this.displayDynamicMap();
                } else {
                    alert("La geolocalización aún no se ha completado.");
                }
            });
        }
    }
    


    inicializarCarrusel() {
        const slides = document.querySelectorAll("article:nth-of-type(1) > img");
        const nextSlide = document.querySelector("article:nth-of-type(1) button:nth-of-type(1)");

        let curSlide = 0;
        let maxSlide = slides.length - 1;

        nextSlide.addEventListener("click", function () {
            if (curSlide === maxSlide) {
                curSlide = 0;
            } else {
                curSlide++;
            }

            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide);
                $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        });

        const prevSlide = document.querySelector("article:nth-of-type(1) button:nth-of-type(2)");

        prevSlide.addEventListener("click", function () {
            if (curSlide === 0) {
                curSlide = maxSlide;
            } else {
                curSlide--;
            }

            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide);
                $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        });
    }
}
