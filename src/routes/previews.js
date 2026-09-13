import { Router } from "express";
import { addPreview, getLastPreviews } from "../services/preview-service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await getLastPreviews());
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const path = String(req.body?.path || "");
    if (!path) return res.status(400).json({ error: "Resume path is required." });
    res.json(await addPreview(path));
  } catch (error) {
    next(error);
  }
});

export default router;