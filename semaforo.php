<?php
// Clase Record
class Record {
    // Atributos de la clase
    public $server;
    public $user;
    public $pass;
    public $dbname;
    
    // Constructor sin parámetros
    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";
        // Crear conexión a la base de datos
        $this->conn = new mysqli($servername, $username, $password, $dbname);

        // Verificar conexión
        if ($this->conn->connect_error) {
            die("Conexión fallida: " . $this->conn->connect_error);
        }
    
        echo "Conexión exitosa a la base de datos.";
        $conn->close();
        }
        public function saveRecord($nombre, $apellidos, $nivel, $tiempo) {
            $stmt = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("sssd", $nombre, $apellidos, $nivel, $tiempo);
    
            if ($stmt->execute()) {
                echo "Récord guardado correctamente.";
            } else {
                echo "Error al guardar el récord: " . $stmt->error;
            }
    
            $stmt->close();
        }
    
        public function getTopRecords($nivel) {
            $stmt = $this->conn->prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
            $stmt->bind_param("s", $nivel);
    
            $stmt->execute();
            $result = $stmt->get_result();
    
            $records = [];
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }
    
            $stmt->close();
            return $records;
        }

}
?>



<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="Nestor Fernandez Garcia">
    <meta name="description" content="Juego de tiempo de reacción - Semáforo">
    <meta name="keywords" content="semáforo">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego del Semáforo</title>
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
	<link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" href="estilo/semaforo_grid.css" />
    <link rel="icon"  href="multimedia/imagenes/favicon.ico" />
</head>
<body>
    <header>
        <h1><a href="index.html">F1 DESKTOP</a></h1>
        <nav>
		<a title="Enlace a Inicio" href="index.html"> Inicio</a>
		<a title="Enlace a piloto" href="piloto.html">Piloto</a>
		<a title="Enlace a noticias" href="noticias.html">Noticias</a>
		<a title ="Enlace a calendario" href="calendario.html">Calendario</a>
        <a title="Enlace a viajes" href="viajes.php">Viajes</a>
		<a title="Enlace a juegos" href="juegos.html">Juegos</a>
		<a title="Enlace a circuito" href="circuito.html">Circuito</a>
		<a title="Enlace a meteorologia" href="meteorologia.html">Meteorologia</a>
        
	</nav>
    </header>
    <p>Estás en: Inicio >> Juegos >> Juego del Semáforo</p>
    <main>
        <section>
            <h2>Control del Semáforo</h2>
            <button data-action="start-game">Iniciar Juego</button>
            <button data-action="stop-game">Detener Juego</button>
        </section>
    </main>
    <script src="js/semaforo.js"></script>
</body>
</html>
