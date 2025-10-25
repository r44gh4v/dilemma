import express from 'express';
import {
  getDilemmas,
  getDilemmaById,
  createDilemma,
  updateDilemma,
  deleteDilemma,
  voteDilemma,
  likeDilemma,
  commentDilemma,
  getUserDilemmas,
} from '../controllers/dilemmaController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import upload, { uploadImage } from '../middleware/upload.js';
import rateLimit from 'express-rate-limit';

const actionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many actions, please slow down.' }
});

const router = express.Router();

router.post('/upload', authenticateToken, upload.single('image'), uploadImage, (req, res) => {
  res.json({ url: req.imageUrl });
});

router.get('/', optionalAuth, getDilemmas);
router.get('/user', authenticateToken, getUserDilemmas);
router.get('/:id', optionalAuth, getDilemmaById);
router.post('/', authenticateToken, createDilemma);
router.put('/:id', authenticateToken, updateDilemma);
router.delete('/:id', authenticateToken, deleteDilemma);
router.post('/:id/vote', authenticateToken, actionLimiter, voteDilemma);
router.post('/:id/like', authenticateToken, actionLimiter, likeDilemma);
router.post('/:id/comment', authenticateToken, commentDilemma);

export default router;