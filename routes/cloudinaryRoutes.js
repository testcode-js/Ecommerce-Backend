const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary, uploadMultipleToCloudinary } = require('../middleware/upload');
const cloudinaryService = require('../services/cloudinaryService');
const asyncHandler = require('express-async-handler');

// Upload single file to Cloudinary
router.post('/upload', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const options = {
    folder: req.body.folder || 'ecommerce',
    resourceType: req.body.resourceType || 'auto',
    quality: req.body.quality || 'auto',
    fetchFormat: req.body.fetchFormat || 'auto'
  };

  const result = await uploadToCloudinary(req.file, options);
  
  res.json({
    success: true,
    data: result
  });
}));

// Upload multiple files to Cloudinary
router.post('/upload-multiple', upload.array('files', 10), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const options = {
    folder: req.body.folder || 'ecommerce',
    resourceType: req.body.resourceType || 'auto',
    quality: req.body.quality || 'auto',
    fetchFormat: req.body.fetchFormat || 'auto'
  };

  const result = await uploadMultipleToCloudinary(req.files, options);
  
  res.json({
    success: true,
    data: result
  });
}));

// List all files in Cloudinary folder
router.get('/list', asyncHandler(async (req, res) => {
  const folder = req.query.folder || 'ecommerce';
  const options = {
    maxResults: parseInt(req.query.maxResults) || 100,
    next_cursor: req.query.next_cursor
  };

  const result = await cloudinaryService.listFiles(folder, options);
  
  res.json({
    success: true,
    data: result
  });
}));

// Get file details
router.get('/details/:publicId', asyncHandler(async (req, res) => {
  const { publicId } = req.params;
  const resourceType = req.query.resourceType || 'image';
  
  const result = await cloudinaryService.getFileDetails(publicId, resourceType);
  
  res.json({
    success: true,
    data: result
  });
}));

// Delete a file from Cloudinary
router.delete('/file/:publicId', asyncHandler(async (req, res) => {
  const { publicId } = req.params;
  const resourceType = req.query.resourceType || 'image';
  
  const result = await cloudinaryService.deleteFile(publicId, resourceType);
  
  res.json({
    success: true,
    data: result
  });
}));

// Delete multiple files
router.delete('/files', asyncHandler(async (req, res) => {
  const { publicIds } = req.body;
  const resourceType = req.query.resourceType || 'image';
  
  if (!publicIds || !Array.isArray(publicIds)) {
    return res.status(400).json({ 
      success: false, 
      message: 'publicIds array is required' 
    });
  }

  const result = await cloudinaryService.deleteMultipleFiles(publicIds, resourceType);
  
  res.json({
    success: true,
    data: result
  });
}));

// Generate signed URL for private files
router.post('/signed-url', asyncHandler(async (req, res) => {
  const { publicId, transformations } = req.body;
  
  if (!publicId) {
    return res.status(400).json({ 
      success: false, 
      message: 'publicId is required' 
    });
  }

  const result = await cloudinaryService.generateSignedUrl(publicId, transformations);
  
  res.json({
    success: true,
    data: result
  });
}));

// Transform image
router.post('/transform', asyncHandler(async (req, res) => {
  const { publicId, transformations } = req.body;
  
  if (!publicId) {
    return res.status(400).json({ 
      success: false, 
      message: 'publicId is required' 
    });
  }

  const result = await cloudinaryService.transformImage(publicId, transformations);
  
  res.json({
    success: true,
    data: result
  });
}));

// Get upload preset configuration
router.get('/upload-config', asyncHandler(async (req, res) => {
  const result = cloudinaryService.getUploadPreset();
  
  res.json({
    success: true,
    data: result
  });
}));

module.exports = router;
