const express = require('express');
const { verifyToken, isAdmin } = require('../config/auth');
const dataStore = require('../data/dataStore');

const router = express.Router();
const REPORT_STATUSES = ['pending', 'reviewing', 'resolved', 'dismissed'];

// Middleware to check admin access
router.use(verifyToken, isAdmin);

// Get all users
router.get('/users', (req, res) => {
  try {
    const users = dataStore
      .getUsers()
      .sort((a, b) => Number(b.id) - Number(a.id))
      .map(({ password, ...rest }) => rest);

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all listings
router.get('/listings', (req, res) => {
  try {
    const listings = dataStore
      .getListings()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete listing
router.delete('/listings/:id', (req, res) => {
  try {
    const deleted = dataStore.deleteListing(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Ban user
router.patch('/users/:id/ban', (req, res) => {
  try {
    const updated = dataStore.updateUser(req.params.id, { status: 'banned' });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unban user
router.patch('/users/:id/unban', (req, res) => {
  try {
    const updated = dataStore.updateUser(req.params.id, { status: 'active' });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User unbanned successfully' });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get dashboard stats
router.get('/stats', (req, res) => {
  try {
    const stats = dataStore.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve listing (can be extended for approval workflow)
router.patch('/listings/:id/approve', (req, res) => {
  try {
    const listing = dataStore.markListingStatus(req.params.id, 'active');
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing approved successfully' });
  } catch (error) {
    console.error('Approve listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all user reports
router.get('/reports', (req, res) => {
  try {
    const reports = dataStore.getReports();
    const listings = dataStore.getListings();
    const users = dataStore.getUsers();

    const enriched = reports.map(report => {
      const listing = listings.find(item => Number(item.id) === Number(report.listing_id));
      const reporter = users.find(user => Number(user.id) === Number(report.reporter_id));
      return {
        ...report,
        reporter_name: report.reporter_name || reporter?.name || null,
        reporter_email: report.reporter_email || reporter?.email || null,
        listing_title: listing?.title || null,
        listing_status: listing?.status || null
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update report status
router.patch('/reports/:id/status', (req, res) => {
  try {
    const { status } = req.body;

    if (!REPORT_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid report status' });
    }

    const updated = dataStore.updateReportStatus(req.params.id, status);

    if (!updated) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report status updated' });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Debug endpoint: Get all users with full details (including password hash for verification)
router.get('/debug/users', (req, res) => {
  try {
    const users = dataStore.getUsers();
    res.json({
      totalCount: users.length,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        matric_number: u.matric_number,
        role: u.role,
        status: u.status,
        created_at: u.created_at,
        hasPassword: !!u.password
      }))
    });
  } catch (error) {
    console.error('Debug users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

