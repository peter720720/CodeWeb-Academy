import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'messages.json');

async function ensureDataFile() {
  await fs.mkdir(__dirname, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]', 'utf8');
  }
}

async function readMessages() {
  await ensureDataFile();
  const raw = await fs.readFile(filePath, 'utf8');
  return raw.trim() ? JSON.parse(raw) : [];
}

async function saveMessages(messages) {
  await ensureDataFile();
  await fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf8');
}

export async function getMessages() {
  return await readMessages();
}

export async function addMessage({ name, email, message }) {
  const messages = await readMessages();
  const next = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    message,
    reply: '',
    createdAt: new Date().toISOString()
  };
  messages.push(next);
  await saveMessages(messages);
  return next;
}

export async function deleteMessage(id) {
  const messages = await readMessages();
  const filtered = messages.filter((m) => m.id !== id && m._id !== id);
  if (filtered.length === messages.length) return false;
  await saveMessages(filtered);
  return true;
}

export async function updateMessageReply(id, reply) {
  const messages = await readMessages();
  let found = false;
  const updated = messages.map((m) => {
    if (m.id === id || m._id === id) {
      found = true;
      return { ...m, reply: reply ?? '' };
    }
    return m;
  });
  if (!found) return null;
  await saveMessages(updated);
  return updated.find((m) => m.id === id || m._id === id);
}
