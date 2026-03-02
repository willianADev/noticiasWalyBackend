import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';

// Importaciones de configuración y rutas
import { entorno } from './config/env';
import rutasNoticias from './routes/noticia.routes';
import { manejadorErrores } from './middleware/error.middleware';
import { RUTAS } from './utils/paths';

/**
 * Clase Servidor
 * Encapsula la configuración de Express para mantener el server.ts limpio y legible.
 */
class Servidor {
  public app: Application;

  constructor() {
    this.app = express();
    this.configurarSeguridad();
    this.configurarMiddlewares();
    this.configurarRutas();
    this.configurarManejadorErrores();
  }

  private configurarSeguridad(): void {
    // Helmet ayuda a proteger la app configurando varios encabezados HTTP.
    // 'crossOriginResourcePolicy: false' es vital para que las imágenes sean visibles desde el frontend.
    this.app.use(helmet({
      crossOriginResourcePolicy: false,
    }));

    // Configuración de CORS para permitir peticiones desde el frontend
    this.app.use(cors({
      origin: '*', // En producción, esto debería ser una lista blanca de dominios
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
  }

  private configurarMiddlewares(): void {
    // Parseo de cuerpos JSON para las peticiones API
    this.app.use(express.json());
    
    // Parseo de formularios simples si fuera necesario
    this.app.use(express.urlencoded({ extended: true }));

    /**
     * SERVIR ARCHIVOS ESTÁTICOS
     * Exponemos la carpeta de imágenes físicamente para que el frontend pueda acceder
     * vía URL (ej: http://localhost:3000/imagenes/nombre-archivo.jpg)
     */
    this.app.use('/imagenes', express.static(RUTAS.CARPETA_IMAGENES));
    
    console.log(`📂 Carpeta de imágenes servida desde: ${RUTAS.CARPETA_IMAGENES}`);
  }

  private configurarRutas(): void {
    // Prefijo de API versionado (Buena práctica para evitar romper el cliente en actualizaciones)
    this.app.use('/api/v1/noticias', rutasNoticias);

    // Ruta de salud del sistema (Health Check)
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ estado: 'ok', mensaje: 'Servidor operativo' });
    });
  }

  private configurarManejadorErrores(): void {
    /**
     * IMPORTANTE: El manejador de errores global debe ser SIEMPRE
     * el último middleware cargado en la pila de Express.
     */
    this.app.use(manejadorErrores);
  }

  public escuchar(): void {
    this.app.listen(entorno.PUERTO, () => {
      console.log(`===========================================`);
      console.log(`🚀 Servidor WalyBackend en puerto: ${entorno.PUERTO}`);
      console.log(`🛡️  Modo: ${entorno.ENTORNO}`);
      console.log(`📡 URL Base: http://localhost:${entorno.PUERTO}/api/v1/noticias`);
      console.log(`===========================================`);
    });
  }
}

// Inicialización y arranque del servidor
const servidor = new Servidor();
servidor.escuchar();