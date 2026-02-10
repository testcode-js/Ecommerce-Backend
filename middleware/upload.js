const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinaryService = require('../services/cloudinaryService');

// Temporary storage configuration
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = 'temp-uploads/';
    // Ensure directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (Images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
};

// Multer upload instance
const upload = multer({
  storage: tempStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB limit (increased from 5MB)
    files: 10 // Max 10 files at once
  },
  fileFilter,
});

// Helper: Upload single file to Cloudinary
const uploadToCloudinary = async (file, options = {}) => {
  try {
    if (!file || !file.path) throw new Error('No file provided for upload');

    const result = await cloudinaryService.uploadFile(file.path, {
      folder: options.folder || 'ecommerce',
      resourceType: options.resourceType || 'auto',
      quality: options.quality || 'auto',
      fetchFormat: options.fetchFormat || 'auto',
      ...options
    });

    // Clean up temp file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return result.data; // Return the data object directly
  } catch (error) {
    // Clean up temp file on error
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Helper: Upload multiple files to Cloudinary
const uploadMultipleToCloudinary = async (files, options = {}) => {
  try {
    if (!files || files.length === 0) throw new Error('No files provided for upload');

    // We can use cloudinaryService.uploadMultipleFiles, but we need to pass paths
    // Actually, let's map it manually to handle temp cleanup per file if needed, 
    // or just pass to service which takes array of objects with path?
    // My new service takes array of file objects with .path property.
    // So passing `files` (multer objects have .path) works directly!

    // Wait, let's look at service: 
    // files.map(file => this.uploadFile(file.path, options))
    // Yes, expected `files` to have `.path`. Multer files DO have `.path`.

    const result = await cloudinaryService.uploadMultipleFiles(files, {
      folder: options.folder || 'ecommerce',
      ...options
    });

    // Clean up all temp files
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    return result.data;
  } catch (error) {
    // Clean up files on error
    if (files) {
      files.forEach(file => {
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    console.error('Cloudinary multiple upload error:', error);
    throw error;
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary
};
