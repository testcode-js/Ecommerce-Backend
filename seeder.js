require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    console.log('Data cleared...');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@easyshop.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'user@easyshop.com',
      password: 'user123',
      role: 'user',
    });

    console.log('Users created...');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Electronic gadgets and devices' },
      { name: 'Fashion', description: 'Clothing, shoes and accessories' },
      { name: 'Home & Living', description: 'Furniture, decor and kitchen items' },
      { name: 'Books', description: 'Books, novels and educational material' },
      { name: 'Sports', description: 'Sports equipment and fitness gear' },
    ]);

    console.log('Categories created...');

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
        price: 2999,
        originalPrice: 4999,
        brand: 'SoundMax',
        category: categories[0]._id,
        stock: 50,
        isFeatured: true,
        image: '',
      },
      {
        name: 'Smart Watch Pro',
        description: 'Feature-packed smartwatch with health monitoring and GPS',
        price: 5499,
        originalPrice: 7999,
        brand: 'TechFit',
        category: categories[0]._id,
        stock: 30,
        isFeatured: true,
        image: '',
      },
      {
        name: 'Cotton Casual T-Shirt',
        description: 'Comfortable 100% cotton t-shirt available in multiple colors',
        price: 599,
        originalPrice: 999,
        brand: 'StyleHub',
        category: categories[1]._id,
        stock: 100,
        isFeatured: true,
        image: '',
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes with cushioned soles for maximum comfort',
        price: 3499,
        originalPrice: 4999,
        brand: 'SprintX',
        category: categories[4]._id,
        stock: 40,
        isFeatured: true,
        image: '',
      },
      {
        name: 'JavaScript: The Good Parts',
        description: 'A classic guide to the best features of JavaScript',
        price: 399,
        originalPrice: 599,
        brand: "O'Reilly",
        category: categories[3]._id,
        stock: 200,
        isFeatured: false,
        image: '',
      },
    ]);

    console.log('Products created...');

    // Create sample coupons
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        description: '10% off on your first order',
        discountType: 'percentage',
        discountValue: 10,
        minimumPurchase: 500,
        maxDiscount: 200,
        usageLimit: 100,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
      {
        code: 'FLAT200',
        description: 'Flat ₹200 off on orders above ₹1500',
        discountType: 'fixed',
        discountValue: 200,
        minimumPurchase: 1500,
        usageLimit: 50,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    ]);

    console.log('Coupons created...');

    console.log('\n=== Seed Complete ===');
    console.log('Admin: admin@easyshop.com / admin123');
    console.log('User:  user@easyshop.com / user123');
    console.log('=====================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
