export type EstadoNoticia = "publicada" | "borrador";

export interface Noticia {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagenUrl: string;
  fechaEvento: string;
  fechaPublicacion: string;
  fechaActualizacion: string;
  estado: EstadoNoticia;
}