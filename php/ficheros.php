<?php
// Iniciar sesión
session_start();

// Limpiar sesión en cada carga
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    unset($_SESSION['importacion']);
}

// Iniciar el buffer de salida
ob_start();

// Configuración de la base de datos
$server = "localhost";
$user = "DBUSER2024";
$pass = "DBPSWD2024";
$dbname = "decadas";

// Rutas de directorios
$rutaSQL =  "C:/xampp/htdocs/F1Desktop/php/decadas.sql"; // Ruta relativa correcta
$rutaCarpetaCSV =  "C:/xampp/htdocs/F1Desktop/php/tabla.csv"; // Carpeta para almacenar los CSV

// Conexión a MySQL sin seleccionar base de datos inicialmente
$conn = new mysqli($server, $user, $pass);

// Verificar la conexión
if ($conn->connect_error) {
    die("<p>Error de conexión: " . $conn->connect_error . "</p>");
}

/**
 * Verifica si una base de datos existe.
 *
 * @param mysqli $conn Conexión a MySQL.
 * @param string $dbname Nombre de la base de datos.
 * @return bool Verdadero si existe, falso si no.
 */
function dbExiste($conn, $dbname) {
    $sql = "SHOW DATABASES LIKE '$dbname'";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        return true;
    }
    return false;
}

/**
 * Crea la base de datos y tablas desde el fichero SQL.
 *
 * @param mysqli $conn Conexión a MySQL sin seleccionar base de datos.
 * @param string $rutaSQL Ruta completa al fichero SQL.
 */
function crearBBDD($conn, $rutaSQL) {
    if (!file_exists($rutaSQL)) {
        echo "<p>El fichero SQL no existe en la ruta especificada: $rutaSQL</p>";
        return;
    }

    // Leer todo el contenido del fichero SQL
    $sql = file_get_contents($rutaSQL);

    if ($sql === false) {
        echo "<p>No se pudo leer el fichero SQL.</p>";
        return;
    }

    // Ejecutar las consultas múltiples
    if ($conn->multi_query($sql)) {
        do {
            // Vaciar el buffer de resultados
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->next_result());

        echo "<p>Base de datos y tablas creadas o ya existentes correctamente.</p>";
    } else {
        echo "<p>Error al ejecutar el fichero SQL: " . $conn->error . "</p>";
    }

    // Seleccionar la base de datos
    if (!$conn->select_db('decadas')) {
        echo "<p>Error al seleccionar la base de datos 'decadas': " . $conn->error . "</p>";
    } else {
        echo "<p>Base de datos 'decadas' seleccionada correctamente.</p>";
    }
}



function importarCSV($conn, $rutaCSV) {
    // Seleccionar la base de datos
    if (!$conn->select_db('decadas')) {
        die("<p>Error: No se pudo seleccionar la base de datos 'decadas'.</p>");
    }

    // Definir las décadas válidas
    $decadasValidas = ["50s", "60s", "70s", "80s", "90s", "2000s", "2010s"];

    // Limpiar todas las tablas antes de importar nuevos datos
    foreach ($decadasValidas as $decada) {
        $sqlTruncate = "TRUNCATE TABLE $decada";
        if (!$conn->query($sqlTruncate)) {
            echo "<p>Error al limpiar la tabla '$decada': " . $conn->error . "</p>";
        }
    }

    // Abrir el archivo CSV
    if (($handle = fopen($rutaCSV, "r")) !== FALSE) {
        $encabezados = fgetcsv($handle, 1000, ",", '"'); // Leer encabezados con delimitador de comillas dobles

        if (count($encabezados) !== 4) {
            echo "<p>Error: Formato incorrecto en los encabezados del CSV.</p>";
            fclose($handle);
            return;
        }

        $contador = 0;
        $errores = 0;

        // Leer línea por línea
        while (($datos = fgetcsv($handle, 1000, ",", '"')) !== FALSE) {
            if (count($datos) < 4) {
                $errores++;
                echo "<p>Fila incompleta encontrada. Registro omitido.</p>";
                continue;
            }

            // Asignar columnas
            $decada = trim($datos[0]);
            $nombre = trim($datos[1]);
            $nacionalidad = trim($datos[2]);
            $escuderia = trim($datos[3]);

            // Validar la década
            if (!in_array($decada, $decadasValidas)) {
                $errores++;
                echo "<p>Error: Década '$decada' inválida. Registro omitido.</p>";
                continue;
            }

            // Preparar y ejecutar la consulta
            $stmt = $conn->prepare("INSERT INTO $decada (Nombre, Nacionalidad, Escuderia) VALUES (?, ?, ?)");
            if ($stmt) {
                $stmt->bind_param("sss", $nombre, $nacionalidad, $escuderia);
                if ($stmt->execute()) {
                    $contador++;
                } else {
                    echo "<p>Error al insertar: " . $stmt->error . "</p>";
                    $errores++;
                }
                $stmt->close();
            } else {
                echo "<p>Error al preparar la consulta: " . $conn->error . "</p>";
                $errores++;
            }
        }

        fclose($handle);
        echo "<p>Importación completada: $contador registros importados. Errores: $errores.</p>";
    } else {
        echo "<p>Error: No se pudo abrir el archivo CSV.</p>";
    }
}

