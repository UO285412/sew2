<?php
class Carrusel {
    private $capital;
    private $pais;
    private $apiKey = "f3a69d2c5dc8783a4194ba3ffd9b167d"; // Sustituye con tu API Key de Flickr
    private $endpoint = "https://www.flickr.com/services/rest/";

    public function __construct($capital, $pais) {
        $this->capital = $capital;
        $this->pais = $pais;
    }

    /**
     * Llama a la API de Flickr para obtener fotos.
     */
    public function obtenerFotos() {
        $query = "{$this->capital}, {$this->pais}";
        $params = [
            "method" => "flickr.photos.search",
            "api_key" => $this->apiKey,
            "format" => "json",
            "nojsoncallback" => 1,
            "per_page" => 10,
            "text" => $query,
            "sort" => "relevance"
        ];

        $url = $this->endpoint . "?" . http_build_query($params);
        $response = file_get_contents($url);
        $data = json_decode($response, true);

        if ($data && $data['stat'] === 'ok') {
            return $data['photos']['photo'];
        }

        return [];
    }

    /**
     * Genera el HTML del carrusel de fotos.
     */
    public function generarCarrusel() {
        $fotos = $this->obtenerFotos();
        if (empty($fotos)) {
            return "<p>No se encontraron fotos para {$this->capital}, {$this->pais}.</p>";
        }

        $carruselHtml = '<section><h3>Carrusel de Fotos</h3><div class="carrusel">';
        foreach ($fotos as $foto) {
            $fotoUrl = "https://live.staticflickr.com/{$foto['server']}/{$foto['id']}_{$foto['secret']}_q.jpg";
            $carruselHtml .= "<img src='{$fotoUrl}' alt='Foto de {$this->capital}, {$this->pais}' />";
        }
        $carruselHtml .= '</div></section>';
        return $carruselHtml;
    }
}
?>


<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="Nestor Fernandez Garcia" />
    <meta name="description" content="Viajes F1" />
    <meta name="keywords" content="viajes" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Viajes</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" /> 
    <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css" />
    <link rel="icon"  href="multimedia/imagenes/favicon.ico" />
    <script src="js/viajes.js"></script>
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js" defer></script>
</head>

<body>
    <header>
        <h1><a href="index.html"> F1 DESKTOP</a></h1>
        <nav>
            <a title="Enlace a Inicio" href="index.html"> Inicio</a>
            <a title="Enlace a piloto" href="piloto.html">Piloto</a>
            <a title="Enlace a noticias" href="noticias.html">Noticias</a>
            <a title="Enlace a calendario" href="calendario.html">Calendario</a>
            <a href="viajes.html" class="active">Viajes</a>
            <a title="Enlace a juegos" href="juegos.html">Juegos</a>
            <a title="Enlace a circuito" href="circuito.html">Circuito</a>
            <a title="Enlace a meteorologia" href="meteorologia.html">Meteorologia</a>
        </nav>
    </header>

    <p>Estás en: Inicio | Viajes</p>

    <main>
        <h2>Viajes para ir a la carrera</h2>
         <!-- Mostrar el carrusel de fotos -->
         <?php echo generarCarrusel(); ?>
        <button type="button" aria-label="Mostrar mapas">Mostrar Mapas</button>
            <h3>Ubicación Actual</h3>
            <article></article> <!-- Aquí se muestra la ubicación o el mensaje de error -->
            <h3>Mapa Estático</h3>
            <article></article> <!-- Aquí se muestra el mapa estático -->
            <h3>Mapa dinámico</h3>
            <div></div> <!-- Bloque anónimo para el mapa -->
    </main>

</body>
</html>
