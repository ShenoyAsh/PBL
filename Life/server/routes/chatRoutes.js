const express = require('express');
const router = express.Router();
const { geminiRequest } = require('../utils/geminiHelper');

// @route   POST /api/chat
// @desc    Get AI response from Gemini 2.5 Flash for ChatBot
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  try {
    // Contextual System Prompt for LifeLink
    const systemContext = `You are the intelligent AI assistant for LifeLink, a platform connecting blood donors with patients. 
    
    Key Platform Features you should know:
    - We use AI for Urgency Classification and Fake Request Detection.
    - We use OCR (Tesseract.js) to scan medical reports and auto-fill forms.
    - We use Geospatial matching to find donors near patients.
    - We perform Sentiment Analysis on user feedback.

    Your Role:
    - Answer questions about blood donation eligibility (Age 18-65, Weight >50kg, no major health issues).
    - Explain documents needed (Valid ID like Aadhaar, PAN).
    - Guide users on finding blood banks or posting requests.
    - Be empathetic, professional, and concise.
    
    User Query: ${message}`;

    const aiResponse = await geminiRequest(systemContext);
    
    res.json({ response: aiResponse || "I'm having trouble connecting to my brain right now. Please try again later." });
  } catch (error) {
    console.error('ChatBot API error:', error);
    res.status(500).json({ message: 'Server error processing chat request' });
  }
});

module.exports = router;