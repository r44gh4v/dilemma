import Counter from '../models/Counter.js';

// Generate sequential anonymous IDs (#1, #2, #3, etc.)
export const generateAnonymousId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    'anonymousId',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `#${counter.seq}`;
};