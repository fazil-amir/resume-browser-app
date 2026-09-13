import express from "express";
import path from "node:path";
import fs from "node:fs/promises";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { PORT, RESUME_ROOT, DATA_ROOT, FAVORITES_FILE, LAST_PREVIEWS_FILE } from "./config.js";
import foldersRouter from "./routes/folders.js";
import resumesRouter from "./routes/resumes.js";
import searchRouter from "./routes/search.js";
import favoritesRouter from "./routes/favorites.js";
import previewsRouter from "./routes/previews.js";
import { safeResumePath } from "./utils/pathUtils.js";
import { ensureJsonFile } from "./utils/jsonStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const app = express();

app.use(express.json());

await fs.mkdir(DATA_ROOT, { recursive: true });
await ensureJsonFile(FAVORITES_FILE, { favorites: [] });
await ensureJsonFile(LAST_PREVIEWS_FILE, { previews: [] });

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/folders", foldersRouter);
app.use("/api/resumes", resumesRouter);
app.use("/api/search", searchRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/last-previews", previewsRouter);

app.get("/resume/*path", async (req, res, next) => {
  try {
    const parts = Array.isArray(req.params.path) ? req.params.path : [req.params.path];
    const relativePath = parts.join("/");
    const absolutePath = safeResumePath(relativePath);
    const stat = await fs.stat(absolutePath);

    if (!stat.isFile() || path.extname(absolutePath).toLowerCase() !== ".pdf") {
      return res.status(404).send("Resume not found.");
    }

    res.type("application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.sendFile(absolutePath);
  } catch (error) {
    if (error.code === "ENOENT") return res.status(404).send("Resume not found.");
    next(error);
  }
});

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const distPath = path.join(projectRoot, "dist");
  app.use(express.static(distPath));
  app.get("*path", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
} else {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    root: projectRoot,
    server: { middlewareMode: true, hmr: false },
    appType: "spa"
  });
  app.use(vite.middlewares);
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.message || "Internal server error."
  });
});

app.listen(PORT, () => {
  console.log(`\nResume Browser: http://localhost:${PORT}`);
  console.log(`Resume root: ${RESUME_ROOT}`);
  console.log(`Mode: ${isProduction ? "production" : "development"}\n`);
});