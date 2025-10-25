import Dilemma from '../models/Dilemma.js';
import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';

const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
};

export const getDilemmas = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const dilemmas = await Dilemma.find()
      .populate('comments.userId', 'anonymousId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-userId');
    
    const userId = req.user?.id;
    const dilemmasWithVote = dilemmas.map(dilemma => {
      const dilemmaObj = dilemma.toObject();
      if (userId) {
        const userVote = dilemmaObj.votes?.find(v => v.userId && v.userId.toString() === userId.toString());
        dilemmaObj.userVote = userVote?.choice || null;
        dilemmaObj.userLiked = dilemmaObj.likes?.some(l => l && l.toString() === userId.toString()) || false;
      } else {
        dilemmaObj.userVote = null;
        dilemmaObj.userLiked = false;
      }
      return dilemmaObj;
    });
    
    res.json(dilemmasWithVote);
  } catch (err) {
    next(err);
  }
};

export const getDilemmaById = async (req, res, next) => {
  try {
    const dilemma = await Dilemma.findById(req.params.id)
      .populate('comments.userId', 'anonymousId')
      .populate('votes.userId', 'anonymousId')
      .populate('likes', 'anonymousId');
    if (!dilemma) return res.status(404).json({ error: 'Not found' });
    
    const userId = req.user?.id;
    const dilemmaObj = dilemma.toObject();
    if (userId) {
      const userVote = dilemmaObj.votes?.find(v => {
        const voteUserId = v.userId?._id || v.userId;
        return voteUserId && voteUserId.toString() === userId.toString();
      });
      dilemmaObj.userVote = userVote?.choice || null;
      
      const userLiked = dilemmaObj.likes?.some(l => {
        const likeUserId = l._id || l;
        return likeUserId && likeUserId.toString() === userId.toString();
      });
      dilemmaObj.userLiked = userLiked || false;
    } else {
      dilemmaObj.userVote = null;
      dilemmaObj.userLiked = false;
    }
    
    res.json(dilemmaObj);
  } catch (err) {
    next(err);
  }
};

export const createDilemma = async (req, res, next) => {
  try {
    const { optionA, optionB, imageUrlA = '', imageUrlB = '' } = req.body;
    
    if (!optionA || !optionB) {
      return res.status(400).json({ error: 'Both options are required' });
    }

    if (typeof optionA !== 'string' || optionA.trim().length === 0) {
      return res.status(400).json({ error: 'Option A must be a non-empty string' });
    }

    if (typeof optionB !== 'string' || optionB.trim().length === 0) {
      return res.status(400).json({ error: 'Option B must be a non-empty string' });
    }

    const user = await User.findById(req.user.id);
    const dilemma = new Dilemma({
      userId: req.user.id,
      anonymousId: user.anonymousId,
      optionA: {
        text: optionA,
        imageUrl: imageUrlA || undefined,
      },
      optionB: {
        text: optionB,
        imageUrl: imageUrlB || undefined,
      },
    });
    await dilemma.save();
    res.status(201).json(dilemma);
  } catch (err) {
    next(err);
  }
};

export const updateDilemma = async (req, res, next) => {
  try {
    const dilemma = await Dilemma.findOne({ _id: req.params.id, userId: req.user.id });
    if (!dilemma) return res.status(404).json({ error: 'Not found or unauthorized' });
    Object.assign(dilemma, req.body);
    dilemma.updatedAt = new Date();
    await dilemma.save();
    res.json(dilemma);
  } catch (err) {
    next(err);
  }
};

