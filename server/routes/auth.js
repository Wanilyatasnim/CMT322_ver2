const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../config/auth');
const dataStore = require('../data/dataStore');
const { sanitizeInput, validateRegister } = require('../middleware/validation');

const router = express.Router();

// Register
router.post('/register', sanitizeInput, validateRegister, async (req, res) => {
  try {
    const { name, email, password, phone, matricNumber } = req.body;

    const existingUser = dataStore.getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = dataStore.createUser({
      name,
      email,
      password: hashedPassword,
      phone,
      matric_number: matricNumber
    });

    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = dataStore.getUserByEmail(email || '');

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Your account has been banned' });
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
router.get('/me', verifyToken, (req, res) => {
  try {
    const user = dataStore.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

