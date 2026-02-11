// Debug script to test Cloudinary upload
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    // Create a simple test file
    const testContent = 'test image content';
    fs.writeFileSync('test-image.jpg', testContent);
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream('test-image.jpg'), 'test-image.jpg');
    formData.append('folder', 'ecommerce/test');
    
    console.log('Testing upload to: http://localhost:5000/api/cloudinary/upload');
    
    const response = await axios.post('http://localhost:5000/api/cloudinary/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Upload successful:', response.data);
    
    // Clean up
    fs.unlinkSync('test-image.jpg');
    
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
  }
}

testUpload();
