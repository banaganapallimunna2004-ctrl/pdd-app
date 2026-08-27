require('dotenv').config();
const express = require('express');
const cors = require('cors');
perlconst connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Health Check for frontend reachability probe
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 AgroVision Backend running on port ${PORT}`);
});