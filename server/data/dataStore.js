const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = __dirname;
const dataPath = path.join(dataDir, 'data.json');

const nowIso = () => new Date().toISOString();

const buildDefaultData = () => {
  const createdAt = nowIso();
  return {
    users: [
      {
        id: 1,
        name: 'Admin',
        email: 'admin@2street.usm.my',
        password: bcrypt.hashSync('admin123', 10),
        phone: '0123456789',
        matric_number: 'ADMIN001',
        role: 'admin',
        status: 'active',
        created_at: createdAt
      },
      {
        id: 2,
        name: 'Student User',
        email: 'student@2street.usm.my',
        password: bcrypt.hashSync('user123', 10),
        phone: '0198765432',
        matric_number: 'STU001',
        role: 'user',
        status: 'active',
        created_at: createdAt
      }
    ],
    listings: [
      {
        id: 1,
        user_id: 2,
        title: 'Sample Laptop',
        description: 'Reliable laptop for class and assignments. Includes charger and sleeve.',
        price: 1800,
        category: 'Electronics',
        condition: 'Good',
        location: 'USM Main Campus',
        images: 'https://placehold.co/600x400?text=Sample+Laptop',
        status: 'active',
        clicks: 7,
        created_at: createdAt
      },
      {
        id: 2,
        user_id: 2,
        title: 'Math Textbook Bundle',
        description: 'Bundle of calculus and statistics books from last semester.',
        price: 90,
        category: 'Books',
        condition: 'Like New',
        location: 'Desasiswa Tekun',
        images: 'https://placehold.co/600x400?text=Math+Books',
        status: 'active',
        clicks: 3,
        created_at: createdAt
      }
    ],
    reports: []
  };
};

const safeClone = (data) => (data ? JSON.parse(JSON.stringify(data)) : null);

let data = loadData();

function loadData() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dataPath)) {
      const defaults = buildDefaultData();
      fs.writeFileSync(dataPath, JSON.stringify(defaults, null, 2));
      return defaults;
    }

    const fileRaw = fs.readFileSync(dataPath, 'utf-8');
    const parsed = JSON.parse(fileRaw || '{}');

    if (!Array.isArray(parsed.users) || parsed.users.length === 0) {
      const defaults = buildDefaultData();
      fs.writeFileSync(dataPath, JSON.stringify(defaults, null, 2));
      return defaults;
    }

    parsed.listings = Array.isArray(parsed.listings) ? parsed.listings : [];
    parsed.reports = Array.isArray(parsed.reports) ? parsed.reports : [];
    return parsed;
  } catch (error) {
    console.error('Failed to load local data store. Rebuilding defaults.', error);
    const defaults = buildDefaultData();
    fs.writeFileSync(dataPath, JSON.stringify(defaults, null, 2));
    return defaults;
  }
}

function persist() {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function nextId(collection) {
  const list = data[collection];
  if (!list || list.length === 0) return 1;
  return Math.max(...list.map(item => Number(item.id) || 0)) + 1;
}

// User helpers
function getUsers() {
  return safeClone(data.users);
}

function getUserById(id) {
  return safeClone(data.users.find(user => Number(user.id) === Number(id)));
}

function getUserByEmail(email) {
  if (!email) return null;
  const targetEmail = email.toLowerCase();
  return safeClone(
    data.users.find(user => user.email.toLowerCase() === targetEmail)
  );
}

function createUser(userData) {
  const newUser = {
    id: nextId('users'),
    name: userData.name,
    email: (userData.email || '').toLowerCase(),
    password: userData.password,
    phone: userData.phone || null,
    matric_number: userData.matric_number || null,
    role: userData.role || 'user',
    status: userData.status || 'active',
    created_at: nowIso()
  };

  data.users.push(newUser);
  persist();
  return safeClone(newUser);
}

function updateUser(id, updates) {
  const index = data.users.findIndex(user => Number(user.id) === Number(id));
  if (index === -1) return null;

  data.users[index] = {
    ...data.users[index],
    ...updates
  };

  persist();
  return safeClone(data.users[index]);
}

// Listing helpers
function getListings() {
  return safeClone(data.listings);
}

function getListingById(id) {
  return safeClone(data.listings.find(listing => Number(listing.id) === Number(id)));
}

function createListing(listingData) {
  const newListing = {
    id: nextId('listings'),
    user_id: Number(listingData.user_id),
    title: listingData.title,
    description: listingData.description,
    price: Number(listingData.price),
    category: listingData.category,
    condition: listingData.condition,
    location: listingData.location || null,
    images: listingData.images,
    status: listingData.status || 'active',
    clicks: 0,
    created_at: nowIso()
  };

  data.listings.unshift(newListing);
  persist();
  return safeClone(newListing);
}

function updateListing(id, updates) {
  const index = data.listings.findIndex(listing => Number(listing.id) === Number(id));
  if (index === -1) return null;

  data.listings[index] = {
    ...data.listings[index],
    ...updates,
    price: updates.price !== undefined ? Number(updates.price) : data.listings[index].price
  };

  persist();
  return safeClone(data.listings[index]);
}

function deleteListing(id) {
  const initialLength = data.listings.length;
  data.listings = data.listings.filter(listing => Number(listing.id) !== Number(id));
  const changed = data.listings.length !== initialLength;
  if (changed) persist();
  return changed;
}

function markListingStatus(id, status) {
  return updateListing(id, { status });
}

function incrementListingClicks(id) {
  const index = data.listings.findIndex(listing => Number(listing.id) === Number(id));
  if (index === -1) return null;
  data.listings[index].clicks += 1;
  persist();
  return safeClone(data.listings[index]);
}

function getListingsByUserId(userId) {
  return safeClone(
    data.listings.filter(listing => Number(listing.user_id) === Number(userId))
  );
}

// Reports
function getReports() {
  return safeClone(data.reports);
}

function createReport(reportData) {
  const newReport = {
    id: nextId('reports'),
    listing_id: Number(reportData.listing_id),
    reporter_id: Number(reportData.reporter_id),
    reporter_name: reportData.reporter_name || null,
    reporter_email: reportData.reporter_email || null,
    reason: reportData.reason,
    status: 'pending',
    created_at: nowIso()
  };
  data.reports.unshift(newReport);
  persist();
  return safeClone(newReport);
}

function updateReportStatus(id, status) {
  const index = data.reports.findIndex(report => Number(report.id) === Number(id));
  if (index === -1) return null;
  data.reports[index].status = status;
  persist();
  return safeClone(data.reports[index]);
}

function getStats() {
  const totalUsers = data.users.length;
  const totalListings = data.listings.length;
  const activeListings = data.listings.filter(listing => listing.status === 'active').length;
  const soldListings = data.listings.filter(listing => listing.status === 'sold').length;

  return {
    totalUsers,
    totalListings,
    activeListings,
    soldListings
  };
}

module.exports = {
  init: () => {
    data = loadData();
    return safeClone(data);
  },
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  markListingStatus,
  incrementListingClicks,
  getListingsByUserId,
  getReports,
  createReport,
  updateReportStatus,
  getStats
};


