import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { Noticia, EstadoNoticia } from "../types/noticia.types";
import { DATA_NEWS_DIR, UPLOADS_NEWS_DIR, noticiaJsonPath } from "../utils/paths";
import { ensureDir, fileExists, readJson, safeUnlink, writeJsonAtomic } from "../utils/file.utils";
import { extFromMime } from "../utils/upload";

function nowIso() {
  return new Date().toISOString();
}

function isValidFechaEvento(v: string) {
  // formato simple YYYY-MM-DD
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

export type CrearNoticiaInput = {
  titulo: string;
  resumen: string;
  contenido: string;
  fechaEvento: string; // YYYY-MM-DD
  estado?: EstadoNoticia; // default publicada
};

export type ActualizarNoticiaFullInput = CrearNoticiaInput;

export type PatchNoticiaInput = Partial<CrearNoticiaInput>;

async function listJsonFiles(dir: string) {
  await ensureDir(dir);
  const files = await fs.readdir(dir);
  return files.filter((f) => f.endsWith(".json"));
}

export async function listarNoticiasPublicas(opts?: { q?: string; page?: number; limit?: number }) {
  const all = await listarNoticiasAdmin(); // luego filtramos
  let items = all.filter((n) => n.estado === "publicada");

  if (opts?.q && opts.q.trim()) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (n) =>
        n.titulo.toLowerCase().includes(q) ||
        n.resumen.toLowerCase().includes(q) ||
        n.contenido.toLowerCase().includes(q)
    );
  }

  // Orden: publicación desc
  items.sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime());

  const page = Math.max(1, opts?.page ?? 1);
  const limit = Math.min(50, Math.max(1, opts?.limit ?? 10));
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return {
    total: items.length,
    page,
    limit,
    items: paged,
  };
}

export async function listarNoticiasAdmin() {
  const files = await listJsonFiles(DATA_NEWS_DIR);

  const items: Noticia[] = [];
  for (const f of files) {
    const p = path.join(DATA_NEWS_DIR, f);
    try {
      const n = await readJson<Noticia>(p);
      items.push(n);
    } catch {
      // si algún json está mal, lo saltamos
    }
  }

  items.sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime());
  return items;
}

export async function obtenerNoticia(id: string): Promise<Noticia | null> {
  const p = noticiaJsonPath(id);
  if (!(await fileExists(p))) return null;
  return readJson<Noticia>(p);
}

export async function crearNoticia(
  input: CrearNoticiaInput,
  imagen?: { buffer: Buffer; mime: string }
): Promise<Noticia> {
  if (!input.titulo?.trim()) throw new Error("El título es obligatorio");
  if (!input.resumen?.trim()) throw new Error("El resumen es obligatorio");
  if (!input.contenido?.trim()) throw new Error("El contenido es obligatorio");
  if (!input.fechaEvento?.trim() || !isValidFechaEvento(input.fechaEvento)) {
    throw new Error("fechaEvento inválida. Usa formato YYYY-MM-DD");
  }
  if (!imagen) throw new Error("La imagen es obligatoria");

  const id = nanoid(10);
  const ext = extFromMime(imagen.mime);

  await ensureDir(UPLOADS_NEWS_DIR);
  await ensureDir(DATA_NEWS_DIR);

  const fileName = `${id}.${ext}`;
  const absImagePath = path.join(UPLOADS_NEWS_DIR, fileName);
  const imageUrl = `/uploads/news/${fileName}`;

  // Guardar imagen
  await fs.writeFile(absImagePath, imagen.buffer);

  const now = nowIso();
  const noticia: Noticia = {
    id,
    titulo: input.titulo.trim(),
    resumen: input.resumen.trim(),
    contenido: input.contenido,
    imagenUrl: imageUrl,
    fechaEvento: input.fechaEvento,
    fechaPublicacion: now,
    fechaActualizacion: now,
    estado: input.estado ?? "publicada",
  };

  // Guardar JSON
  await writeJsonAtomic(noticiaJsonPath(id), noticia);

  return noticia;
}

export async function actualizarNoticiaPUT(
  id: string,
  input: ActualizarNoticiaFullInput,
  nuevaImagen?: { buffer: Buffer; mime: string }
): Promise<Noticia | null> {
  const actual = await obtenerNoticia(id);
  if (!actual) return null;

  if (!input.titulo?.trim()) throw new Error("El título es obligatorio");
  if (!input.resumen?.trim()) throw new Error("El resumen es obligatorio");
  if (!input.contenido?.trim()) throw new Error("El contenido es obligatorio");
  if (!input.fechaEvento?.trim() || !isValidFechaEvento(input.fechaEvento)) {
    throw new Error("fechaEvento inválida. Usa formato YYYY-MM-DD");
  }

  let imagenUrl = actual.imagenUrl;

  // Si llega nueva imagen, reemplazamos archivo anterior
  if (nuevaImagen) {
    const ext = extFromMime(nuevaImagen.mime);
    const newFileName = `${id}.${ext}`;
    const absNewPath = path.join(UPLOADS_NEWS_DIR, newFileName);

    // borrar imagen anterior si tenía otro nombre/ext
    const oldAbs = path.join(process.cwd(), actual.imagenUrl.replace(/^\//, ""));
    await safeUnlink(oldAbs);

    await fs.writeFile(absNewPath, nuevaImagen.buffer);
    imagenUrl = `/uploads/news/${newFileName}`;
  }

  const updated: Noticia = {
    ...actual,
    titulo: input.titulo.trim(),
    resumen: input.resumen.trim(),
    contenido: input.contenido,
    fechaEvento: input.fechaEvento,
    estado: input.estado ?? actual.estado,
    imagenUrl,
    fechaActualizacion: nowIso(),
  };

  await writeJsonAtomic(noticiaJsonPath(id), updated);
  return updated;
}

export async function actualizarNoticiaPATCH(
  id: string,
  patch: PatchNoticiaInput
): Promise<Noticia | null> {
  const actual = await obtenerNoticia(id);
  if (!actual) return null;

  if (patch.fechaEvento && !isValidFechaEvento(patch.fechaEvento)) {
    throw new Error("fechaEvento inválida. Usa formato YYYY-MM-DD");
  }

  const updated: Noticia = {
    ...actual,
    titulo: patch.titulo !== undefined ? patch.titulo.trim() : actual.titulo,
    resumen: patch.resumen !== undefined ? patch.resumen.trim() : actual.resumen,
    contenido: patch.contenido !== undefined ? patch.contenido : actual.contenido,
    fechaEvento: patch.fechaEvento !== undefined ? patch.fechaEvento : actual.fechaEvento,
    estado: patch.estado !== undefined ? patch.estado : actual.estado,
    fechaActualizacion: nowIso(),
  };

  await writeJsonAtomic(noticiaJsonPath(id), updated);
  return updated;
}

export async function borrarNoticia(id: string): Promise<boolean> {
  const actual = await obtenerNoticia(id);
  if (!actual) return false;

  // borrar json
  await safeUnlink(noticiaJsonPath(id));

  // borrar imagen
  const abs = path.join(process.cwd(), actual.imagenUrl.replace(/^\//, ""));
  await safeUnlink(abs);

  return true;
}