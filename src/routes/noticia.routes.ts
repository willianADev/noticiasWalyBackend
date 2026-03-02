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

const enrutador = Router();

enrutador.get('/', obtenerNoticias);
enrutador.get('/:id', obtenerNoticiaPorId);

enrutador.use(requerirAdmin);

enrutador.post('/', validarPeticion(EsquemaCrearNoticia), crearNoticia);
enrutador.put('/:id', validarPeticion(EsquemaActualizarNoticia), actualizarNoticia);
enrutador.delete('/:id', eliminarNoticia);

export default enrutador;