import xml.etree.ElementTree as ET

def verXPath(archivoXML):
    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print('No se encuentra el archivo', archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando el archivo XML =", archivoXML)
        exit()
    return arbol.getroot()

def generarSVG(svg, archivoXML, ns):
    raiz = verXPath(archivoXML)
    tramos = raiz.findall(".//ns:tramo", ns)

    distancia_total = 0.0
    puntos = []

    for tramo in tramos:
        # Extraer distancia y altitud en cada tramo
        distancia = tramo.find("ns:distancia", ns)
        altitud = tramo.find("ns:coordenadas/ns:altitud", ns)

        if distancia is not None and altitud is not None:
            campoEjeX = float(distancia.text.strip())/5
            campoEjeY = float(altitud.text.strip())*10
            distancia_total = round(distancia_total + campoEjeX, 2)
            
            # Agregar los puntos a la lista en el formato "x,y"
            puntos.append(f"{distancia_total},{campoEjeY}\n")

    # Escribir la etiqueta <polyline> con los puntos generados
    svg.write(f'<polyline points="{" ".join(puntos)}" ')
    svg.write('style="fill:white;stroke:red;stroke-width:4" />\n')

    
def prologoSVG(archivo, nombre):
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<svg xmlns="http://www.w3.org/2000/svg">\n')
    

def epilogoSVG(archivo):
    archivo.write("</svg>\n")

def main():
    path = "C:/Users/Usuario/Desktop/SEW/F1Desktop/xml/"
    nombreArchivoXML = input("Introduzca un archivo XML: ")
    miArchivoXml = path + nombreArchivoXML + ".xml"

    try:
        with open(miArchivoXml, 'r', encoding="utf-8") as xml:
            nombreArchivoSvg = input("Introduzca el nombre del archivo SVG: ")
            miArchivoSvg = path + nombreArchivoSvg + ".svg"
            try:
                with open(miArchivoSvg, 'w', encoding="utf-8") as svg:
                    prologoSVG(svg, nombreArchivoXML)
                    ns = {'ns': 'http://www.uniovi.es'}
                    
                    # Generar el archivo SVG
                    generarSVG(svg, miArchivoXml, ns)
                    
                    epilogoSVG(svg)
            except IOError:
                print("No se puede crear el archivo", nombreArchivoSvg)
                exit()
    except IOError:
        print("No se puede abrir el archivo", miArchivoXml)
        exit()

if __name__ == "__main__":
    main()
