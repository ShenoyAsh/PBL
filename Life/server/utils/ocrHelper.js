// utils/ocrHelper.js
const Tesseract = require('tesseract.js');

async function extractMedicalInfo(buffer) {
  // Run OCR
  const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
  
  // Simple regex extraction (Keep as fallback/initial pass)
  const bloodGroupMatch = text.match(/\b(A\+|A-|B\+|B-|AB\+|AB-|O\+|O-)\b/);
  const ageMatch = text.match(/Age[:\s]+(\d{1,2})/i);
  const healthConditions = [];
  ['anemia', 'hypertension', 'diabetes', 'cancer', 'heart'].forEach(cond => {
    if (new RegExp(cond, 'i').test(text)) healthConditions.push(cond);
  });

  return {
    text, // <--- IMPORTANT: Return the raw text so the route can use it
    bloodGroup: bloodGroupMatch ? bloodGroupMatch[1] : null,
    age: ageMatch ? ageMatch[1] : null,
    healthConditions
  };
}

module.exports = { extractMedicalInfo };