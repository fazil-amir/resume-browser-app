import fs from "node:fs/promises";
import path from "node:path";

export async function ensureJsonFile(filePath, defaultValue) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2) + "\n", "utf8");
  }
}

export async function readJson(filePath, defaultValue) {
  await ensureJsonFile(filePath, defaultValue);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    await writeJson(filePath, defaultValue);
    return defaultValue;
  }
}

export async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(value, null, 2) + "\n", "utf8");
  await fs.rename(tempPath, filePath);
}