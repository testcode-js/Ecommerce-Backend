require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const Blog = require('./models/Blog');
const Deal = require('./models/Deal');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Blog.deleteMany();
    await Deal.deleteMany();

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

    // Create sample blogs
    await Blog.insertMany([
      {
        title: '10 Fashion Trends for 2024',
        excerpt: 'Discover the latest fashion trends that will dominate 2024. From sustainable fashion to bold colors, we\'ve got you covered.',
        content: 'Fashion is constantly evolving, and 2024 brings exciting new trends. Sustainable fashion continues to grow, with more brands focusing on eco-friendly materials. Bold colors like electric blue and vibrant coral are making a comeback. Minimalist designs are being replaced by maximalist patterns. Comfort remains key with oversized silhouettes. Tech-infused clothing with smart fabrics is emerging.',
        author: 'Sarah Johnson',
        authorAvatar: '',
        category: 'Fashion',
        tags: ['fashion', 'trends', '2024', 'sustainable'],
        featuredImage: '',
        status: 'published',
        featured: true,
        publishDate: new Date('2024-01-15'),
        views: 1250,
        likes: 245,
        readTime: '5 min read',
      },
      {
        title: 'How to Build a Sustainable Wardrobe',
        excerpt: 'Learn practical tips for creating an eco-friendly wardrobe without breaking the bank. Small changes can make a big difference.',
        content: 'Building a sustainable wardrobe starts with understanding your personal style. Invest in quality pieces that last longer. Choose natural fabrics like organic cotton, linen, and hemp. Shop second-hand and vintage stores. Learn basic repair skills to extend garment life. Donate or recycle clothes you no longer wear. Every small step counts toward a more sustainable future.',
        author: 'Mike Chen',
        authorAvatar: '',
        category: 'Fashion',
        tags: ['sustainability', 'wardrobe', 'eco-friendly', 'fashion'],
        featuredImage: '',
        status: 'published',
        featured: false,
        publishDate: new Date('2024-01-12'),
        views: 890,
        likes: 189,
        readTime: '7 min read',
      },
      {
        title: 'The Ultimate Guide to Online Shopping',
        excerpt: 'Master the art of online shopping with our comprehensive guide. Find the best deals and avoid common pitfalls.',
        content: 'Online shopping can be overwhelming, but with the right strategies, you can get the best deals. Always compare prices across multiple platforms. Read customer reviews carefully. Check return policies before purchasing. Use coupon codes and cashback apps. Sign up for newsletters to get exclusive discounts. Shop during sale seasons like Black Friday and end-of-season sales.',
        author: 'Emma Wilson',
        authorAvatar: '',
        category: 'Shopping',
        tags: ['shopping', 'guide', 'online', 'deals'],
        featuredImage: '',
        status: 'published',
        featured: true,
        publishDate: new Date('2024-01-10'),
        views: 2100,
        likes: 312,
        readTime: '10 min read',
      },
      {
        title: 'Healthy Meal Prep for Busy Professionals',
        excerpt: 'Save time and eat healthier with these meal prep strategies designed for busy schedules.',
        content: 'Meal prepping is the key to eating healthy when you have a busy schedule. Plan your meals for the week ahead. Cook in bulk on weekends. Invest in quality storage containers. Prepare versatile ingredients that can be used in multiple dishes. Keep healthy snacks readily available. With proper planning, you can enjoy nutritious meals all week long.',
        author: 'Dr. Lisa Park',
        authorAvatar: '',
        category: 'Health',
        tags: ['meal-prep', 'health', 'nutrition', 'busy-professionals'],
        featuredImage: '',
        status: 'published',
        featured: false,
        publishDate: new Date('2024-01-08'),
        views: 1560,
        likes: 167,
        readTime: '8 min read',
      },
    ]);

    console.log('Blogs created...');

    // Create sample deals
    await Deal.insertMany([
      {
        title: 'Summer Fashion Sale',
        description: 'Amazing summer collection with up to 50% off on selected items',
        discountType: 'percentage',
        discountValue: 50,
        originalPrice: 1999,
        dealPrice: 999,
        category: 'Fashion',
        featuredImage: '',
        status: 'active',
        flashDeal: true,
        clearance: false,
        seasonalDeal: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        maxUsage: 100,
        currentUsage: 45,
        stock: 15,
        brand: 'StyleHub',
        rating: 4.5,
        numReviews: 234,
      },
      {
        title: 'Electronics Clearance',
        description: 'Limited time offer on electronics and gadgets',
        discountType: 'percentage',
        discountValue: 40,
        originalPrice: 999,
        dealPrice: 599,
        category: 'Electronics',
        featuredImage: '',
        status: 'active',
        flashDeal: false,
        clearance: true,
        seasonalDeal: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        maxUsage: 50,
        currentUsage: 12,
        stock: 8,
        brand: 'TechPro',
        rating: 4.2,
        numReviews: 156,
      },
      {
        title: 'Winter Special',
        description: 'Cozy winter collection with special discounts',
        discountType: 'percentage',
        discountValue: 35,
        originalPrice: 1299,
        dealPrice: 799,
        category: 'Fashion',
        featuredImage: '',
        status: 'active',
        flashDeal: false,
        clearance: false,
        seasonalDeal: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        maxUsage: 200,
        currentUsage: 89,
        stock: 25,
        brand: 'WarmWear',
        rating: 4.7,
        numReviews: 89,
      },
      {
        title: 'Home Essentials Sale',
        description: 'Special discounts on home and living products',
        discountType: 'fixed',
        discountValue: 200,
        originalPrice: 799,
        dealPrice: 599,
        category: 'Home',
        featuredImage: '',
        status: 'active',
        flashDeal: false,
        clearance: false,
        seasonalDeal: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        maxUsage: 150,
        currentUsage: 32,
        stock: 12,
        brand: 'HomeStyle',
        rating: 4.3,
        numReviews: 45,
      },
    ]);

    console.log('Deals created...');

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
