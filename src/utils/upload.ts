import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as generarNombreUnico } from 'uuid';
import { RUTAS } from './paths';
import { ErrorAplicacion } from '../middleware/error.middleware';

if (!fs.existsSync(RUTAS.CARPETA_IMAGENES)) {
  fs.mkdirSync(RUTAS.CARPETA_IMAGENES, { recursive: true });
}

const motorAlmacenamiento = multer.diskStorage({
  destination: (_req, _archivo, cb) => {
    cb(null, RUTAS.CARPETA_IMAGENES);
  },
  filename: (_req, archivo, cb) => {
    const extension = path.extname(archivo.originalname).toLowerCase();
    const nombreArchivo = `${generarNombreUnico()}${extension}`;
    cb(null, nombreArchivo);
  }
});

const filtroSeguridad = (_req: any, archivo: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const tiposMimePermitidos = ['image/jpeg', 'image/png', 'image/webp'];

  if (tiposMimePermitidos.includes(archivo.mimetype)) {
    cb(null, true);
  } else {
    cb(new ErrorAplicacion('Formato de imagen no permitido. Use JPG, PNG o WEBP.', 400));
  }
};

export const cargarImagen = multer({
  storage: motorAlmacenamiento,
  fileFilter: filtroSeguridad,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1 
  }
});