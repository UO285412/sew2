document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("main > section");
    const geolocationButton = sections[0].querySelector("button");
    const geolocationArticle = sections[0].querySelector("article");
    const fileInput = sections[1].querySelector("input[type='file']");
    const fileContentArticle = sections[1].querySelector("article");
    const storedCircuitArticle = sections[2].querySelector("article");

    // Mostrar datos del circuito almacenado en Web Storage
    const storedCircuit = localStorage.getItem("lastCircuit");
    if (storedCircuit) {
        storedCircuitArticle.innerHTML = `<p>Último circuito: ${storedCircuit}</p>`;
    }

    // API de Geolocalización
    geolocationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const paragraphs = geolocationArticle.querySelectorAll("p span:last-child");
                    paragraphs[0].textContent = latitude.toFixed(6);
                    paragraphs[1].textContent = longitude.toFixed(6);
                },
                () => alert("No se pudo obtener la ubicación."),
                { enableHighAccuracy: true }
            );
        } else {
            alert("Geolocalización no soportada por este navegador.");
        }
    });

    // API de File
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                fileContentArticle.innerHTML = `<p>${reader.result}</p>`;
                localStorage.setItem("lastCircuit", file.name);
                storedCircuitArticle.innerHTML = `<p>Último circuito: ${file.name}</p>`;
            };
            reader.readAsText(file);
        }
    });
});
