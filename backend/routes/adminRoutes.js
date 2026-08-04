import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  submitContactMessage,
  listMessages,
  removeMessage,
  replyToMessage,
  getMessagesForStudent
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', requireAuth, getDashboardStats);
router.get('/messages', requireAuth, listMessages);
router.patch('/messages/:id/reply', requireAuth, replyToMessage);
router.delete('/messages/:id', requireAuth, removeMessage);
router.get('/student/messages', requireAuth, getMessagesForStudent);
router.post('/contact-message', submitContactMessage);

export default router;
