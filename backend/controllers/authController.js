import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { findUserByEmail, findUserById, createUser as createLocalUser } from '../data/userStore.js';

const JWT_SECRET = process.env.JWT_SECRET || '7d9a7493be32f7200aad8ddb829719d09c2dd2e43beb95ba8a2d98ba71afc082';

function getUserId(user) {
  return user._id?.toString() || user.id;
}

async function resolveUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    if (user) return user;
  } catch (err) {
    // Ignore database failures and fall back to local store.
  }
  return findUserByEmail(email);
}

async function resolveUserById(id) {
  try {
    const user = await User.findById(id);
    if (user) return user;
  } catch (err) {
    // Ignore database failures and fall back to local store.
  }
  return findUserById(id);
}

async function createAppUser({ fullName, email, password, selectedCourse }) {
  try {
    return await User.create({
      fullName,
      email,
      password,
      role: 'student',
      selectedCourse
    });
  } catch (err) {
    return createLocalUser({ fullName, email, password, selectedCourse });
  }
}

export async function register(req, res) {
  try {
    const { fullName, email, password, selectedCourse } = req.body;

    if (!fullName || !email || !password || !selectedCourse) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const userExists = await resolveUserByEmail(email);
    if (userExists) return res.status(400).json({ message: 'This email is already registered.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await createAppUser({
      fullName,
      email,
      password: hashedPassword,
      selectedCourse
    });

    res.status(201).json({ message: 'Enrollment successful! You can now sign in.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server registration error.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password.' });

    const user = await resolveUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: getUserId(user), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Sign-in successful!',
      token,
      user: {
        id: getUserId(user),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        selectedCourse: user.selectedCourse
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server login error.' });
  }
}

export async function validate(req, res) {
  try {
    const user = await resolveUserById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(200).json({
      user: {
        id: getUserId(user),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        selectedCourse: user.selectedCourse
      }
    });
  } catch (error) {
    console.error('Validate error:', error);
    res.status(500).json({ message: 'Internal server validation error.' });
  }
}