export const deleteDilemma = async (req, res, next) => {
  try {
    const dilemma = await Dilemma.findOne({ _id: req.params.id, userId: req.user.id });
    if (!dilemma) return res.status(404).json({ error: 'Not found or unauthorized' });
    
    const imageUrls = [
      dilemma.optionA?.imageUrl,
      dilemma.optionB?.imageUrl
    ].filter(Boolean);
    
    await Dilemma.findByIdAndDelete(req.params.id);
    
    if (imageUrls.length > 0) {
      const deletePromises = imageUrls.map(url => {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) {
          return cloudinary.uploader.destroy(publicId).catch(err => {
            console.error('Failed to delete image from Cloudinary:', err);
          });
        }
      });
      await Promise.allSettled(deletePromises);
    }
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

export const voteDilemma = async (req, res, next) => {
  try {
    const { choice } = req.body;
    
    if (!choice || (choice !== 'A' && choice !== 'B')) {
      return res.status(400).json({ error: 'Choice must be either "A" or "B"' });
    }

    const dilemma = await Dilemma.findById(req.params.id);
    if (!dilemma) return res.status(404).json({ error: 'Not found' });

    const existingVote = dilemma.votes.find((v) => v.userId.toString() === req.user.id);
    let userVote = null;
    
    if (existingVote) {
      if (existingVote.choice === choice) {
        dilemma.votes = dilemma.votes.filter((v) => v.userId.toString() !== req.user.id);
        if (choice === 'A') dilemma.votesA--;
        else dilemma.votesB--;
        userVote = null;
      } else {
        if (existingVote.choice === 'A') dilemma.votesA--;
        else dilemma.votesB--;
        existingVote.choice = choice;
        if (choice === 'A') dilemma.votesA++;
        else dilemma.votesB++;
        userVote = choice;
      }
    } else {
      dilemma.votes.push({ userId: req.user.id, choice });
      if (choice === 'A') dilemma.votesA++;
      else dilemma.votesB++;
      userVote = choice;
    }
    await dilemma.save();
    res.json({ votesA: dilemma.votesA, votesB: dilemma.votesB, userVote });
  } catch (err) {
    next(err);
  }
};

export const likeDilemma = async (req, res, next) => {
  try {
    const dilemma = await Dilemma.findById(req.params.id);
    if (!dilemma) return res.status(404).json({ error: 'Not found' });

    const likeIndex = dilemma.likes.findIndex((l) => l.toString() === req.user.id);
    let userLiked = false;
    
    if (likeIndex > -1) {
      dilemma.likes.splice(likeIndex, 1);
      dilemma.likeCount--;
      userLiked = false;
    } else {
      dilemma.likes.push(req.user.id);
      dilemma.likeCount++;
      userLiked = true;
    }
    await dilemma.save();
    res.json({ likeCount: dilemma.likeCount, userLiked });
  } catch (err) {
    next(err);
  }
};

export const commentDilemma = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required and cannot be empty' });
    }

    if (text.length > 1000) {
      return res.status(400).json({ error: 'Comment must be less than 1000 characters' });
    }

    const user = await User.findById(req.user.id);
    const dilemma = await Dilemma.findById(req.params.id);
    if (!dilemma) return res.status(404).json({ error: 'Not found' });

    dilemma.comments.push({ userId: req.user.id, anonymousId: user.anonymousId, text });
    await dilemma.save();
    res.status(201).json({ message: 'Commented' });
  } catch (err) {
    next(err);
  }
};

export const getUserDilemmas = async (req, res, next) => {
  try {
    const dilemmas = await Dilemma.find({ userId: req.user.id })
      .populate('comments.userId', 'anonymousId')
      .sort({ createdAt: -1 });
    
    const userId = req.user.id;
    const dilemmasWithVote = dilemmas.map(dilemma => {
      const dilemmaObj = dilemma.toObject();
      const userVote = dilemmaObj.votes?.find(v => v.userId && v.userId.toString() === userId.toString());
      dilemmaObj.userVote = userVote?.choice || null;
      dilemmaObj.userLiked = dilemmaObj.likes?.some(l => l && l.toString() === userId.toString()) || false;
      return dilemmaObj;
    });
    
    res.json(dilemmasWithVote);
  } catch (err) {
    next(err);
  }
};