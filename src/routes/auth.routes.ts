import { Router, type Request, type Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { requireAdmin } from "../middleware/requireAdmin";

export const authRouter = Router();

function cookieOptions() {
  const isProd = env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    path: "/",
  };
}

/**
 * POST /api/auth/login
 * Body: { usuario, password }
 */
authRouter.post("/login", (req: Request, res: Response) => {
  const { usuario, password } = req.body ?? {};

  if (typeof usuario !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ error: "Body inválido. Se espera { usuario, password }" });
  }

  const userOk = usuario === env.ADMIN_USER;
  const passOk = password === env.ADMIN_PASSWORD;

  if (!userOk || !passOk) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const signOptions: SignOptions = {
    subject: env.ADMIN_USER,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  const token = jwt.sign(
    { role: "admin" },
    env.JWT_SECRET,
    signOptions
  );

  res.cookie(env.JWT_COOKIE_NAME, token, cookieOptions());

  return res.json({ ok: true });
});

/**
 * POST /api/auth/logout
 */
authRouter.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(env.JWT_COOKIE_NAME, { path: "/" });
  return res.json({ ok: true });
});

/**
 * GET /api/auth/me
 * Verifica si está autenticado
 */
authRouter.get("/me", (req: Request, res: Response) => {
  const token = req.cookies?.[env.JWT_COOKIE_NAME];

  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      sub?: string;
      role?: string;
    };

    if (decoded.role !== "admin") {
      return res.json({ authenticated: false });
    }

    return res.json({
      authenticated: true,
      usuario: decoded.sub ?? env.ADMIN_USER,
    });
  } catch {
    return res.json({ authenticated: false });
  }
});

/**
 * Ruta protegida de prueba
 */
authRouter.get("/protegido", requireAdmin, (req: Request, res: Response) => {
  const admin = (req as any).admin?.user ?? "admin";

  return res.json({
    ok: true,
    mensaje: `Hola ${admin}, estás autenticado correctamente.`,
  });
});