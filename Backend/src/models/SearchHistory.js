const mongoose = require('mongoose');

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

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
