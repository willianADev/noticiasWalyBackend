import { Router } from 'express';
import { 
  obtenerNoticias, 
  obtenerNoticiaPorId, 
  crearNoticia, 
  actualizarNoticia, 
  eliminarNoticia 
} from '../controllers/noticia.controller';
import { validarPeticion } from '../middleware/validarPeticion';
import { requerirAdmin } from '../middleware/requireAdmin';
import { EsquemaCrearNoticia, EsquemaActualizarNoticia } from '../validators/noticia.schema';
import { cargarImagen } from '../utils/upload';

const enrutador = Router();

// Rutas Públicas
enrutador.get('/', obtenerNoticias);
enrutador.get('/:id', obtenerNoticiaPorId);

// Rutas Privadas
enrutador.use(requerirAdmin);

enrutador.post(
  '/', 
  cargarImagen.single('imagen'),
  validarPeticion(EsquemaCrearNoticia), 
  crearNoticia
);

enrutador.put(
  '/:id', 
  cargarImagen.single('imagen'), 
  validarPeticion(EsquemaActualizarNoticia), 
  actualizarNoticia
);

enrutador.delete('/:id', eliminarNoticia);

export default enrutador;