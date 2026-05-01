const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { toJSON: { virtuals: true } });

module.exports = mongoose.model('Project', projectSchema);
