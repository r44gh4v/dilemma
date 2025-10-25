import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dilemmaRoutes from './routes/dilemmas.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - Allow credentials for cross-origin cookie sharing
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Required for cookies to work cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());
import rateLimit from 'express-rate-limit';
const generalLimiter = rateLimit({ 
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
const actionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many actions, please slow down.' }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Increased from 5 to 20 (login + register + checkAuth calls)
  message: { error: 'Too many login attempts, please try again later.' },
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Dilemma API is running!' });
});

app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/dilemmas', dilemmaRoutes);
app.use(errorHandler);

// Connect to MongoDB
let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    }
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB Error:', err);
    isConnected = false;
    throw err;
  }
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless
export default async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }
  
  return app(req, res);
};