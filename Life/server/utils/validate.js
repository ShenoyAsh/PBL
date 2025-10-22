const validatePhone = (phone) => {
  // Simple check for exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const validateEmail = (email) => {
  // Standard email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validatePhone,
  validateEmail,
};