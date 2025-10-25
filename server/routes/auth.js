import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', authenticateToken, (req, res) => {
  res.json({ 
    isAuthenticated: true, 
    anonymousId: req.user.anonymousId 
  });
});

export default router;