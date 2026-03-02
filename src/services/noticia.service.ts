import { BaseDatosJson } from '../utils/file.utils';
import { Noticia } from '../types/noticia.types';
import { EntradaCrearNoticia, EntradaActualizarNoticia } from '../validators/noticia.schema';
import crypto from 'node:crypto';

const dbNoticias = new BaseDatosJson('noticias.json');

export class ServicioNoticia {
  static async obtenerTodas(): Promise<Noticia[]> {
    const noticias = await dbNoticias.leer<Noticia>();
    return noticias.sort((a, b) => 
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
  }

  static async obtenerPorId(id: string): Promise<Noticia | null> {
    const noticias = await dbNoticias.leer<Noticia>();
    return noticias.find(n => n.id === id) || null;
  }

  static async crear(datos: EntradaCrearNoticia): Promise<Noticia> {
    const noticias = await dbNoticias.leer<Noticia>();
    
    const nuevaNoticia: Noticia = {
      id: crypto.randomUUID(),
      ...datos,
      fechaCreacion: new Date().toISOString()
    };

    noticias.push(nuevaNoticia);
    await dbNoticias.escribir(noticias);
    
    return nuevaNoticia;
  }

  static async actualizar(id: string, datos: EntradaActualizarNoticia): Promise<Noticia | null> {
    const noticias = await dbNoticias.leer<Noticia>();
    const indice = noticias.findIndex(n => n.id === id);

    if (indice === -1) return null;

    const noticiaActualizada = {
      ...noticias[indice],
      ...datos
    };

    noticias[indice] = noticiaActualizada;
    await dbNoticias.escribir(noticias);

    return noticiaActualizada;
  }

  static async eliminar(id: string): Promise<boolean> {
    const noticias = await dbNoticias.leer<Noticia>();
    const noticiasRestantes = noticias.filter(n => n.id !== id);

    if (noticias.length === noticiasRestantes.length) {
      return false;
    }

    await dbNoticias.escribir(noticiasRestantes);
    return true;
  }
}