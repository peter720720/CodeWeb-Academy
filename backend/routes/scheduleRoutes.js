import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { fetchSchedule, updateSchedule } from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', fetchSchedule);
router.patch('/:courseId', requireAuth, updateSchedule);

export default router;
