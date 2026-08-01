import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname);
const filePath = path.join(dataDir, 'users.json');

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]', 'utf8');
  }
}

async function readUsers() {
  await ensureDataFile();
  const raw = await fs.readFile(filePath, 'utf8');
  return raw.trim() ? JSON.parse(raw) : [];
}

async function saveUsers(users) {
  await ensureDataFile();
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');
}

export async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find((user) => user.email === email.toLowerCase());
}

export async function findUserById(id) {
  const users = await readUsers();
  return users.find((user) => user.id === id);
}

export async function createUser({ fullName, email, password, role = 'student', selectedCourse = 'none' }) {
  const users = await readUsers();
  const newUser = {
    id: crypto.randomUUID(),
    fullName,
    email: email.toLowerCase(),
    password,
    role,
    selectedCourse,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}
