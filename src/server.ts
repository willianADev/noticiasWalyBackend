import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { entorno } from './config/env';
import rutasAutenticacion from './routes/auth.routes';
import rutasNoticias from './routes/noticia.routes';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.set('json spaces', 2);

// Rutas
app.use('/api/auth', rutasAutenticacion);
app.use('/api/noticias', rutasNoticias);

app.listen(entorno.PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${entorno.PUERTO}`);
});