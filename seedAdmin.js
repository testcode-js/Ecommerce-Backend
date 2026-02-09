const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@ecommerce.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists!');
      console.log('Email: admin@ecommerce.com');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123456',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('================================');
    console.log('Email: admin@ecommerce.com');
    console.log('Password: admin123456');
    console.log('================================');
    console.log('⚠️  Change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
