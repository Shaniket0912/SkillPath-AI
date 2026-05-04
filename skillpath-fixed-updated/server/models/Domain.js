const mongoose = require('mongoose');

const DomainSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['Coding & Development', 'Tools & Tech', 'Management & Business', 'Design & Creative'],
    required: true,
  },
  subRole: {
    type: String,
    required: true,
  },
  selectedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Domain', DomainSchema);
