import { v4 as uuidv4 } from 'uuid';
import { Noticia, RespuestaPaginada } from '../types/noticia.types';
import { UtilidadesArchivo } from '../utils/file.utils';

export class ServicioNoticia {
  
  public async crear(datos: Omit<Noticia, 'id' | 'fechaCreacion'>): Promise<Noticia> {
    const noticias = await UtilidadesArchivo.leerNoticias();
    const ahora = new Date().toISOString();

    const nuevaNoticia: Noticia = {
      id: uuidv4(),
      ...datos,
      fechaPublicacion: datos.fechaPublicacion || ahora,
      fechaCreacion: ahora,
    };

    noticias.push(nuevaNoticia);
    await UtilidadesArchivo.guardarNoticias(noticias);

    return nuevaNoticia;
  }

  public async obtenerTodas(pagina: number, limite: number): Promise<RespuestaPaginada<Noticia>> {
    const noticias = await UtilidadesArchivo.leerNoticias();
    const ahoraMs = new Date().getTime();
    const noticiasPublicas = noticias.filter((n: Noticia) => 
      new Date(n.fechaPublicacion).getTime() <= ahoraMs
    );

    noticiasPublicas.sort((a, b) => 
      new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
    );

    const inicio = (pagina - 1) * limite;
    const datosPaginados = noticiasPublicas.slice(inicio, inicio + limite);

    return {
      datos: datosPaginados,
      total: noticiasPublicas.length,
      pagina,
      limite,
      totalPaginas: Math.ceil(noticiasPublicas.length / limite)
    };
  }
}