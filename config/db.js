const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    throw error;
  }
};

module.exports = connectDB;
