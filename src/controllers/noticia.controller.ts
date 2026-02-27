import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  actualizarNoticiaPATCH,
  actualizarNoticiaPUT,
  borrarNoticia,
  crearNoticia,
  listarNoticiasAdmin,
  listarNoticiasPublicas,
  obtenerNoticia,
} from "../services/noticia.service";
import {
  noticiaCrearSchema,
  noticiaPutSchema,
  noticiaPatchSchema,
} from "../validators/noticia.schema";

function firstString(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}

function normalizeBody(body: any) {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(body ?? {})) {
    out[k] = firstString(body[k]);
  }
  return out;
}

function getQuery(req: Request, key: string): string | undefined {
  return firstString((req.query as any)?.[key]);
}

function getParam(req: Request, key: string): string | undefined {
  return firstString((req.params as any)?.[key]);
}

function parseIntQuery(req: Request, key: string, def: number) {
  const s = getQuery(req, key);
  if (!s) return def;
  const n = Number(s);
  return Number.isFinite(n) ? n : def;
}

function zodErrorToMessage(err: ZodError) {
  return err.issues.map((i) => i.message).join(" | ");
}

/**
 * PUBLIC: GET /api/news
 * Query opcional: ?q=&page=&limit=
 */
export async function getNewsPublic(req: Request, res: Response) {
  try {
    const q = getQuery(req, "q");
    const page = parseIntQuery(req, "page", 1);
    const limit = parseIntQuery(req, "limit", 10);

    const result = await listarNoticiasPublicas({ q, page, limit });
    return res.json(result);
  } catch {
    return res.status(500).json({ error: "Error listando noticias" });
  }
}

/**
 * ADMIN: GET /api/news/admin/lista
 */
export async function getNewsAdmin(_req: Request, res: Response) {
  try {
    const items = await listarNoticiasAdmin();
    return res.json({ total: items.length, items });
  } catch {
    return res.status(500).json({ error: "Error listando noticias (admin)" });
  }
}

/**
 * PUBLIC: GET /api/news/:id
 * Solo devuelve si estado === "publicada"
 */
export async function getNewsById(req: Request, res: Response) {
  try {
    const id = getParam(req, "id");
    if (!id) return res.status(400).json({ error: "Falta parámetro id" });

    const n = await obtenerNoticia(id);
    if (!n) return res.status(404).json({ error: "No existe" });

    if (n.estado !== "publicada") {
      return res.status(404).json({ error: "No existe" });
    }

    return res.json(n);
  } catch {
    return res.status(500).json({ error: "Error obteniendo noticia" });
  }
}

/**
 * ADMIN: GET /api/news/admin/:id
 * Devuelve incluso borradores
 */
export async function getNewsByIdAdmin(req: Request, res: Response) {
  try {
    const id = getParam(req, "id");
    if (!id) return res.status(400).json({ error: "Falta parámetro id" });

    const n = await obtenerNoticia(id);
    if (!n) return res.status(404).json({ error: "No existe" });

    return res.json(n);
  } catch {
    return res.status(500).json({ error: "Error obteniendo noticia (admin)" });
  }
}

/**
 * ADMIN: POST /api/news (multipart/form-data)
 * Campos: titulo, resumen, contenido, fechaEvento, estado
 * Archivo: imagen
 */
export async function postNews(req: Request, res: Response) {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ error: "La imagen es obligatoria (campo 'imagen')" });
    }

    const normalized = normalizeBody(req.body);
    const data = noticiaCrearSchema.parse(normalized);

    const noticia = await crearNoticia(data, {
      buffer: file.buffer,
      mime: file.mimetype,
    });

    return res.status(201).json(noticia);
  } catch (e: any) {
    if (e instanceof ZodError) {
      return res.status(400).json({ error: zodErrorToMessage(e) });
    }
    return res.status(400).json({ error: e?.message ?? "Error creando noticia" });
  }
}

/**
 * ADMIN: PUT /api/news/:id (multipart/form-data)
 * Reemplazo completo, imagen opcional
 */
export async function putNews(req: Request, res: Response) {
  try {
    const id = getParam(req, "id");
    if (!id) return res.status(400).json({ error: "Falta parámetro id" });

    const normalized = normalizeBody(req.body);
    const data = noticiaPutSchema.parse(normalized);

    const file = (req as any).file as Express.Multer.File | undefined;

    const updated = await actualizarNoticiaPUT(
      id,
      data,
      file ? { buffer: file.buffer, mime: file.mimetype } : undefined
    );

    if (!updated) return res.status(404).json({ error: "No existe" });
    return res.json(updated);
  } catch (e: any) {
    if (e instanceof ZodError) {
      return res.status(400).json({ error: zodErrorToMessage(e) });
    }
    return res.status(400).json({ error: e?.message ?? "Error actualizando noticia" });
  }
}

/**
 * ADMIN: PATCH /api/news/:id (JSON)
 * Parcial, sin imagen
 */
export async function patchNews(req: Request, res: Response) {
  try {
    const id = getParam(req, "id");
    if (!id) return res.status(400).json({ error: "Falta parámetro id" });

    const data = noticiaPatchSchema.parse(req.body ?? {});
    const updated = await actualizarNoticiaPATCH(id, data);

    if (!updated) return res.status(404).json({ error: "No existe" });
    return res.json(updated);
  } catch (e: any) {
    if (e instanceof ZodError) {
      return res.status(400).json({ error: zodErrorToMessage(e) });
    }
    return res.status(400).json({ error: e?.message ?? "Error actualizando parcialmente" });
  }
}

/**
 * ADMIN: DELETE /api/news/:id
 */
export async function deleteNews(req: Request, res: Response) {
  try {
    const id = getParam(req, "id");
    if (!id) return res.status(400).json({ error: "Falta parámetro id" });

    const ok = await borrarNoticia(id);
    if (!ok) return res.status(404).json({ error: "No existe" });

    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Error borrando noticia" });
  }
}