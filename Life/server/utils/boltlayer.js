// utils/boltlayer.js

/**
 * Middleware to protect Excel Import/Export routes
 * using an Admin API Key stored in .env
 */

const authorizeSheetWrite = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'Missing API Key' });
  }

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ message: 'Invalid API Key' });
  }

  // Key is valid → continue
  next();
};

module.exports = { authorizeSheetWrite };
