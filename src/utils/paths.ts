import path from 'path';

const RAIZ_PROYECTO = process.cwd();

const CARPETA_DATOS = path.join(RAIZ_PROYECTO, 'datos');

export const RUTAS = {
  NOTICIAS_JSON: path.join(CARPETA_DATOS, 'noticias.json'),
  CARPETA_IMAGENES: path.join(CARPETA_DATOS, 'imagenes'),
  CARPETA_DATOS: CARPETA_DATOS,

  obtenerRutaImagen: (nombreArchivo: string) => path.join(CARPETA_DATOS, 'imagenes', nombreArchivo),
};

if (!RAIZ_PROYECTO) {
  throw new Error('No se pudo determinar la raíz del proyecto. El entorno de ejecución es inválido.');
}