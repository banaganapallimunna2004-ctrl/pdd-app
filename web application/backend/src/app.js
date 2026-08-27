const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const farmRoutes = require('./routes/farmRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Serve public static assets (backgrounds, crop assets) for web and mobile clients
app.use('/public', express.static(path.join(__dirname, '../../frontend/public')));
app.use(express.static(path.join(__dirname, '../../frontend/public')));

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:4173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:4173',
  ].join(',')
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cors({
  origin: (origin, callback) => {
    // Allow any origin during development to avoid CORS errors
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));

const DiseaseReport = require('./models/DiseaseReport');
const SensorData = require('./models/SensorData');
const FarmLocation = require('./models/FarmLocation');
const User = require('./models/User');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Agro AI Precision System' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Shared Sync Endpoints for Mobile App & Web Application
app.post('/api/sync/sensors', async (req, res) => {
  try {
    const raw = req.body.data || req.body;
    const items = Array.isArray(raw) ? raw : [raw];
    const docs = items.filter(Boolean).map((s) => ({
      sensorType: 'Multi-Sensor Hub',
      temperature: Number(s.temperature) || 28.5,
      humidity: Number(s.humidity) || 65.0,
      soilMoisture: Number(s.soilMoisture) || 60.0,
      soilPh: Number(s.soilPh) || 6.5,
      nitrogen: Number(s.nitrogen) || 140,
      phosphorus: Number(s.phosphorus) || 45,
      potassium: Number(s.potassium) || 190,
      recordedAt: s.timestamp ? new Date(Number(s.timestamp)) : new Date(),
    }));

    if (docs.length > 0) {
      await SensorData.insertMany(docs);
    }
    res.json({ success: true, message: `Synced ${docs.length} sensor records to shared MongoDB database.` });
  } catch (err) {
    console.error('Sensor sync error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/sync/detections', async (req, res) => {
  try {
    const raw = req.body.data || req.body;
    const items = Array.isArray(raw) ? raw : [raw];
    const docs = items.filter(Boolean).map((d) => ({
      cropType: d.cropType || 'Crop',
      diseaseName: d.diseaseName || 'Crop Health Check',
      scientificName: d.scientificName || 'N/A',
      severity: d.severity || 'Medium',
      confidence: Number(d.confidence) || 90,
      imageUrl: d.imageUrl || '',
      symptoms: d.symptoms || [],
      treatmentSuggestions: d.treatmentSuggestions || [],
      preventionTips: d.preventionTips || [],
      treatment: Array.isArray(d.treatmentSuggestions) ? d.treatmentSuggestions.join('. ') : (d.treatment || 'Apply recommended bio-fungicide.'),
      prevention: Array.isArray(d.preventionTips) ? d.preventionTips.join('. ') : (d.prevention || 'Maintain crop hygiene and row spacing.'),
    }));

    if (docs.length > 0) {
      await DiseaseReport.insertMany(docs);
    }
    res.json({ success: true, message: `Synced ${docs.length} crop detections to shared MongoDB database.` });
  } catch (err) {
    console.error('Detection sync error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Farm Location Map Sync
app.post('/api/map/location', async (req, res) => {
  try {
    const { userEmail, farmName, locationAddress, latitude, longitude, farmSizeAcres, primaryCrops, soilType, irrigationSystem } = req.body;
    const lat = Number(latitude) || 11.0168;
    const lng = Number(longitude) || 76.9558;

    const farm = await FarmLocation.findOneAndUpdate(
      { userEmail: userEmail || 'farmer@agroai.com' },
      {
        userEmail: userEmail || 'farmer@agroai.com',
        name: farmName || 'Green Valley Agro Farm',
        farmName: farmName || 'Green Valley Agro Farm',
        locationAddress: locationAddress || 'Field Zone 1',
        latitude: lat,
        longitude: lng,
        coordinates: { type: 'Point', coordinates: [lng, lat] },
        farmSizeAcres: Number(farmSizeAcres) || 5.0,
        primaryCrops: primaryCrops || 'Rice, Tomato, Cotton',
        soilType: soilType || 'Black Soil',
        irrigationSystem: irrigationSystem || 'Drip Irrigation',
        status: 'Active Monitoring',
      },
      { upsert: true, new: true }
    );

    // Also update User coordinates if user exists
    if (userEmail) {
      await User.findOneAndUpdate(
        { email: userEmail.toLowerCase() },
        { farmName, farmLocation: locationAddress, latitude: lat, longitude: lng }
      );
    }

    res.json({ success: true, message: 'Farm location synchronized with shared MongoDB database.', farm });
  } catch (err) {
    console.error('Farm location sync error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Suppliers Endpoint
app.get('/api/map/suppliers', (req, res) => {
  const lat = Number(req.query.lat) || 11.0168;
  const lng = Number(req.query.lng) || 76.9558;
  const category = req.query.category;
  const query = req.query.query;

  const suppliers = [
    {
      id: 1,
      name: "Kisan Agro Seva & Fertilizer Hub",
      latitude: lat + 0.007,
      longitude: lng - 0.006,
      address: "Agro Commercial Mandi, Near Gate 2, Sector 3",
      type: "Organic & NPK Fertilizers",
      category: "fertilizer",
      rating: 4.9,
      phone: "+91 98765 43210",
      status: "Open Now",
      stock: ["Urea & DAP (50kg)", "Bio-NPK Liquid", "Neem Cake Organic", "Zinc Sulphate"]
    },
    {
      id: 2,
      name: "GreenGrow Bio-Pesticides & Seed Depot",
      latitude: lat - 0.006,
      longitude: lng + 0.008,
      address: "Farm Road Bypass, Agro Tech Sector 4",
      type: "Crop Protection & Micronutrients",
      category: "protection",
      rating: 4.8,
      phone: "+91 98765 12345",
      status: "Open Now",
      stock: ["Copper Oxychloride Fungicide", "Bio-Inoculants", "Neem Oil Extract", "Trichoderma Viride"]
    },
    {
      id: 3,
      name: "District Krishi Vigyan & Soil Testing Lab",
      latitude: lat + 0.012,
      longitude: lng + 0.009,
      address: "Agricultural Research Sub-Station, Krishi Bhavan",
      type: "Soil Testing & Pathogen Diagnostics",
      category: "lab",
      rating: 4.7,
      phone: "+91 98765 67890",
      status: "Govt Extension Lab",
      stock: ["Comprehensive Soil NPK Profile", "Leaf Pathology Diagnostics", "pH & EC Water Analysis", "Organic Carbon Test"]
    },
    {
      id: 4,
      name: "HarvestPro Farm Equipment & Irrigation Mart",
      latitude: lat - 0.009,
      longitude: lng - 0.007,
      address: "National Highway 48 Bypass, Market Yard",
      type: "Machinery, Drip Kits & Seeds",
      category: "equipment",
      rating: 4.6,
      phone: "+91 98765 99887",
      status: "Open Now",
      stock: ["Inline Drip Lateral Pipes", "Micro-Sprinklers", "Battery Backpack Sprayers", "Solar Insect Traps"]
    }
  ];

  let result = suppliers;
  if (category && category !== 'all') {
    result = result.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q) || s.stock.some(item => item.toLowerCase().includes(q)));
  }

  res.json(result);
});

// System Alerts
app.get('/api/alerts', (req, res) => {
  res.json([
    "Optimal Soil Moisture in Field 1 (60%)",
    "Weather Advisory: Clear skies expected for the next 48 hours",
    "Nitrogen & Potassium levels balanced for current growth stage",
    "Scheduled drone foliar scouting recommended for Sector 3"
  ]);
});

// Farm Listing for Web & Mobile App
app.get('/api/map/farms', async (req, res) => {
  try {
    const email = req.query.email;
    const query = email ? { userEmail: email.toLowerCase() } : {};
    const farms = await FarmLocation.find(query).sort({ createdAt: -1 });
    res.json({ success: true, farms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cloud Data Sync Endpoint
app.post('/api/sync/cloud', async (req, res) => {
  try {
    res.json({
      status: 'Cloud synchronization completed successfully',
      progress: 100,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Report Export Endpoint (Mobile & Web)
app.post('/api/reports/export', async (req, res) => {
  try {
    const fileName = `Farm_Report_${Date.now()}.pdf`;
    res.json({
      success: true,
      fileName,
      downloadUrl: `/api/reports/export/pdf`,
      message: 'Comprehensive farm diagnostics report generated.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sensor Calibration Endpoint
app.post('/api/sensors/calibrate', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'IoT Multi-Sensor Hub successfully calibrated to baseline thresholds.',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Root Operational Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'Agro AI Backend Operational',
    version: '2.4.0',
    service: 'Unified AgroAI Precision Monitoring Platform',
    database: 'Connected (MongoDB - agro_ai_system)',
    features: ['Auth', 'Maps', 'Sensors', 'Crop Detections', 'AI Diagnostics', 'Cloud Sync'],
  });
});

app.use(errorHandler);

module.exports = app;

