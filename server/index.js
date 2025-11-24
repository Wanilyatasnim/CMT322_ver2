const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Initialize database
db.init().then(async () => {
  console.log('Database initialized successfully');
  
  // Auto-seed sample data if database is empty (for Railway deployment)
  await seedDatabaseIfEmpty();
  await replaceLegacyPlaceholderImages();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});

// Function to check and fix database integrity
async function checkDatabaseIntegrity() {
  try {
    const { query } = require('./config/database');
    
    // Check for orphaned listings (listings with invalid user_ids)
    const orphanedListings = await query.all(
      `SELECT l.id, l.user_id, l.title 
       FROM listings l 
       LEFT JOIN users u ON l.user_id = u.id 
       WHERE u.id IS NULL`
    );
    
    if (orphanedListings && orphanedListings.length > 0) {
      console.log(`⚠ Found ${orphanedListings.length} orphaned listing(s). Cleaning up...`);
      for (const listing of orphanedListings) {
        await query.run('DELETE FROM listings WHERE id = ?', [listing.id]);
        console.log(`  ✓ Deleted orphaned listing: ${listing.title} (ID: ${listing.id})`);
      }
    }
    
    console.log('✓ Database integrity check completed');
  } catch (error) {
    console.error('Error checking database integrity:', error);
  }
}

// Function to seed database if empty
async function seedDatabaseIfEmpty() {
  try {
    const { query } = require('./config/database');
    const bcrypt = require('bcryptjs');
    
    // First, check database integrity
    await checkDatabaseIntegrity();
    
    // Always check and create sample users if they don't exist
    console.log('Checking for sample users...');
    
    // Sample users data
    const sampleUsers = [
      { name: 'Ahmad Zaki', email: 'ahmad.zaki@student.usm.my', password: bcrypt.hashSync('password123', 10), phone: '0123456789', matric: '123456' },
      { name: 'Siti Sarah', email: 'siti.sarah@student.usm.my', password: bcrypt.hashSync('password123', 10), phone: '0198765432', matric: '234567' },
      { name: 'Lee Wei Ming', email: 'lee.weiming@student.usm.my', password: bcrypt.hashSync('password123', 10), phone: '0165432198', matric: '345678' }
    ];
    
    // Store created user IDs
    const userIds = {};
    
    // Check and create each sample user if they don't exist
    for (const userData of sampleUsers) {
      let existingUser = await query.get(
        'SELECT * FROM users WHERE email = ?',
        [userData.email]
      );
      
      if (!existingUser) {
        const result = await query.run(
          `INSERT INTO users (name, email, password, phone, matric_number) VALUES (?, ?, ?, ?, ?)`,
          [userData.name, userData.email, userData.password, userData.phone, userData.matric]
        );
        console.log(`✓ Created sample user: ${userData.name} (ID: ${result.id})`);
        userIds[userData.email] = result.id;
      } else {
        userIds[userData.email] = existingUser.id;
        console.log(`✓ Sample user exists: ${userData.name} (ID: ${existingUser.id})`);
      }
    }
    
    // Check if listings exist (only seed listings if database is empty)
    const listings = await query.all("SELECT COUNT(*) as count FROM listings");
    const hasListings = listings && listings.length > 0 && listings[0].count > 0;
    
    if (!hasListings) {
      console.log('Database has no listings. Seeding sample listings...');
      
      // Use stored user IDs
      const user1Id = userIds['ahmad.zaki@student.usm.my'];
      const user2Id = userIds['siti.sarah@student.usm.my'];
      const user3Id = userIds['lee.weiming@student.usm.my'];
      
      if (user1Id && user2Id && user3Id) {
        // Sample listings (using actual user IDs)
        const placeholderImage = 'https://placehold.co/800x600/cccccc/666666?text=No+Image';
        const listingsData = [
          [user1Id, 'MacBook Pro 13 inch M1 Chip', 'Excellent condition MacBook Pro with M1 chip. 256GB SSD, 8GB RAM.', 3500.00, 'Electronics', 'Like New', 'Aman Damai Hostel', placeholderImage],
          [user2Id, 'IKEA Study Table with Drawer', 'Good quality study table with built-in drawer. White color.', 150.00, 'Furniture', 'Good', 'Ria Hostel', placeholderImage],
          [user3Id, 'Calculus Textbook - James Stewart', 'Used for one semester only, minimal highlights.', 80.00, 'Books', 'Good', 'Cahaya Gemilang Hostel', placeholderImage],
          [user1Id, 'Samsung Galaxy S21 Ultra', 'Excellent condition, screen protector included.', 2200.00, 'Electronics', 'Like New', 'Aman Damai Hostel', placeholderImage],
          [user2Id, 'Mini Refrigerator - Sharp', 'Perfect for hostel room. Energy efficient.', 280.00, 'Appliances', 'Good', 'Ria Hostel', placeholderImage],
          [user3Id, 'Chemistry Lab Coat', 'White lab coat for chemistry practical classes.', 35.00, 'Others', 'Good', 'Cahaya Gemilang Hostel', placeholderImage],
          [user1Id, 'AirPods Pro 2nd Generation', 'Apple AirPods Pro 2nd generation with MagSafe.', 750.00, 'Electronics', 'Like New', 'Aman Damai Hostel', placeholderImage]
        ];
        
        for (const listing of listingsData) {
          await query.run(
            `INSERT INTO listings (user_id, title, description, price, category, condition, location, images, status, clicks) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 0)`,
            listing
          );
        }
        
        console.log('✓ Sample listings created');
      } else {
        console.log('⚠ Could not create listings: missing user IDs');
      }
    } else {
      console.log('✓ Database already has listings');
    }
    
    console.log('✓ Database seeding check completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Replace old placeholder filenames/URLs with working placeholder image
async function replaceLegacyPlaceholderImages() {
  try {
    const { query } = require('./config/database');
    const placeholderImage = 'https://placehold.co/800x600/cccccc/666666?text=No+Image';
    const legacyFilenames = ['macbook.jpg', 'table.jpg', 'book.jpg', 'samsung.jpg', 'fridge.jpg', 'labcoat.jpg', 'airpods.jpg'];

    for (const legacyName of legacyFilenames) {
      await query.run(
        'UPDATE listings SET images = ? WHERE images = ?',
        [placeholderImage, legacyName]
      );
    }

    await query.run(
      'UPDATE listings SET images = ? WHERE images LIKE ?',
      [placeholderImage, 'https://via.placeholder.com%']
    );
  } catch (error) {
    console.error('Error normalizing placeholder images:', error);
  }
}

module.exports = app;

