import { Router } from "express";
import { addFavorite, getFavorites, removeFavorite } from "../services/favoriteService.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await getFavorites());
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const path = String(req.body?.path || "");
    if (!path) return res.status(400).json({ error: "Resume path is required." });
    res.json(await addFavorite(path));
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const path = String(req.body?.path || "");
    if (!path) return res.status(400).json({ error: "Resume path is required." });
    res.json(await removeFavorite(path));
  } catch (error) {
    next(error);
  }
});

export default router;