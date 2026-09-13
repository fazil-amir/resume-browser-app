import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, "..");

export const PORT = Number(process.env.PORT || 4040);
export const RESUME_ROOT = path.resolve(
  PROJECT_ROOT,
  process.env.RESUME_ROOT || "resumes"
);

export const DATA_ROOT = path.join(PROJECT_ROOT, "data");
export const FAVORITES_FILE = path.join(DATA_ROOT, "favorites.json");
export const LAST_PREVIEWS_FILE = path.join(DATA_ROOT, "last-previews.json");
export const MAX_LAST_PREVIEWS = Math.max(
  1,
  Number(process.env.MAX_LAST_PREVIEWS || 20)
);
