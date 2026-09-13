import { Router } from "express";
import { getAllResumes, searchResumes } from "../services/file-service.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.json([]);
    res.json(searchResumes(q, await getAllResumes()));
  } catch (error) {
    next(error);
  }
});

export default router;