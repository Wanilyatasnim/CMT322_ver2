const express = require('express');
const { verifyToken } = require('../config/auth');
const dataStore = require('../data/dataStore');

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  try {
    const user = dataStore.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', verifyToken, (req, res) => {
  try {
    const { name, phone, matricNumber } = req.body;

    const updated = dataStore.updateUser(req.user.userId, {
      name,
      phone,
      matric_number: matricNumber
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's listings
router.get('/my-listings', verifyToken, (req, res) => {
  try {
    const listings = dataStore
      .getListingsByUserId(req.user.userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(listings);
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get public user info
router.get('/:id', (req, res) => {
  try {
    const user = dataStore.getUserById(req.params.id);

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