/**
 * Exporta datos desde una tabla a un fichero CSV.
 *
 * @param mysqli $conn Conexión a la base de datos.
 * @param string $decada Nombre de la década (e.g., "70s").
 * @param string $rutaCarpetaCSV Ruta a la carpeta CSV.
 */
function exportarCSV($conn, $decada, $rutaCarpetaCSV) {
    // Seleccionar la base de datos
    if (!$conn->select_db('decadas')) {
        echo "<p>Error: No se ha podido seleccionar la base de datos 'decadas'.</p>";
        return;
    }

    // Definir el nombre del fichero exportado
    $nombreFichero = "{$decada}_exported.csv";
    $rutaExport = $rutaCarpetaCSV . $nombreFichero;

    // Consultar los datos
    $sql = "SELECT Nombre, Nacionalidad, Escuderia FROM $decada";
    $result = $conn->query($sql);

    if ($result === FALSE) {
        echo "<p>Error al ejecutar la consulta para la década '$decada': " . $conn->error . "</p>";
        return;
    }

    if ($result->num_rows > 0) {
        // Abrir el fichero para escritura
        if (($file = fopen($rutaExport, "w")) !== FALSE) {
            // Escribir los encabezados
            fputcsv($file, array("Nombre", "Nacionalidad", "Escuderia"));

            // Escribir los datos
            while ($fila = $result->fetch_assoc()) {
                fputcsv($file, array($fila["Nombre"], $fila["Nacionalidad"], $fila["Escuderia"]));
            }

            fclose($file);
            echo "<p>Datos de la década '$decada' exportados correctamente a '$nombreFichero'.</p>";
        } else {
            echo "<p>Error: No se pudo crear el fichero '$nombreFichero'.</p>";
        }
    } else {
        echo "<p>No hay datos para exportar en la década '$decada'.</p>";
    }
}
function verificarDatos($conn, $decadas) {
    foreach ($decadas as $decada) {
        $sql = "SELECT COUNT(*) AS total FROM $decada";
        $result = $conn->query($sql);

        if ($result) {
            $row = $result->fetch_assoc();
            echo "<p>Tabla '$decada': " . $row['total'] . " registros encontrados.</p>";
        } else {
            echo "<p>Error al consultar la tabla '$decada': " . $conn->error . "</p>";
        }
    }
}

/**
 * Muestra los datos de cada década en tablas HTML.
 *
 * @param mysqli $conn Conexión a la base de datos.
 */
