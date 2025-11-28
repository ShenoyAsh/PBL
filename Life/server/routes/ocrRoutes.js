const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { extractMedicalInfo } = require('../utils/ocrHelper');
const { geminiRequest } = require('../utils/geminiHelper');

// @route   POST /api/ocr-medical-report
// @desc    Extract info from medical report using OCR + Gemini
router.post('/ocr-medical-report', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    // Use OCR helper to extract text
    const ocrResult = await extractMedicalInfo(req.file.buffer);
    // Use Gemini to extract info from OCR text
    const prompt = `Extract blood group, age, and health conditions from this medical report text. Reply with a JSON object: { bloodGroup, age, healthConditions }.\n${JSON.stringify(ocrResult)}`;
    const aiResponse = await geminiRequest(prompt);
    let result = ocrResult;
    try { result = JSON.parse(aiResponse); } catch {}
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Gemini OCR extraction failed' });
  }
});

module.exports = router;
