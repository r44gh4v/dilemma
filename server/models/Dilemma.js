import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  anonymousId: String,
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const dilemmaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  anonymousId: String,
  optionA: {
    text: { type: String, required: true },
    imageUrl: String
  },
  optionB: {
    text: { type: String, required: true },
    imageUrl: String
  },
  votesA: { type: Number, default: 0 },
  votesB: { type: Number, default: 0 },
  votes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    choice: { type: String, enum: ['A', 'B'] }
  }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likeCount: { type: Number, default: 0 },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

dilemmaSchema.index({ createdAt: -1 });
dilemmaSchema.index({ userId: 1, 'votes.userId': 1 });

export default mongoose.model('Dilemma', dilemmaSchema);