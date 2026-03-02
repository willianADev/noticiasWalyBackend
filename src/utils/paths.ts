import ruta from 'node:path';

const RAIZ_PROYECTO = process.cwd();

export const CARPETA_DATOS = ruta.join(RAIZ_PROYECTO, 'data');
export const CARPETA_PUBLICA = ruta.join(RAIZ_PROYECTO, 'public');
export const CARPETA_SUBIDAS = ruta.join(CARPETA_PUBLICA, 'uploads');

export const RUTAS = {
  NOTICIAS_JSON: ruta.join(CARPETA_DATOS, 'noticias.json'),
  CARPETA_IMAGENES: CARPETA_SUBIDAS,

  obtenerRutaImagen: (nombreArchivo: string) => ruta.join(CARPETA_SUBIDAS, nombreArchivo),
};

if (!RAIZ_PROYECTO) {
  throw new Error('No se pudo determinar la raíz del proyecto. El entorno de ejecución es inválido.');
}