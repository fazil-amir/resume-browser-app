import { Router } from "express";
import { getAllResumes, getResumes, deleteResume } from "../services/file-service.js";
import { removeFromFavorites } from "../services/favorite-service.js";
import { removeFromPreviews } from "../services/preview-service.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await getResumes(req.query.path || ""));
  } catch (error) {
    next(error);
  }
});

router.get("/all", async (_req, res, next) => {
  try {
    res.json(await getAllResumes());
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const relativePath = String(req.body?.path || "");
    if (!relativePath) {
      return res.status(400).json({ error: "Resume path is required." });
    }

    await deleteResume(relativePath);
    await removeFromFavorites(relativePath);
    await removeFromPreviews(relativePath);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;