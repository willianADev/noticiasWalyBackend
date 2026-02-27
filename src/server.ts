import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";

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

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "noticias-backend-ts", env: env.NODE_ENV });
});

// Rutas
app.use("/api/auth", authRouter);

app.listen(env.PORT, () => {
  console.log(`Backend corriendo en http://localhost:${env.PORT}`);
  console.log(`CORS origin: ${env.CORS_ORIGIN}`);
});