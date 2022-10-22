import { Router } from "express";
import { postOAuth, postRefreshToken } from "../controllers/auth.js";

const router = Router();

router.post("/google", postOAuth);
router.post("/google/refresh-token", postRefreshToken);

export default router;
