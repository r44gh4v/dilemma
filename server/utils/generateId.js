import Counter from '../models/Counter.js';

export const generateAnonymousId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    'anonymousId',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `#${counter.seq}`;
};