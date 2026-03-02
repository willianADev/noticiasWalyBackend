import { Router } from 'express';
import { ControladorNoticia } from '../controllers/noticia.controller';
import { validarPeticion } from '../middleware/validarPeticion';
import { esquemaCrearNoticia, esquemaPaginacion } from '../validators/noticia.schema';
import { requireAdmin as requerirAdministrador } from '../middleware/requireAdmin';
import { cargarImagen } from '../utils/upload';

const enrutador = Router();
const controladorNoticia = new ControladorNoticia();

/**
 * @route   GET /api/v1/noticias
 * @desc    Obtener todas las noticias públicas (paginadas y ordenadas por fecha)
 * @access  Público
 */
enrutador.get(
  '/',
  validarPeticion(esquemaPaginacion),
  controladorNoticia.obtenerNoticias
);

/**
 * @route   POST /api/v1/noticias
 * @desc    Crear una nueva noticia con soporte para carga de imagen
 * @access  Privado (Solo Administrador)
 */
enrutador.post(
  '/',
  requerirAdministrador,
  cargarImagen.single('imagen'),
  validarPeticion(esquemaCrearNoticia),
  controladorNoticia.crearNoticia
);

export default enrutador;