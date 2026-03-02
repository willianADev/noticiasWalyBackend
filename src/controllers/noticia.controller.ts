import { Request as Peticion, Response as Respuesta } from 'express';
import { ServicioNoticia } from '../services/noticia.service';
import { EntradaCrearNoticia, EntradaActualizarNoticia } from '../validators/noticia.schema';

export const obtenerNoticias = async (pet: Peticion, res: Respuesta) => {
  try {
    const noticias = await ServicioNoticia.obtenerTodas();
    return res.status(200).json({ exito: true, datos: noticias });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al obtener las noticias' });
  }
};

export const obtenerNoticiaPorId = async (pet: Peticion<{ id: string }>, res: Respuesta) => {
  try {
    const noticia = await ServicioNoticia.obtenerPorId(pet.params.id);
    if (!noticia) {
      return res.status(404).json({ exito: false, mensaje: 'Noticia no encontrada' });
    }
    return res.status(200).json({ exito: true, datos: noticia });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al obtener la noticia' });
  }
};

export const crearNoticia = async (pet: Peticion<{}, {}, EntradaCrearNoticia>, res: Respuesta) => {
  try {
    const nuevaNoticia = await ServicioNoticia.crear(pet.body);
    return res.status(201).json({ exito: true, mensaje: 'Noticia creada', datos: nuevaNoticia });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al crear la noticia' });
  }
};

export const actualizarNoticia = async (pet: Peticion<{ id: string }, {}, EntradaActualizarNoticia>, res: Respuesta) => {
  try {
    const noticiaActualizada = await ServicioNoticia.actualizar(pet.params.id, pet.body);
    if (!noticiaActualizada) {
      return res.status(404).json({ exito: false, mensaje: 'Noticia no encontrada para actualizar' });
    }
    return res.status(200).json({ exito: true, mensaje: 'Noticia actualizada', datos: noticiaActualizada });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al actualizar la noticia' });
  }
};

export const eliminarNoticia = async (pet: Peticion<{ id: string }>, res: Respuesta) => {
  try {
    const fueEliminada = await ServicioNoticia.eliminar(pet.params.id);
    if (!fueEliminada) {
      return res.status(404).json({ exito: false, mensaje: 'Noticia no encontrada para eliminar' });
    }
    return res.status(200).json({ exito: true, mensaje: 'Noticia eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ exito: false, mensaje: 'Error al eliminar la noticia' });
  }
};