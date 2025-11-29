// server/routes/ocrRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { extractMedicalInfo } = require('../utils/ocrHelper');
const { geminiRequest } = require('../utils/geminiHelper');

router.post('/ocr-medical-report', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    // 1. Get raw text from OCR
    const ocrResult = await extractMedicalInfo(req.file.buffer);
    
    // 2. Send the RAW TEXT to Gemini (not the processed JSON)
    const prompt = `Extract the following details from this medical report text:
    - Blood Group
    - Age
    - Health Conditions (list any found)

    Report Text:
    "${ocrResult.text}"

    Reply ONLY with a JSON object in this format: 
    { "bloodGroup": "string", "age": "number", "healthConditions": ["string"] }`;

    const aiResponse = await geminiRequest(prompt);
    
    let result = ocrResult;
    try { 
      // Parse AI response
      const aiData = JSON.parse(aiResponse.replace(/```json|```/g, '').trim());
      // Merge AI data with OCR result
      result = { ...ocrResult, ...aiData }; 
    } catch (e) {
      console.error("AI parsing failed, using regex fallback");
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'OCR extraction failed' });
  }
});

module.exports = router;