import { Request, Response, NextFunction } from 'express';
import { ServicioNoticia } from '../services/noticia.service';

export class ControladorNoticia {
  private servicioNoticia: ServicioNoticia;

  constructor() {
    this.servicioNoticia = new ServicioNoticia();
  }

  crearNoticia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { titulo, contenido, tipo, fechaPublicacion } = req.body;
      
      let urlImagen: string | undefined = undefined;
      if (req.file) {
        urlImagen = `/imagenes/${req.file.filename}`;
      }

      const noticia = await this.servicioNoticia.crear({
        titulo,
        contenido,
        tipo,
        fechaPublicacion,
        urlImagen
      });

      res.status(201).json({
        estado: 'exito',
        datos: noticia
      });
    } catch (error) {
      next(error);
    }
  };

  obtenerNoticias = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pagina = Number(req.query.pagina);
      const limite = Number(req.query.limite);
      
      const resultado = await this.servicioNoticia.obtenerTodas(pagina, limite);
      
      res.status(200).json({
        estado: 'exito',
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  };
}