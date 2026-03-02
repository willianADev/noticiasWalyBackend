export type CategoriaNoticia = 'nacionales' | 'internacionales' | 'deportes' | 'tecnologia';

export interface Noticia {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: CategoriaNoticia;
  imagenUrl?: string;
  fechaCreacion: string;
}