import fs from "fs/promises";
import path from "path";

export async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Escritura "atómica" (reduce riesgo de archivo corrupto)
 */
export async function writeJsonAtomic(filePath: string, data: unknown) {
  const dir = path.dirname(filePath);
  await ensureDir(dir);

  const tmpPath = `${filePath}.tmp`;
  const json = JSON.stringify(data, null, 2);

  await fs.writeFile(tmpPath, json, "utf8");
  await fs.rename(tmpPath, filePath);
}

export async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function safeUnlink(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore
  }
}