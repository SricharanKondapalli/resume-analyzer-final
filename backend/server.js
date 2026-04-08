require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api', analyzeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/resume_analyzer';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (DB unavailable)`));
  });

module.exports = app;