function mostrarTablas($conn) {
    // Definir las décadas
    $decadas = array("50s", "60s", "70s", "80s", "90s", "2000s", "2010s");

    foreach ($decadas as $decada) {
        echo "<h3>Pilotos de la Década $decada</h3>";

        // Consultar los datos
        $sql = "SELECT Nombre, Nacionalidad, Escuderia FROM $decada";
        $result = $conn->query($sql);

        if ($result === FALSE) {
            echo "<p>Error al consultar la tabla '$decada': " . $conn->error . "</p>";
            continue;
        }

        if ($result->num_rows > 0) {
            echo "<table border='1'>
                    <tr>
                        <th>Nombre</th>
                        <th>Nacionalidad</th>
                        <th>Escudería</th>
                    </tr>";
            while ($fila = $result->fetch_assoc()) {
                echo "<tr>
                        <td>" . htmlspecialchars($fila['Nombre']) . "</td>
                        <td>" . htmlspecialchars($fila['Nacionalidad']) . "</td>
                        <td>" . htmlspecialchars($fila['Escuderia']) . "</td>
                      </tr>";
            }
            echo "</table>";
        } else {
            echo "<p>No hay datos disponibles en la década '$decada'.</p>";
        }

        echo "<br>";
    }
}


$mensajeCrear = '';
$mensajeImportar = '';
$mensajeExportar = '';


if (isset($_POST['crear'])) {
    ob_start(); 
    crearBBDD($conn, $rutaSQL);
    $mensajeCrear = ob_get_clean();
}

if (isset($_POST['importar'])) {
    ob_start(); 

    if (isset($_FILES['csv_file']) && $_FILES['csv_file']['error'] == 0) {
        $filename = $_FILES['csv_file']['name'];
        $filetype = $_FILES['csv_file']['type'];

        $allowed = array("csv" => "text/csv", "application/vnd.ms-excel" => "text/csv", "text/plain" => "text/csv");
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        if (!array_key_exists($ext, $allowed)) {
            echo "<p>Error: Por favor, sube un archivo con extensión .csv</p>";
        } else {
          
            if (!$conn->select_db('decadas')) {
                echo "<p>Error: No se pudo seleccionar la base de datos 'decadas'.</p>";
                exit;
            }

           
            $decadas = ["50s", "60s", "70s", "80s", "90s", "2000s", "2010s"];
            foreach ($decadas as $decada) {
                $conn->query("DELETE FROM $decada"); 
            }

          
            $rutaCSV = dirname($rutaCarpetaCSV) . '/' . basename($filename);
            if (move_uploaded_file($_FILES['csv_file']['tmp_name'], $rutaCSV)) {
                importarCSV($conn, $rutaCSV);
                $_SESSION['importacion']['estado'] = true;
                $_SESSION['importacion']['mensaje'] = "Archivo importado correctamente.";
            } else {
                echo "<p>Error al mover el archivo CSV.</p>";
            }
        }
    } else {
        echo "<p>Error al subir el archivo CSV. Código de error: " . $_FILES['csv_file']['error'] . "</p>";
    }

    $mensajeImportar = ob_get_clean();
}



if (isset($_POST['exportar'])) {
    ob_start();
    $decadaExportar = $_POST['decada_exportar'];
    $decadasValidas = array("50s", "60s", "70s", "80s", "90s", "2000s", "2010s");
    if (in_array($decadaExportar, $decadasValidas)) {
        exportarCSV($conn, $decadaExportar, $rutaCarpetaCSV);
    } else {
        echo "<p>Década inválida para exportar.</p>";
    }
    $mensajeExportar = ob_get_clean();
}

?>
<!DOCTYPE HTML>
<html lang="es">
<head>

    <meta charset="UTF-8" />
    <title>F1 Desktop - Gestión de Pilotos por Década</title>
    <meta name="author" content="Nestor Fernandez Garcia" />
    <meta name="description" content="Aplicación para gestionar pilotos con más campeonatos en cada década de la F1" />
    <meta name="keywords" content="F1, Pilotos, Campeonatos, Décadas, CSV" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/imagenes/favicon.ico" />
</head>

