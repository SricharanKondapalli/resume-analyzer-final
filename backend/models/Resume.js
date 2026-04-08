const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['warning', 'info', 'success'], default: 'info' },
    message: { type: String, required: true },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    score: { type: Number, required: true, min: 0, max: 100 },
    grade: { type: String, required: true },
    suggestions: [suggestionSchema],
    missingKeywords: [String],
    foundKeywords: [String],
    sectionScores: {
      contact: { type: Number, default: 0 },
      summary: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema({
  resumeText: { type: String, required: true, maxlength: 50000 },
  analysis: { type: analysisSchema, required: true },
  wordCount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

resumeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
