import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

type AdminJwtPayload = {
  sub: string;
  role: "admin";
  iat?: number;
  exp?: number;
};

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[env.JWT_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: "No autorizado (sin sesión)" });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AdminJwtPayload;

    if (!decoded || decoded.role !== "admin") {
      return res.status(401).json({ error: "No autorizado (token inválido)" });
    }

    (req as any).admin = { user: decoded.sub };

    return next();
  } catch {
    return res.status(401).json({ error: "No autorizado (token expirado o inválido)" });
  }
}