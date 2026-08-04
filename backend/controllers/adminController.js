import mongoose from 'mongoose';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { getMessages, addMessage, updateMessageReply } from '../data/messageStore.js';
import { deleteMessage as deleteLocalMessage } from '../data/messageStore.js';

const useLocalFallback = process.env.USE_LOCAL_FALLBACK === 'true';

async function countLocalStudents() {
  const users = await import('../data/users.json', { assert: { type: 'json' } });
  return users.default.filter((user) => user.role === 'student').length;
}

async function getLocalMessageCount() {
  const messages = await getMessages();
  return messages.length;
}

async function getDashboardStats(req, res) {
  try {
    if (mongoose.connection.readyState === 1) {
      const studentCount = await User.countDocuments({ role: 'student' });
      const messageCount = await Message.countDocuments();
      const studentMessageCount = (await Message.distinct('email')).length;
      return res.status(200).json({ studentCount, messageCount, studentMessageCount });
    }

    const studentCount = await countLocalStudents();
    const messages = await getMessages();
    const messageCount = messages.length;
    const studentMessageCount = new Set(messages.map((item) => item.email.toLowerCase())).size;
    return res.status(200).json({ studentCount, messageCount, studentMessageCount });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ message: 'Unable to load dashboard statistics.' });
  }
}

async function submitContactMessage(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      await Message.create({ name, email, message, reply: '' });
    } else if (useLocalFallback) {
      await addMessage({ name, email, message });
    }

    return res.status(201).json({ message: 'Message received.' });
  } catch (error) {
    console.error('Submit message error:', error);
    return res.status(500).json({ message: 'Unable to send your message.' });
  }
}

async function replyToMessage(req, res) {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    if (!id) return res.status(400).json({ message: 'Message id required.' });
    if (typeof reply !== 'string' || reply.trim().length === 0) {
      return res.status(400).json({ message: 'Reply text is required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const message = await Message.findById(id);
      if (!message) return res.status(404).json({ message: 'Message not found.' });
      message.reply = reply;
      await message.save();
      return res.status(200).json({ message: 'Reply saved.', data: message });
    }

    const updated = await updateMessageReply(id, reply);
    if (!updated) return res.status(404).json({ message: 'Message not found.' });
    return res.status(200).json({ message: 'Reply saved.', data: updated });
  } catch (error) {
    console.error('Reply message error:', error);
    return res.status(500).json({ message: 'Unable to save reply.' });
  }
}

export { getDashboardStats, submitContactMessage, listMessages, removeMessage, replyToMessage, getMessagesForStudent };

async function listMessages(req, res) {
  try {
    if (mongoose.connection.readyState === 1) {
      const msgs = await Message.find().sort({ createdAt: -1 });
      return res.status(200).json(msgs);
    }

    const msgs = await getMessages();
    return res.status(200).json(msgs);
  } catch (error) {
    console.error('List messages error:', error);
    return res.status(500).json({ message: 'Unable to load messages.' });
  }
}

async function getMessagesForStudent(req, res) {
  try {
    const studentEmail = req.user.email.toLowerCase();
    if (mongoose.connection.readyState === 1) {
      const msgs = await Message.find({ email: studentEmail }).sort({ createdAt: -1 });
      return res.status(200).json(msgs);
    }

    const msgs = await getMessages();
    const filtered = msgs.filter((m) => m.email.toLowerCase() === studentEmail);
    return res.status(200).json(filtered);
  } catch (error) {
    console.error('Get student messages error:', error);
    return res.status(500).json({ message: 'Unable to load your messages.' });
  }
}

async function removeMessage(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Message id required.' });

    if (mongoose.connection.readyState === 1) {
      const doc = await Message.findByIdAndDelete(id);
      if (!doc) return res.status(404).json({ message: 'Message not found.' });
      return res.status(200).json({ message: 'Deleted.' });
    }

    const ok = await deleteLocalMessage(id);
    if (!ok) return res.status(404).json({ message: 'Message not found.' });
    return res.status(200).json({ message: 'Deleted.' });
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({ message: 'Unable to delete message.' });
  }
}
