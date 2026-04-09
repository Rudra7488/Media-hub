import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  searchedAt: {
    type: Date,
    default: Date.now,
  },
  success: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('SearchHistory', searchHistorySchema);
