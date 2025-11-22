const express = require('express');
const multer = require('../config/multer');
const { query } = require('../config/database');
const { verifyToken } = require('../config/auth');

const router = express.Router();

// Get all listings with search and filters
router.get('/', async (req, res) => {
  try {
    let sql = 'SELECT * FROM listings WHERE status = ?';
    const params = ['active'];

    // Search by keyword
    if (req.query.search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${req.query.search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Filter by category
    if (req.query.category) {
      sql += ' AND category = ?';
      params.push(req.query.category);
    }

    // Filter by condition
    if (req.query.condition) {
      sql += ' AND condition = ?';
      params.push(req.query.condition);
    }

    // Filter by location
    if (req.query.location) {
      sql += ' AND location LIKE ?';
      params.push(`%${req.query.location}%`);
    }

    // Filter by price range
    if (req.query.minPrice) {
      sql += ' AND price >= ?';
      params.push(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      sql += ' AND price <= ?';
      params.push(req.query.maxPrice);
    }

    // Sorting
    const sortBy = req.query.sortBy || 'newest';
    switch (sortBy) {
      case 'newest':
        sql += ' ORDER BY created_at DESC';
        break;
      case 'oldest':
        sql += ' ORDER BY created_at ASC';
        break;
      case 'price-low':
        sql += ' ORDER BY price ASC';
        break;
      case 'price-high':
        sql += ' ORDER BY price DESC';
        break;
      default:
        sql += ' ORDER BY created_at DESC';
    }

    const listings = await query.all(sql, params);
    res.json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await query.get(
      'SELECT * FROM listings WHERE id = ?',
      [req.params.id]
    );

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Increment click counter
    await query.run(
      'UPDATE listings SET clicks = clicks + 1 WHERE id = ?',
      [req.params.id]
    );

    res.json({ ...listing, clicks: listing.clicks + 1 });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create listing
router.post('/', verifyToken, multer.array('images', 3), async (req, res) => {
  try {
    const { title, description, price, category, condition, location } = req.body;

    if (!title || !description || !price || !category || !condition) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one image' });
    }

    // Cloudinary returns file.path (URL) instead of file.filename
    const images = req.files.map(file => file.path).join(',');

    const result = await query.run(
      `INSERT INTO listings (user_id, title, description, price, category, condition, location, images) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.userId, title, description, price, category, condition, location || null, images]
    );

    res.status(201).json({
      message: 'Listing created successfully',
      id: result.id
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update listing
router.put('/:id', verifyToken, multer.array('images', 3), async (req, res) => {
  try {
    const listing = await query.get(
      'SELECT * FROM listings WHERE id = ?',
      [req.params.id]
    );

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to edit this listing' });
    }

    const { title, description, price, category, condition, location, existingImages } = req.body;
    let images = '';
    
    // Combine existing images (if provided) with new images
    const existingImagesArray = existingImages ? existingImages.split(',').filter(img => img.trim()) : [];
    // Cloudinary returns file.path (URL), local storage returns file.filename
    const newImagesArray = req.files && req.files.length > 0 ? req.files.map(file => file.path || file.filename) : [];
    
    // Merge existing and new images
    const allImages = [...existingImagesArray, ...newImagesArray];
    
    // If no images at all, keep the original
    if (allImages.length === 0) {
      images = listing.images;
    } else {
      images = allImages.join(',');
    }

    await query.run(
      `UPDATE listings SET title = ?, description = ?, price = ?, category = ?, 
       condition = ?, location = ?, images = ? WHERE id = ?`,
      [title, description, price, category, condition, location, images, req.params.id]
    );

    res.json({ message: 'Listing updated successfully' });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete listing
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const listing = await query.get(
      'SELECT * FROM listings WHERE id = ?',
      [req.params.id]
    );

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await query.run('DELETE FROM listings WHERE id = ?', [req.params.id]);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark as sold
router.patch('/:id/sold', verifyToken, async (req, res) => {
  try {
    const listing = await query.get(
      'SELECT * FROM listings WHERE id = ?',
      [req.params.id]
    );

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await query.run(
      'UPDATE listings SET status = ? WHERE id = ?',
      ['sold', req.params.id]
    );

    res.json({ message: 'Listing marked as sold' });
  } catch (error) {
    console.error('Mark as sold error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get seller's other listings
router.get('/:id/seller-listings', async (req, res) => {
  try {
    const listing = await query.get(
      'SELECT user_id FROM listings WHERE id = ?',
      [req.params.id]
    );

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const otherListings = await query.all(
      `SELECT * FROM listings WHERE user_id = ? AND id != ? AND status = ? ORDER BY created_at DESC LIMIT 6`,
      [listing.user_id, req.params.id, 'active']
    );

    res.json(otherListings);
  } catch (error) {
    console.error('Get seller listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Report listing
router.post('/:id/report', async (req, res) => {
  try {
    const { reason } = req.body;
    
    // In a real implementation, this would send an email to admin
    console.log(`Listing ${req.params.id} reported: ${reason}`);
    
    res.json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Report listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

