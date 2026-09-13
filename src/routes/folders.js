import { Router } from "express";
import { getFolders } from "../services/file-service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await getFolders());
  } catch (error) {
    next(error);
  }
});

export default router;