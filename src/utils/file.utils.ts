import { readFile as leerArchivo, writeFile as escribirArchivo, mkdir as crearDirectorio } from 'node:fs/promises';
import { existsSync as existeArchivo } from 'node:fs';
import ruta from 'node:path';

class CandadoAsincrono {
  private promesaBloqueo: Promise<void> = Promise.resolve();

  async adquirir<T>(tarea: () => Promise<T>): Promise<T> {
    const promesaAnterior = this.promesaBloqueo;
    let resolverBloqueo: () => void;

    this.promesaBloqueo = new Promise((resolver) => {
      resolverBloqueo = resolver;
    });

    await promesaAnterior;
    try {
      return await tarea();
    } finally {
      resolverBloqueo!();
    }
  }
}

const bloqueoArchivo = new CandadoAsincrono();

export class BaseDatosJson {
  private rutaArchivo: string;

  constructor(nombreArchivo: string) {
    this.rutaArchivo = ruta.resolve(__dirname, `../../../data/${nombreArchivo}`);
  }

  async inicializar(): Promise<void> {
    const directorio = ruta.dirname(this.rutaArchivo);
    if (!existeArchivo(directorio)) {
      await crearDirectorio(directorio, { recursive: true });
    }
    if (!existeArchivo(this.rutaArchivo)) {
      await escribirArchivo(this.rutaArchivo, JSON.stringify([]), 'utf-8');
    }
  }

  async leer<T>(): Promise<T[]> {
    return bloqueoArchivo.adquirir(async () => {
      await this.inicializar();
      const datosCrudos = await leerArchivo(this.rutaArchivo, 'utf-8');
      if (!datosCrudos.trim()) return [];
      return JSON.parse(datosCrudos) as T[];
    });
  }

  async escribir<T>(datos: T[]): Promise<void> {
    return bloqueoArchivo.adquirir(async () => {
      await this.inicializar();
      await escribirArchivo(this.rutaArchivo, JSON.stringify(datos, null, 2), 'utf-8');
    });
  }
}