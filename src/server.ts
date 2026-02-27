import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { newsRouter } from "./routes/news.routes";
import { ensureDir } from "./utils/file.utils";
import { DATA_NEWS_DIR, UPLOADS_NEWS_DIR } from "./utils/paths";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Crear carpetas necesarias al iniciar
(async () => {
  await ensureDir(DATA_NEWS_DIR);
  await ensureDir(UPLOADS_NEWS_DIR);
})();

// Servir imágenes
app.use("/uploads", express.static("uploads"));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "noticias-backend-ts", env: env.NODE_ENV });
});

// Auth
app.use("/api/auth", authRouter);

// Noticias
app.use("/api/news", newsRouter);

app.listen(env.PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${env.PORT}`);
  console.log(`✅ CORS origin: ${env.CORS_ORIGIN}`);
});