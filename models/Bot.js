const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  prefix: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  ownerUsername: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  votes: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bot', BotSchema);
