import dotenv from "dotenv";
dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(`Falta la variable de entorno ${name} en el .env`);
  }
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? "4000"),

  // Login admin
  ADMIN_USER: process.env.ADMIN_USER ?? "admin",
  ADMIN_PASSWORD: required("ADMIN_PASSWORD"),

  // JWT
  JWT_SECRET: required("JWT_SECRET"),
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME ?? "admin_session",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};