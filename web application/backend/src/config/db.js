const mongoose = require('mongoose');

const connectDB = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agro_ai_system';
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 50,
        minPoolSize: 10,
      });
      console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
      console.log(`📂 Database Name: ${conn.connection.name}`);
      return;
    } catch (error) {
      console.error(`❌ Database Connection Error: ${error.message}`);
      retries -= 1;
      if (retries === 0) throw error;
      console.log(`Retries left: ${retries}. Waiting 5 seconds...`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;