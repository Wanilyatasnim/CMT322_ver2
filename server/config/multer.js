const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary is configured
let hasCloudinaryConfig = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

let storage;

if (hasCloudinaryConfig) {
  // Use Cloudinary for persistent storage
  try {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('./cloudinary');
    
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: '2street-listings', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { width: 800, height: 800, crop: 'limit' }, // Resize images to max 800x800
          { quality: 'auto' } // Auto optimize quality
        ]
      }
    });
    
    console.log('[Multer] ✅ Using Cloudinary for image storage');
    console.log('[Multer] Cloudinary folder: 2street-listings');
  } catch (error) {
    console.error('[Multer] Cloudinary setup failed, falling back to local storage:', error.message);
    hasCloudinaryConfig = false;
  }
}

if (!hasCloudinaryConfig) {
  // Fallback to local storage (for development or if Cloudinary not configured)
  const uploadDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  console.log('[Multer] ⚠️ Using local storage (uploads/ directory)');
  console.warn('[Multer] ⚠️ WARNING: Local storage is ephemeral on Railway. Images will be lost on redeploy.');
  console.warn('[Multer] ⚠️ To fix this, set these environment variables in Railway:');
  console.warn('[Multer]    - CLOUDINARY_CLOUD_NAME');
  console.warn('[Multer]    - CLOUDINARY_API_KEY');
  console.warn('[Multer]    - CLOUDINARY_API_SECRET');
}

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

module.exports = upload;