<body>
    <header>
        <h1><a href="../index.html">F1 DESKTOP</a></h1>
        <nav>
            <a href="../index.html" title="Inicio F1 Desktop">Inicio</a>
            <a href="../piloto.html" title="Pestaña del piloto">Piloto</a>
            <a href="../noticias.html" title="Pestaña de noticias">Noticias</a>
            <a href="../calendario.html" title="Pestaña de calendario">Calendario</a>
            <a href="../viajes.php" title="Pestaña de viajes">Viajes</a>
            <a href="../juegos.html" class="active">Juegos</a>
            <a href="../circuito.html" title="Pestaña de circuito">Circuito</a>
            <a href="../meteorologia.html" title="Pestaña de meteorologia">Meteorologia</a>
        </nav>
    </header>

    <p>Estás en: <a href="index.html">Inicio</a> | <a href="juegos.html">Juegos</a>| Ficheros</p>

    <main>
        <!-- Sección para Crear la Base de Datos y Tablas -->
        <section>
            <h2>Crear Base de Datos y Tablas</h2>
            <form action="ficheros.php" method="POST">
                <input type="submit" value="Crear Base de Datos y Tablas" name="crear">
            </form>
            <?php if (!empty($mensajeCrear)) echo $mensajeCrear; ?>
        </section>

        <hr>

        <!-- Sección para Importar Pilotos desde CSV -->
        <section>
            <h2>Importar Pilotos desde CSV</h2>
            <form action="ficheros.php" method="POST" enctype="multipart/form-data">
                <label for="csv_file">Selecciona el fichero CSV (PilotosConMasCampeonatos.csv):</label>
                <input id="csv_file" type="file" name="csv_file" accept=".csv" required>
                <br><br>
                <input type="submit" value="Importar CSV" name="importar">
            </form>
            <?php if (!empty($mensajeImportar)) echo $mensajeImportar; ?>
        </section>

        <hr>

        <!-- Sección para Exportar Pilotos a CSV -->
        <section>
            <h2>Exportar Pilotos a CSV</h2>
            <form action="ficheros.php" method="POST">
                <fieldset>
                    <legend>Selecciona la Década</legend>
                    <label for="decada_50s">
                        <input id="decada_50s" type="radio" name="decada_exportar" value="50s" required> 50s
                    </label><br>
                    <label for="decada_60s">
                        <input id="decada_60s" type="radio" name="decada_exportar" value="60s" required> 60s
                    </label><br>
                    <label for="decada_70s">
                        <input id="decada_70s" type="radio" name="decada_exportar" value="70s" required> 70s
                    </label><br>
                    <label for="decada_80s">
                        <input id="decada_80s" type="radio" name="decada_exportar" value="80s" required> 80s
                    </label><br>
                    <label for="decada_90s">
                        <input id="decada_90s" type="radio" name="decada_exportar" value="90s" required> 90s
                    </label><br>
                    <label for="decada_2000s">
                        <input id="decada_2000s" type="radio" name="decada_exportar" value="2000s" required> 2000s
                    </label><br>
                    <label for="decada_2010s">
                        <input id="decada_2010s" type="radio" name="decada_exportar" value="2010s" required> 2010s
                    </label><br>
                </fieldset>
                <br>
                <input type="submit" value="Exportar CSV" name="exportar">
            </form>
            <?php if (!empty($mensajeExportar)) echo $mensajeExportar; ?>
        </section>

        <hr>

        <!-- Sección para Mostrar Pilotos por Década -->
        <section>
            <h2>Pilotos por Década</h2>
            <?php
                if (isset($_SESSION['importacion']) && $_SESSION['importacion']['estado'] === true) {
                    if ($conn->select_db('decadas')) {
                        mostrarTablas($conn);
                    } else {
                        echo "<p>No se pudo seleccionar la base de datos 'decadas'.</p>";
                    }
                } else {
                    echo "<p>Importa un archivo CSV para mostrar las tablas.</p>";
                }
            ?>
        </section>
    </main>
</body>
</html>
