import multer from 'multer';
import ruta from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { RUTAS } from './paths';

if (!fs.existsSync(RUTAS.CARPETA_IMAGENES)) {
  fs.mkdirSync(RUTAS.CARPETA_IMAGENES, { recursive: true });
}

const motorAlmacenamiento = multer.diskStorage({
  destination: (pet, archivo, cb) => {
    cb(null, RUTAS.CARPETA_IMAGENES);
  },
  filename: (pet, archivo, cb) => {
    const extension = ruta.extname(archivo.originalname).toLowerCase();
    const nombreArchivo = `${crypto.randomUUID()}${extension}`;
    cb(null, nombreArchivo);
  }
});

const filtroSeguridad = (pet: any, archivo: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const tiposMimePermitidos = ['image/jpeg', 'image/png', 'image/webp'];

  if (tiposMimePermitidos.includes(archivo.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no permitido. Usa JPG, PNG o WEBP.'));
  }
};

export const cargarImagen = multer({
  storage: motorAlmacenamiento,
  fileFilter: filtroSeguridad,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite estricto de 5 MB
  }
});