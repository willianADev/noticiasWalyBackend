import fs from 'fs/promises';
import path from 'path';
import { Noticia } from '../types/noticia.types';
import { RUTAS } from './paths';

export class UtilidadesArchivo {
  private static async asegurarCarpeta(): Promise<void> {
    const dir = path.dirname(RUTAS.NOTICIAS_JSON);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  public static async leerNoticias(): Promise<Noticia[]> {
    await this.asegurarCarpeta();
    try {
      const contenido = await fs.readFile(RUTAS.NOTICIAS_JSON, 'utf-8');
      return JSON.parse(contenido) as Noticia[];
    } catch (error) {
      await fs.writeFile(RUTAS.NOTICIAS_JSON, JSON.stringify([]));
      return [];
    }
  }

  public static async guardarNoticias(noticias: Noticia[]): Promise<void> {
    await this.asegurarCarpeta();
    await fs.writeFile(RUTAS.NOTICIAS_JSON, JSON.stringify(noticias, null, 2));
  }
}