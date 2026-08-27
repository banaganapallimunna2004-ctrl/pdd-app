const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
require('express-async-errors');

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Agro AI Precision System Backend running on port ${PORT}`);
});

connectDB()
  .then(() => {
    console.log('✅ Database connected and ready for requests.');
  })
  .catch((error) => {
    console.warn('⚠️ Database connection warning (retrying in background):', error.message);
  });

