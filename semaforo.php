<?php
// Clase Record
class Record {
    // Atributos de la clase
    private $server;
    private $user;
    private $pass;
    private $dbname;
    public $conn;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";

        // Crear conexión a la base de datos
        $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        // Verificar conexión
        if ($this->conn->connect_error) {
            die("Conexión fallida: " . $this->conn->connect_error);
        }

        // Puedes comentar o eliminar este echo para evitar mostrar mensajes en producción
        // echo "Conexión exitosa a la base de datos.";
    }

    public function saveRecord($nombre, $apellidos, $nivel, $tiempo) {
        $stmt = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        if (!$stmt) {
            echo "<p>Error en la preparación de la consulta: " . $this->conn->error . "</p>";
            return;
        }
        $stmt->bind_param("sssd", $nombre, $apellidos, $nivel, $tiempo);

        if ($stmt->execute()) {
            echo "<p>Récord guardado correctamente.</p>";
        } else {
            echo "<p>Error al guardar el récord: " . $stmt->error . "</p>";
        }

        $stmt->close();
    }

    public function getTopRecords($nivel) {
        $stmt = $this->conn->prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
        if (!$stmt) {
            echo "<p>Error en la preparación de la consulta: " . $this->conn->error . "</p>";
            return [];
        }
        $stmt->bind_param("s", $nivel);

        if (!$stmt->execute()) {
            echo "<p>Error al ejecutar la consulta: " . $stmt->error . "</p>";
            return [];
        }

        $result = $stmt->get_result();

        $records = [];
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }

        $stmt->close();
        return $records;
    }

    public function __destruct() {
        // Cerrar la conexión al finalizar el script
        if ($this->conn) {
            $this->conn->close();
        }
    }
}

// Comprobar si se ha enviado el formulario de récord
$record = new Record();
$recordsMostrados = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Datos enviados desde el formulario de récord
    $nombre = trim($_POST['nombre'] ?? '');
    $apellidos = trim($_POST['apellidos'] ?? '');
    $nivel = trim($_POST['nivel'] ?? '');
    $tiempo = isset($_POST['tiempo']) ? floatval($_POST['tiempo']) : 0.0;

    // Validar datos (opcional pero recomendado)
    if ($nombre && $apellidos && $nivel && $tiempo > 0) {
        // Guardar el récord
        $record->saveRecord($nombre, $apellidos, $nivel, $tiempo);

        // Obtener los 10 mejores récords para el nivel actual
        $topRecords = $record->getTopRecords($nivel);
        $recordsMostrados = true;
    } else {
        echo "<p>Por favor, completa todos los campos correctamente.</p>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Nestor Fernandez Garcia" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego del Semáforo</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <script src="js/semaforo.js" defer></script>
    <link rel="stylesheet" href="estilo/semaforo_grid.css" />
    <link rel="icon" href="multimedia/imagenes/favicon.ico" />
</head>
<body>
    <header>
        <h1><a href="index.html">F1 DESKTOP</a></h1>
        <nav>
            <a title="Enlace a Inicio" href="index.html">Inicio</a>
            <a title="Enlace a piloto" href="piloto.html">Piloto</a>
            <a title="Enlace a noticias" href="noticias.html">Noticias</a>
            <a title="Enlace a calendario" href="calendario.html">Calendario</a>
            <a title="Enlace a viajes" href="viajes.php">Viajes</a>
            <a title="Enlace a juegos" href="juegos.html">Juegos</a>
            <a title="Enlace a circuito" href="circuito.html">Circuito</a>
            <a title="Enlace a meteorologia" href="meteorologia.html">Meteorología</a>
        </nav>
    </header>
    <p>Estás en: <a href="index.html">Inicio</a> | <a href="juegos.html">Juegos</a>| Juego del Semaforo</p>
    
    <main>
    <?php
if ($recordsMostrados) {
    echo "<section>";
    echo "<h2>Top 10 Récords - Nivel " . htmlspecialchars($_POST['nivel']) . "</h2>";
    echo "<ol>";
    foreach ($topRecords as $r) {
        echo "<li>" . htmlspecialchars($r['nombre']) . " " . htmlspecialchars($r['apellidos']) . " - " . htmlspecialchars($r['tiempo']) . " segundos</li>";
    }
    echo "</ol>";
    echo "</section>";

    echo "<script>
    document.addEventListener('DOMContentLoaded', () => {
        const main = document.querySelector('main');
        main.innerHTML = '';
       
    });
    </script>";
}



    ?>
    </main>
    <script src="js/semaforo.js" defer></script>
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        window.semaforo = new Semaforo();
    });
    </script> 
</body>
</html>
