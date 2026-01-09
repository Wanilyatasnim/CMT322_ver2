/**
 * Input validation middleware
 */

// Sanitize string input
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate USM email
const isValidUSMEmail = (email) => {
  return email && email.toLowerCase().endsWith('@student.usm.my');
};

// Sanitize object inputs
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }
  next();
};

// Validate registration input
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!isValidUSMEmail(email)) {
    return res.status(400).json({ error: 'Please use your USM student email (@student.usm.my)' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  next();
};

// Validate listing input
const validateListing = (req, res, next) => {
  const { title, description, price } = req.body;

  if (!title || title.length < 3) {
    return res.status(400).json({ error: 'Title must be at least 3 characters' });
  }

  if (!description || description.length < 10) {
    return res.status(400).json({ error: 'Description must be at least 10 characters' });
  }

  const priceNum = Number(price);
  if (!price || isNaN(priceNum) || priceNum <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  next();
};

module.exports = {
  sanitizeInput,
  validateRegister,
  validateListing,
  sanitizeString,
  isValidEmail,
  isValidUSMEmail
};


