const { GoogleGenerativeAI } = require("@google/generative-ai");

// Fetch API Key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in environment variables.");
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function geminiRequest(prompt) {
  try {
    if (!apiKey) {
      console.error("Gemini request aborted: No API Key.");
      return null;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return null;
  }
}

module.exports = { geminiRequest };