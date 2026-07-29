import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
let Resend;
try {
  // `resend` may not be installed in some environments — load conditionally
  // to avoid crashing `npm install` or runtime when unavailable.
  // eslint-disable-next-line import/no-extraneous-dependencies
  Resend = (await import('resend')).Resend;
} catch (err) {
  Resend = null;
}
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Modular routes & models
import authRoutes from './routes/authRoutes.js';
import coursesRoutes from './routes/coursesRoutes.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// =========================================================================
// 🔑 SERVER CONFIGURATION (Using workspace .env values with safe defaults)
// =========================================================================
const PORT = Number(process.env.PORT) || 3500;
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/codeweb_db';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'CodeWeb Academy';

const NODEMAILER_USERNAME = process.env.NODEMAILER_USERNAME || '';
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD || '';

const app = express();

// Initialize Resend Primary Email Engine (if available)
const resend = Resend && RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Configure Nodemailer Gmail Transport (Secondary Fallback Engine)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_USERNAME,
    pass: NODEMAILER_PASSWORD
  }
});

// Middleware Configuration
// Allow frontend origin to be configured via environment for deployments (Render, Vercel, etc.)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

// Static CodeWeb Course Catalog
const COURSES = [
  { id: 'frontend', title: 'Frontend Development' },
  { id: 'backend', title: 'Backend Development' },
  { id: 'fullstack', title: 'Full-Stack Development' },
  { id: 'cybersecurity', title: 'Cybersecurity' },
  { id: 'data-analysis', title: 'Data Analysis' },
  { id: 'graphics-design', title: 'Graphics Design' },
  { id: 'production-design', title: 'Production Design' },
  { id: 'product-management', title: 'Product Management' }
];

// ==========================================
// 🚀 DATABASE CONNECTION & ADMIN SEEDING
// ==========================================
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10
    });

    console.log('🍃 Connected to MongoDB Atlas successfully.');
    await seedAdminUser();
  } catch (err) {
    console.error('❌ Database connection failure:', err.message);
    console.log('⏳ Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectToDatabase, 5000);
  }
};

connectToDatabase();

// Automated Seeding Routine
async function seedAdminUser() {
  try {
    const adminEmail = "oyinloyepeter273@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('CodeWebAdminSecret2026!', salt);
      
      await User.create({
        fullName: "Peter Akorede (Admin)",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        selectedCourse: "all"
      });
      
      console.log('👑 Admin user successfully seeded into database!');
    } else {
      console.log('ℹ️ Admin account already configured.');
    }
  } catch (error) {
    console.error('❌ Admin seeding failed:', error);
  }
}

// ==========================================
// 🛣️ API ENDPOINTS
// ==========================================

// 1. Fetch All Available Courses
// API endpoints are provided by modular routes mounted earlier.

  // Health check endpoint for deployment verification
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV || 'production' });
  });

app.listen(PORT, () => {
  console.log(`🚀 CodeWeb Backend running on: http://localhost:${PORT}`);
});
