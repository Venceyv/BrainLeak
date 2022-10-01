import express from 'express';
import { postOAuth, postRefreshToken } from '../controllers/auth.js';

const router = express.Router();

router.post('/google', postOAuth);
router.post('/google/refresh-token', postRefreshToken);

export default router;
