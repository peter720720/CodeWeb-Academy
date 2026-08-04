import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'schedule.json');

async function ensureDataFile() {
  await fs.mkdir(__dirname, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]', 'utf8');
  }
}

async function readSchedule() {
  await ensureDataFile();
  const raw = await fs.readFile(filePath, 'utf8');
  return raw.trim() ? JSON.parse(raw) : [];
}

async function saveSchedule(schedule) {
  await ensureDataFile();
  await fs.writeFile(filePath, JSON.stringify(schedule, null, 2), 'utf8');
}

export async function getSchedule() {
  return await readSchedule();
}

export async function upsertSchedule(courseId, data) {
  const schedule = await readSchedule();
  const next = schedule.map((item) => {
    if (item.courseId === courseId) {
      return { ...item, ...data, courseId, updatedAt: new Date().toISOString() };
    }
    return item;
  });

  const exists = schedule.some((item) => item.courseId === courseId);
  if (!exists) {
    next.push({ courseId, ...data, updatedAt: new Date().toISOString() });
  }

  await saveSchedule(next);
  return next.find((item) => item.courseId === courseId);
}
