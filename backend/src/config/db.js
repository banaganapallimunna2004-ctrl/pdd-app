const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not set. Backend will start without a database connection.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'agro_ai_system',
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      ssl: process.env.MONGODB_SSL === 'true',
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    console.log('✅ Connected to MongoDB securely');
  } catch (error) {
    console.warn('MongoDB connection unavailable. Backend will continue in startup mode.', error.message);
  }
};

module.exports = connectDB;
