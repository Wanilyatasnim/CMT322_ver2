const express = require('express');
const multer = require('../config/multer');
const { verifyToken } = require('../config/auth');
const dataStore = require('../data/dataStore');

const router = express.Router();

const DEFAULT_IMAGE_BY_CATEGORY = {
  Electronics: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  Furniture: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
  Books: 'https://images.unsplash.com/photo-1529148482759-b35b25c5c27e?auto=format&fit=crop&w=900&q=80',
  Appliances: 'https://images.unsplash.com/photo-1507086182422-97bd7ca241ef?auto=format&fit=crop&w=900&q=80',
  Others: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80'
};

const GENERIC_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80';

const getDefaultImage = (category) => DEFAULT_IMAGE_BY_CATEGORY[category] || GENERIC_FALLBACK_IMAGE;

// Get all listings with search and filters
router.get('/', (req, res) => {
  try {
    const {
      search,
      category,
      condition,
      location,
      minPrice,
      maxPrice,
      sortBy = 'newest'
    } = req.query;

    let listings = dataStore.getListings().filter(listing => listing.status === 'active');

    if (search) {
      const keyword = search.toLowerCase();
      listings = listings.filter(
        listing =>
          listing.title.toLowerCase().includes(keyword) ||
          listing.description.toLowerCase().includes(keyword)
      );
    }

    if (category) {
      listings = listings.filter(listing => listing.category === category);
    }

    if (condition) {
      listings = listings.filter(listing => listing.condition === condition);
    }

    if (location) {
      const locationTerm = location.toLowerCase();
      listings = listings.filter(
        listing => listing.location && listing.location.toLowerCase().includes(locationTerm)
      );
    }

    if (minPrice) {
      listings = listings.filter(listing => listing.price >= Number(minPrice));
    }
    if (maxPrice) {
      listings = listings.filter(listing => listing.price <= Number(maxPrice));
    }

    listings.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    res.json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single listing
router.get('/:id', (req, res) => {
  try {
    const listing = dataStore.getListingById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const updated = dataStore.incrementListingClicks(listing.id) || listing;
    res.json(updated);
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create listing
router.post('/', verifyToken, multer.array('images', 3), (req, res) => {
  try {
    const { title, description, price, category, condition, location } = req.body;

    if (!title || !description || !price || !category || !condition) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    const uploadedImages =
      req.files && req.files.length > 0
        ? req.files.map(file => file.path || file.filename)
        : [getDefaultImage(category)];
    const images = uploadedImages.join(',');

    const newListing = dataStore.createListing({
      user_id: req.user.userId,
      title,
      description,
      price,
      category,
      condition,
      location,
      images
    });

    res.status(201).json({
      message: 'Listing created successfully',
      id: newListing.id
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update listing
router.put('/:id', verifyToken, multer.array('images', 3), (req, res) => {
  try {
    const listing = dataStore.getListingById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (Number(listing.user_id) !== Number(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to edit this listing' });
    }

    const { title, description, price, category, condition, location, existingImages } = req.body;

    const existingImagesArray = existingImages
      ? existingImages.split(',').filter(img => img.trim())
      : [];
    const newImagesArray =
      req.files && req.files.length > 0
        ? req.files.map(file => file.path || file.filename)
        : [];
    const allImages = [...existingImagesArray, ...newImagesArray];
    const images = allImages.length > 0 ? allImages.join(',') : listing.images;

    dataStore.updateListing(req.params.id, {
      title,
      description,
      price,
      category,
      condition,
      location,
      images
    });

    res.json({ message: 'Listing updated successfully' });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete listing
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const listing = dataStore.getListingById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (Number(listing.user_id) !== Number(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    dataStore.deleteListing(req.params.id);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark as sold
router.patch('/:id/sold', verifyToken, (req, res) => {
  try {
    const listing = dataStore.getListingById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (Number(listing.user_id) !== Number(req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    dataStore.markListingStatus(req.params.id, 'sold');

    res.json({ message: 'Listing marked as sold' });
  } catch (error) {
    console.error('Mark as sold error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get seller's other listings
router.get('/:id/seller-listings', (req, res) => {
  try {
    const listing = dataStore.getListingById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const others = dataStore
      .getListings()
      .filter(
        item =>
          Number(item.user_id) === Number(listing.user_id) &&
          Number(item.id) !== Number(listing.id) &&
          item.status === 'active'
      )
      .slice(0, 6);

    res.json(others);
  } catch (error) {
    console.error('Get seller listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Report listing
router.post('/:id/report', verifyToken, (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Please provide a reason for reporting.' });
    }

    const listing = dataStore.getListingById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const reporter = dataStore.getUserById(req.user.userId);

    dataStore.createReport({
      listing_id: listing.id,
      reporter_id: req.user.userId,
      reporter_name: reporter?.name,
      reporter_email: reporter?.email,
      reason: reason.trim()
    });

    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Report listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

