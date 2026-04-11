const { getAISuggestions } = require('../utils/aiService');
const Resume = require('../models/Resume');

async function analyze(req, res) {
  try {
    const { resumeText } = req.body;

    if (!resumeText || typeof resumeText !== 'string') {
      return res.status(400).json({ error: 'resumeText is required.' });
    }

    const trimmed = resumeText.trim();
    if (trimmed.length < 50) {
      return res.status(400).json({ error: 'Resume text is too short. Please paste your full resume.' });
    }

    const wordCount = trimmed.split(/\s+/).length;

    // 100% AI GENERATED JSON
    const analysis = await getAISuggestions(trimmed);

    let savedEntry = null;
    try {
      const entry = new Resume({ resumeText: trimmed, analysis, wordCount });
      savedEntry = await entry.save();
    } catch (dbErr) {
      console.warn('DB save skipped:', dbErr.message);
    }

    return res.status(201).json({
      id: savedEntry?._id || null,
      wordCount,
      analysis,
      createdAt: savedEntry?.createdAt || new Date().toISOString(),
    });
  } catch (err) {
    console.error('analyze error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function getHistory(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    let entries = [];
    let total = 0;

    try {
      [entries, total] = await Promise.all([
        Resume.find({}, { resumeText: 0 })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Resume.countDocuments(),
      ]);
    } catch (dbErr) {
      console.warn('DB fetch skipped:', dbErr.message);
    }

    return res.json({
      data: entries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('history error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { analyze, getHistory };