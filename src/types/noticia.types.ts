export type TipoNoticia = 'ACTUALIDAD' | 'DEPORTES' | 'TECNOLOGIA' | 'POLITICA' | 'AVISOS';

export interface Noticia {
  id: string;
  titulo: string;
  contenido: string;
  urlImagen?: string;
  tipo: TipoNoticia;
  fechaPublicacion: string;
  fechaCreacion: string;
}

export interface RespuestaPaginada<T> {
  datos: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}