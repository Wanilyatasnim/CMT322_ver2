const { db, query, init } = require('../config/database');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Sample users
const sampleUsers = [
  {
    name: 'Ahmad Zaki',
    email: 'ahmad.zaki@student.usm.my',
    password: bcrypt.hashSync('password123', 10),
    phone: '0123456789',
    matric_number: '123456'
  },
  {
    name: 'Siti Sarah',
    email: 'siti.sarah@student.usm.my',
    password: bcrypt.hashSync('password123', 10),
    phone: '0198765432',
    matric_number: '234567'
  },
  {
    name: 'Lee Wei Ming',
    email: 'lee.weiming@student.usm.my',
    password: bcrypt.hashSync('password123', 10),
    phone: '0165432198',
    matric_number: '345678'
  }
];

const placeholderImage = 'https://placehold.co/800x600/cccccc/666666?text=No+Image';

// Sample listings
const sampleListings = [
  {
    user_id: 1, // Ahmad Zaki
    title: 'MacBook Pro 13 inch M1 Chip',
    description: 'Excellent condition MacBook Pro with M1 chip. 256GB SSD, 8GB RAM. Bought in 2022, rarely used. Comes with original charger and box.',
    price: 3500.00,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Aman Damai Hostel',
    images: placeholderImage,
    status: 'active',
    clicks: 15
  },
  {
    user_id: 2, // Siti Sarah
    title: 'IKEA Study Table with Drawer',
    description: 'Good quality study table with built-in drawer. Perfect for dorm room. White color, modern design. Dimensions: 120cm x 60cm.',
    price: 150.00,
    category: 'Furniture',
    condition: 'Good',
    location: 'Ria Hostel',
    images: placeholderImage,
    status: 'active',
    clicks: 8
  },
  {
    user_id: 3, // Lee Wei Ming
    title: 'Calculus Textbook - James Stewart 8th Edition',
    description: 'Calculus Early Transcendentals 8th edition by James Stewart. Used for one semester only, minimal highlights. Almost new condition.',
    price: 80.00,
    category: 'Books',
    condition: 'Good',
    location: 'Cahaya Gemilang Hostel',
    images: placeholderImage,
    status: 'active',
    clicks: 3
  },
  {
    user_id: 1, // Ahmad Zaki
    title: 'Samsung Galaxy S21 Ultra',
    description: 'Samsung Galaxy S21 Ultra 256GB. Excellent condition, screen protector and phone case included. Fast charging cable and adapter. Only minor scratches on back.',
    price: 2200.00,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Aman Damai Hostel',
    images: placeholderImage,
    status: 'active',
    clicks: 22
  },
  {
    user_id: 2, // Siti Sarah
    title: 'Mini Refrigerator - Sharp',
    description: 'Compact mini refrigerator 88L. Perfect for hostel room. Energy efficient, quiet operation. Comes with ice tray. Clean and working perfectly.',
    price: 280.00,
    category: 'Appliances',
    condition: 'Good',
    location: 'Ria Hostel',
    images: placeholderImage,
    status: 'active',
    clicks: 12
  },
  {
    user_id: 3, // Lee Wei Ming
    title: 'Chemistry Lab Coat',
    description: 'White lab coat for chemistry practical classes. Size L, very clean. Only used for one semester. Perfect for new chemistry students.',
    price: 35.00,
    category: 'Others',
    condition: 'Good',
    location: 'Cahaya Gemilang Hostel',
    images: placeholderImage,
    status: 'active',
    clicks: 5
  },
  {
    user_id: 1, // Ahmad Zaki
    title: 'AirPods Pro 2nd Generation',
    description: 'Apple AirPods Pro 2nd generation with MagSafe charging case. Active Noise Cancellation works perfectly. Includes all earbud sizes and original box.',
    price: 750.00,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Aman Damai Hostel',
    images: placeholderImage,
    status: 'active',
    clicks: 18
  }
];

const seedDatabase = async () => {
  try {
    // Initialize database
    await init();
    console.log('Database initialized');

    // Insert sample users (check if they don't exist)
    console.log('\nInserting sample users...');
    for (const user of sampleUsers) {
      const existingUser = await query.get(
        'SELECT * FROM users WHERE email = ?',
        [user.email]
      );
      
      if (!existingUser) {
        const result = await query.run(
          `INSERT INTO users (name, email, password, phone, matric_number) 
           VALUES (?, ?, ?, ?, ?)`,
          [user.name, user.email, user.password, user.phone, user.matric_number]
        );
        console.log(`✓ Created user: ${user.name} (ID: ${result.id})`);
      } else {
        console.log(`- User already exists: ${user.name}`);
      }
    }

    // Insert sample listings
    console.log('\nInserting sample listings...');
    for (const listing of sampleListings) {
      const result = await query.run(
        `INSERT INTO listings (user_id, title, description, price, category, condition, location, images, status, clicks, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || abs(random() % 30) || ' days'))`,
        [
          listing.user_id,
          listing.title,
          listing.description,
          listing.price,
          listing.category,
          listing.condition,
          listing.location,
          listing.images,
          listing.status,
          listing.clicks
        ]
      );
      console.log(`✓ Created listing: ${listing.title} (ID: ${result.id})`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Note: Sample listings use placeholder image names.');
    console.log('   You can add actual images to the uploads/ folder or upload them through the UI.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

