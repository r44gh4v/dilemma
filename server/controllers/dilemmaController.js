import Dilemma from '../models/Dilemma.js';
import User from '../models/User.js';

export const getDilemmas = async (req, res) => {
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
    res.json(dilemmas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDilemmaById = async (req, res) => {
  try {
    const dilemma = await Dilemma.findById(req.params.id)
      .populate('comments.userId', 'anonymousId')
      .populate('votes.userId', 'anonymousId')
      .populate('likes', 'anonymousId');
    if (!dilemma) return res.status(404).json({ error: 'Not found' });
    res.json(dilemma);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDilemma = async (req, res) => {
  try {
    const { optionA, optionB } = req.body;
    const user = await User.findById(req.user.id);
    const dilemma = new Dilemma({
      userId: req.user.id,
      anonymousId: user.anonymousId,
      optionA: {
        text: optionA,
        imageUrl: req.files?.imageA ? req.files.imageA[0].path : undefined,
      },
      optionB: {
        text: optionB,
        imageUrl: req.files?.imageB ? req.files.imageB[0].path : undefined,
      },
    });
    await dilemma.save();
    res.status(201).json(dilemma);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDilemma = async (req, res) => {
  try {
    const dilemma = await Dilemma.findOne({ _id: req.params.id, userId: req.user.id });
    if (!dilemma) return res.status(404).json({ error: 'Not found or unauthorized' });
    Object.assign(dilemma, req.body);
    dilemma.updatedAt = new Date();
    await dilemma.save();
    res.json(dilemma);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDilemma = async (req, res) => {
  try {
    const dilemma = await Dilemma.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!dilemma) return res.status(404).json({ error: 'Not found or unauthorized' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const voteDilemma = async (req, res) => {
  try {
    const { choice } = req.body;
    const dilemma = await Dilemma.findById(req.params.id);
    if (!dilemma) return res.status(404).json({ error: 'Not found' });

    const existingVote = dilemma.votes.find((v) => v.userId.toString() === req.user.id);
    if (existingVote) {
      if (existingVote.choice === choice) {
        dilemma.votes = dilemma.votes.filter((v) => v.userId.toString() !== req.user.id);
        if (choice === 'A') dilemma.votesA--;
        else dilemma.votesB--;
      } else {
        if (existingVote.choice === 'A') dilemma.votesA--;
        else dilemma.votesB--;
        existingVote.choice = choice;
        if (choice === 'A') dilemma.votesA++;
        else dilemma.votesB++;
      }
    } else {
      dilemma.votes.push({ userId: req.user.id, choice });
      if (choice === 'A') dilemma.votesA++;
      else dilemma.votesB++;
    }
    await dilemma.save();
    res.json({ votesA: dilemma.votesA, votesB: dilemma.votesB });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likeDilemma = async (req, res) => {
  try {
    const dilemma = await Dilemma.findById(req.params.id);
    if (!dilemma) return res.status(404).json({ error: 'Not found' });

    const likeIndex = dilemma.likes.findIndex((l) => l.toString() === req.user.id);
    if (likeIndex > -1) {
      dilemma.likes.splice(likeIndex, 1);
      dilemma.likeCount--;
    } else {
      dilemma.likes.push(req.user.id);
      dilemma.likeCount++;
    }
    await dilemma.save();
    res.json({ likeCount: dilemma.likeCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const commentDilemma = async (req, res) => {
  try {
    const { text } = req.body;
    const user = await User.findById(req.user.id);
    const dilemma = await Dilemma.findById(req.params.id);
    if (!dilemma) return res.status(404).json({ error: 'Not found' });

    dilemma.comments.push({ userId: req.user.id, anonymousId: user.anonymousId, text });
    await dilemma.save();
    res.status(201).json({ message: 'Commented' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserDilemmas = async (req, res) => {
  try {
    const dilemmas = await Dilemma.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(dilemmas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};