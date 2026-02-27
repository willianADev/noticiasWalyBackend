import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin";
import { uploadImagen } from "../utils/upload";
import {
  deleteNews,
  getNewsAdmin,
  getNewsById,
  getNewsByIdAdmin,
  getNewsPublic,
  patchNews,
  postNews,
  putNews,
} from "../controllers/noticia.controller";

export const newsRouter = Router();

/**
 * Público
 */
newsRouter.get("/", getNewsPublic);
newsRouter.get("/:id", getNewsById);

/**
 * Admin
 */
newsRouter.get("/admin/lista", requireAdmin, getNewsAdmin);
newsRouter.get("/admin/:id", requireAdmin, getNewsByIdAdmin);

// Crear: requiere imagen (campo: "imagen")
newsRouter.post("/", requireAdmin, uploadImagen.single("imagen"), postNews);

// PUT: reemplazo completo, imagen opcional
newsRouter.put("/:id", requireAdmin, uploadImagen.single("imagen"), putNews);

// PATCH: parcial (JSON), sin imagen
newsRouter.patch("/:id", requireAdmin, patchNews);

newsRouter.delete("/:id", requireAdmin, deleteNews);