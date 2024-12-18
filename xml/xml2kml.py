import xml.etree.ElementTree as ET

def verXPath(archivoXML, expresionXPath):
    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print('No se encuentra el archivo', archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando en el archivo XML =", archivoXML)
        exit()
    return arbol.getroot()

def escribirCoordenadas(kml, archivoXML, expXpath):
    # Definimos los espacios de nombres
    ns = {'ns': 'http://www.uniovi.es'}

    
    xPathLongitud = expXpath + "/ns:longitud"
    xPathLatitud = expXpath + "/ns:latitud"
    xPathAltitud = expXpath + "/ns:altitud"

    # Obtenemos la raíz del archivo XML
    raiz = verXPath(archivoXML, expXpath)

    # Buscamos los nodos de coordenadas
    nodosLongitud = raiz.findall(xPathLongitud, namespaces=ns)
    nodosLatitud = raiz.findall(xPathLatitud, namespaces=ns)
    nodosAltitud = raiz.findall(xPathAltitud, namespaces=ns)

    # Escribimos las coordenadas en el archivo KML
    for i in range(len(nodosLatitud)):
        linea = f"{nodosLatitud[i].text.strip()},{nodosLongitud[i].text.strip()},{nodosAltitud[i].text.strip()}\n"
        kml.write(linea)

def prologoKML(archivo, nombre):
    """Escribe en el archivo de salida el prólogo del archivo KML"""
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write(f"<name>{nombre}</name>\n")
    archivo.write("<LineString>\n")
    archivo.write("<extrude>1</extrude>\n")
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    """Escribe en el archivo de salida el epílogo del archivo KML"""
    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write('<Style id="lineaRoja">\n')  
    archivo.write("<LineStyle>\n")
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")

def main():
    path = "C:/Users/Usuario/Desktop/SEW/F1Desktop/xml/"
    nombreArchivoXML = input("Introduzca un archivo XML: ")
    miArchivoXml = path + nombreArchivoXML + ".xml"
    
    try:
        xml = open(miArchivoXml, 'r', encoding="utf-8")
    except IOError:
        print("No se puede abrir el archivo", miArchivoXml)
        exit()

    nombreArchivoKML = input("Introduzca el nombre del archivo KML: ")
    miArchivoKML = path + nombreArchivoKML + ".kml"

    try:
        kml = open(miArchivoKML, 'w', encoding="utf-8")
    except IOError:
        print("No se puede crear el archivo", nombreArchivoKML + ".kml")
        exit()

    prologoKML(kml, nombreArchivoXML)
    miXPath = ".//ns:tramo/ns:coordenadas" 
    escribirCoordenadas(kml, miArchivoXml, miXPath)
    epilogoKML(kml)

    kml.close()
    xml.close()

if __name__ == "__main__":
    main()
