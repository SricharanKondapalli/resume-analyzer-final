const express = require('express');
const { analyze, getHistory } = require('../controllers/analyzeController');

const router = express.Router();

router.post('/analyze', analyze);
router.get('/history', getHistory);

module.exports = router;
