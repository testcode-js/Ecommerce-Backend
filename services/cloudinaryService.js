const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Optional: Remove if not using direct storage

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class CloudinaryService {
  constructor() {
    this.cloudinary = cloudinary;
  }

  // Upload file to Cloudinary
  async uploadFile(filePath, options = {}) {
    try {
      if (!filePath) throw new Error('File path is required');

      const uploadOptions = {
        folder: options.folder || 'ecommerce',
        resource_type: options.resourceType || 'auto',
        quality: options.quality || 'auto',
        fetch_format: options.fetchFormat || 'auto',
        use_filename: true,
        unique_filename: true,
        ...options
      };

      const result = await this.cloudinary.uploader.upload(filePath, uploadOptions);

      return {
        success: true,
        data: {
          url: result.secure_url, // Always prefer secure_url
          secure_url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          resourceType: result.resource_type,
          bytes: result.bytes,
          created_at: result.created_at
        }
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, options = {}) {
    try {
      if (!files || !Array.isArray(files)) throw new Error('Files array is required');

      const uploadPromises = files.map(file =>
        this.uploadFile(file.path, options)
      );

      const results = await Promise.all(uploadPromises);

      return {
        success: true,
        data: {
          files: results.map(r => r.data)
        }
      };
    } catch (error) {
      console.error('Cloudinary multiple upload error:', error);
      throw new Error(`Cloudinary multiple upload failed: ${error.message}`);
    }
  }

  // Delete file
  async deleteFile(publicId, resourceType = 'image') {
    try {
      if (!publicId) throw new Error('Public ID is required');

      const result = await this.cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });

      return {
        success: true,
        data: {
          result: result.result,
          publicId
        }
      };
    } catch (error) {
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }

  // Delete multiple files
  async deleteMultipleFiles(publicIds, resourceType = 'image') {
    try {
      if (!publicIds || !Array.isArray(publicIds)) throw new Error('Public IDs array is required');

      const result = await this.cloudinary.api.delete_resources(publicIds, {
        resource_type: resourceType
      });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw new Error(`Cloudinary bulk delete failed: ${error.message}`);
    }
  }

  // List files
  async listFiles(folder = 'ecommerce', options = {}) {
    try {
      const result = await this.cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: options.maxResults || 100,
        next_cursor: options.next_cursor,
        ...options
      });

      return {
        success: true,
        data: {
          files: result.resources,
          total: result.total_count,
          next_cursor: result.next_cursor
        }
      };
    } catch (error) {
      throw new Error(`Cloudinary list failed: ${error.message}`);
    }
  }

  // Get file details
  async getFileDetails(publicId, resourceType = 'image') {
    try {
      const result = await this.cloudinary.api.resource(publicId, {
        resource_type: resourceType
      });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw new Error(`Cloudinary details failed: ${error.message}`);
    }
  }

  // Generate signed URL
  async generateSignedUrl(publicId, options = {}) {
    try {
      const url = this.cloudinary.url(publicId, {
        sign_url: true,
        secure: true,
        ...options
      });

      return {
        success: true,
        data: { url }
      };
    } catch (error) {
      throw new Error(`Signed URL generation failed: ${error.message}`);
    }
  }

  // Transform image
  async transformImage(publicId, transformations = {}) {
    try {
      const url = this.cloudinary.url(publicId, {
        secure: true,
        ...transformations
      });

      return {
        success: true,
        data: { url }
      };
    } catch (error) {
      throw new Error(`Image transformation failed: ${error.message}`);
    }
  }

  // Get upload preset configuration
  getUploadPreset() {
    return {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ecommerce_uploads'
    };
  }
}

module.exports = new CloudinaryService();
