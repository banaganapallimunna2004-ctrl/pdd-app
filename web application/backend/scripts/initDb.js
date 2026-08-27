/**
 * Agro AI — Database Initialisation Script
 * Run: node scripts/initDb.js
 *
 * What it does:
 *   1. Connects to MongoDB
 *   2. Creates all required indexes on the users collection
 *   3. Seeds a default Admin account (if none exists)
 *   4. Prints collection stats
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agro_ai_system';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

/* ── Inline schema (mirrors src/models/User.js) ── */
const userSchema = new mongoose.Schema(
  {
    name:                 { type: String, required: true, trim: true },
    email:                { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:                { type: String, required: true, unique: true, trim: true },
    password:             { type: String, required: true, select: false },
    role:                 { type: String, enum: ['Farmer', 'Agronomist', 'Admin'], default: 'Farmer' },
    verified:             { type: Boolean, default: false },
    verificationToken:    { type: String, select: false },
    emailOtpHash:         { type: String, select: false },
    emailOtpExpires:      { type: Date, select: false },
    emailOtpAttempts:     { type: Number, default: 0, select: false },
    phoneVerified:        { type: Boolean, default: false },
    phoneOtpHash:         { type: String, select: false },
    phoneOtpExpires:      { type: Date, select: false },
    phoneOtpAttempts:     { type: Number, default: 0, select: false },
    resetPasswordToken:   { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const ADMIN_SEED = {
  name:     'Agro AI Admin',
  email:    'admin@agroai.com',
  phone:    '+910000000000',
  password: 'Admin@123456',
  role:     'Admin',
  verified: true,
};

async function main() {
  console.log('\n🌾  Agro AI — Database Initialisation\n' + '─'.repeat(50));

  /* 1. Connect */
  console.log(`📡 Connecting to: ${MONGO_URI}`);
  await mongoose.connect(MONGO_URI);
  console.log(`✅ Connected to MongoDB`);
  console.log(`📂 Database: ${mongoose.connection.name}\n`);

  const db = mongoose.connection.db;

  /* 2. Create indexes */
  console.log('📑 Setting up indexes...');
  const col = db.collection('users');

  // Drop ALL non-_id indexes using direct command
  try {
    await db.command({ dropIndexes: 'users', index: '*' });
    console.log('   ♻  Dropped all existing indexes');
  } catch (e) {
    console.log(`   ℹ  Drop notice: ${e.message}`);
  }

  // Recreate with our named indexes
  const indexDefs = [
    { key: { email: 1 },             options: { unique: true,  name: 'email_unique' } },
    { key: { phone: 1 },             options: { sparse: true,  name: 'phone_idx' } },
    { key: { verificationToken: 1 }, options: { sparse: true,  name: 'verification_token_sparse' } },
    { key: { resetPasswordToken: 1 },options: { sparse: true,  name: 'reset_token_sparse' } },
    { key: { emailOtpExpires: 1 },   options: { expireAfterSeconds: 0, sparse: true, name: 'email_otp_ttl' } },
    { key: { phoneOtpExpires: 1 },   options: { expireAfterSeconds: 0, sparse: true, name: 'phone_otp_ttl' } },
    { key: { role: 1 },              options: { name: 'role_idx' } },
    { key: { createdAt: -1 },        options: { name: 'created_desc' } },
  ];

  for (const { key, options } of indexDefs) {
    try {
      await col.createIndex(key, options);
      console.log(`   ✓ ${options.name}`);
    } catch (e) {
      console.log(`   ⚠  ${options.name}: ${e.message}`);
    }
  }

  /* 3. Seed admin user */
  console.log('\n👤 Seeding default Admin account...');
  const existing = await User.findOne({ email: ADMIN_SEED.email }).select('+password');

  if (existing) {
    console.log(`   ℹ  Admin already exists: ${ADMIN_SEED.email}`);
    console.log(`   Role: ${existing.role} | Verified: ${existing.verified}`);
  } else {
    const hashed = await bcrypt.hash(ADMIN_SEED.password, SALT_ROUNDS);
    await User.create({ ...ADMIN_SEED, password: hashed });
    console.log(`   ✅ Admin created: ${ADMIN_SEED.email}`);
    console.log(`   🔑 Default password: ${ADMIN_SEED.password}`);
    console.log(`   ⚠  Change this password immediately after first login!`);
  }

  /* 4. Also create a test Farmer account */
  const FARMER_SEED = {
    name:     'Test Farmer',
    email:    'farmer@agroai.com',
    phone:    '+911234567890',
    password: 'Farmer@123456',
    role:     'Farmer',
    verified: true,
  };

  let farmerUser = await User.findOne({ email: FARMER_SEED.email });
  if (!farmerUser) {
    const hashed = await bcrypt.hash(FARMER_SEED.password, SALT_ROUNDS);
    farmerUser = await User.create({ ...FARMER_SEED, password: hashed });
    console.log(`\n🌱 Test Farmer created: ${FARMER_SEED.email}`);
    console.log(`   🔑 Password: ${FARMER_SEED.password}`);
  } else {
    console.log(`\n   ℹ  Test Farmer already exists: ${FARMER_SEED.email}`);
  }

  // Seed default farm for the Test Farmer
  const FarmLocation = require('../src/models/FarmLocation');
  const existingFarm = await FarmLocation.findOne({ owner: farmerUser._id });
  if (!existingFarm) {
    await FarmLocation.create({
      name: 'Green Valley Farm',
      owner: farmerUser._id,
      description: 'Default organic tomato and wheat fields',
      zoneType: 'Crop Zone',
      coordinates: {
        type: 'Point',
        coordinates: [78.4867, 17.3850],
      },
      sensorCount: 5,
      satelliteViewUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      cropType: 'Tomato',
    });
    console.log(`   ✅ Default farm created for Test Farmer: Green Valley Farm`);
  } else {
    console.log(`   ℹ  Default farm already exists for Test Farmer`);
  }

  /* 5. Stats */
  console.log('\n📊 Collection Stats:');
  const stats = await db.command({ dbStats: 1 });
  console.log(`   Collections : ${stats.collections}`);
  console.log(`   Documents   : ${stats.objects}`);
  console.log(`   Storage     : ${(stats.storageSize / 1024).toFixed(2)} KB`);

  const userCount = await User.countDocuments();
  console.log(`   Users       : ${userCount}`);

  console.log('\n' + '─'.repeat(50));
  console.log('✅  Database initialised successfully!\n');
  console.log('🚀 You can now log in with:');
  console.log(`   Admin  → admin@agroai.com   / Admin@123456`);
  console.log(`   Farmer → farmer@agroai.com  / Farmer@123456`);
  console.log('─'.repeat(50) + '\n');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('\n❌ Init failed:', err.message);
  process.exit(1);
});
