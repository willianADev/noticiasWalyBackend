import path from "path";

export const ROOT_DIR = process.cwd();

export const DATA_NEWS_DIR = path.join(ROOT_DIR, "data", "news");
export const UPLOADS_NEWS_DIR = path.join(ROOT_DIR, "uploads", "news");

export function noticiaJsonPath(id: string) {
  return path.join(DATA_NEWS_DIR, `${id}.json`);
}