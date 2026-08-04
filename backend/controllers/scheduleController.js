import { getSchedule, upsertSchedule } from '../data/scheduleStore.js';

export async function fetchSchedule(req, res) {
  try {
    const schedule = await getSchedule();
    return res.status(200).json(schedule);
  } catch (error) {
    console.error('Fetch schedule error:', error);
    return res.status(500).json({ message: 'Unable to load schedule data.' });
  }
}

export async function updateSchedule(req, res) {
  try {
    const { courseId } = req.params;
    const { date, time } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'Course id is required.' });
    }
    if (!date || !time) {
      return res.status(400).json({ message: 'Both date and time are required.' });
    }

    const updated = await upsertSchedule(courseId, { date, time });
    return res.status(200).json({ message: 'Schedule updated.', data: updated });
  } catch (error) {
    console.error('Update schedule error:', error);
    return res.status(500).json({ message: 'Unable to update schedule.' });
  }
}
