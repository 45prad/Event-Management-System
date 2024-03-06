const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  id: Number,
  committeeName: String,
  eventType: String,
  eventName: String,
  convenorName: String,
  eventDate: Date,
  duration: Number,
  poaPdf: String,
  HODApproval: { type: Number, default: 0 },
  PrincipleApproval: { type: Number, default: 0 },
  RoomAllocated: Boolean,
  status: { type: String, default: 'Pending from all' }
});

module.exports = mongoose.model('Data', dataSchema);
