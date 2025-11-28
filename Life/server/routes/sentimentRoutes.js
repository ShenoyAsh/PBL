const express = require('express');
const router = express.Router();

const { geminiRequest } = require('../utils/geminiHelper');
// @route   POST /api/sentiment-analysis
// @desc    Analyze sentiment of donor feedback using Gemini
router.post('/sentiment-analysis', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'No text provided' });
  try {
    const prompt = `Analyze the sentiment of this donor feedback. Reply with a JSON object with 'sentiment' (Positive, Negative, Neutral) and 'score' (0-1):\n${text}`;
    const aiResponse = await geminiRequest(prompt);
    let result = { sentiment: 'Neutral', score: 0.5 };
    try { result = JSON.parse(aiResponse); } catch {}
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Gemini sentiment analysis failed' });
  }
});

module.exports = router;
