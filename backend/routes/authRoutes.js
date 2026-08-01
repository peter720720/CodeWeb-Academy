import express from 'express';
import { register, login, validate } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate', requireAuth, validate);

export default router;
