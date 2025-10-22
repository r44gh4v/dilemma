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
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getDilemmas);
router.get('/:id', getDilemmaById);
router.post('/', authenticateToken, upload.fields([
  { name: 'imageA', maxCount: 1 },
  { name: 'imageB', maxCount: 1 },
]), createDilemma);
router.put('/:id', authenticateToken, updateDilemma);
router.delete('/:id', authenticateToken, deleteDilemma);
router.post('/:id/vote', authenticateToken, voteDilemma);
router.post('/:id/like', authenticateToken, likeDilemma);
router.post('/:id/comment', authenticateToken, commentDilemma);
router.get('/user', authenticateToken, getUserDilemmas);

export default router;