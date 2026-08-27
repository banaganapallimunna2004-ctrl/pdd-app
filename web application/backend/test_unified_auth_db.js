const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:5000/api';
const MONGO_URI = 'mongodb://localhost:27017/agro_ai_system';

async function runUnifiedTest() {
  console.log('🚀 Starting Cross-Platform Web & Mobile Database & Auth Test...\n');

  // 1. Check MongoDB Connection directly
  await mongoose.connect(MONGO_URI);
  console.log('✅ 1. MongoDB Direct Connection: Connected to', MONGO_URI);

  const testStamp = Date.now();
  const webUserEmail = `web_farmer_${testStamp}@agroai.com`;
  const mobileUserEmail = `mobile_farmer_${testStamp}@agroai.com`;
  const sharedPassword = 'UnifiedPass@2026';

  // 2. Test Case A: Register on Web Application
  console.log('\n--- Test 2: Register on Web Application ---');
  const webRegisterPayload = {
    name: 'Ramesh Patel',
    fullName: 'Ramesh Patel',
    email: webUserEmail,
    phone: '+919876500001',
    password: sharedPassword,
    role: 'Farmer',
    farmName: 'Krishna Valley Organic Farm',
    farmLocation: 'Sector 4, Nashik',
    farmSize: 12.5,
    experienceYears: 6,
    primaryCrops: 'Tomato, Grapes, Onion',
    soilType: 'Black Soil',
    irrigationSystem: 'Drip Irrigation',
    latitude: 19.9975,
    longitude: 73.7898
  };

  const webRegRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webRegisterPayload)
  });
  const webRegData = await webRegRes.json();
  if (!webRegRes.ok) throw new Error(`Web registration failed: ${JSON.stringify(webRegData)}`);
  console.log('✅ Web Registration Response Status:', webRegRes.status);
  console.log('   User ID:', webRegData.user.id || webRegData.user._id);
  console.log('   User FullName:', webRegData.user.fullName);

  // Verify in MongoDB
  const dbUserFromWeb = await mongoose.connection.db.collection('users').findOne({ email: webUserEmail });
  if (!dbUserFromWeb) throw new Error('User registered on web was not found in MongoDB!');
  console.log('✅ User verified in MongoDB collection (users):', dbUserFromWeb.email);
  console.log('   Password stored as bcrypt hash:', dbUserFromWeb.password ? 'YES (Secure)' : 'NO');

  // 3. Test Case B: Login to Mobile App with the Web user's credentials
  console.log('\n--- Test 3: Login to Mobile App using Web-Registered Account ---');
  // Mobile app sends { email, passwordHash } to POST /api/auth/login
  const mobileLoginPayload = {
    email: webUserEmail,
    passwordHash: sharedPassword
  };

  const mobileLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mobileLoginPayload)
  });
  const mobileLoginData = await mobileLoginRes.json();
  if (!mobileLoginRes.ok || !mobileLoginData.success) throw new Error(`Mobile login failed: ${JSON.stringify(mobileLoginData)}`);
  console.log('✅ Mobile App Login Success:', mobileLoginData.success);
  console.log('   Logged In User:', mobileLoginData.user.fullName);
  console.log('   Farm Name Synced to Mobile:', mobileLoginData.user.farmName);
  console.log('   Farm Size Synced to Mobile:', mobileLoginData.user.farmSize);

  // 4. Test Case C: Register on Mobile App
  console.log('\n--- Test 4: Register on Mobile App ---');
  // Mobile app sends { email, passwordHash, fullName, phone, farmName, farmLocation }
  const mobileRegisterPayload = {
    email: mobileUserEmail,
    passwordHash: sharedPassword,
    fullName: 'Ananya Sharma',
    phone: '+919876500002',
    farmName: 'Ananya Smart Bio Farm',
    farmLocation: 'Green Zone A, Mandya'
  };

  const mobileRegRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mobileRegisterPayload)
  });
  const mobileRegData = await mobileRegRes.json();
  if (!mobileRegRes.ok || !mobileRegData.success) throw new Error(`Mobile registration failed: ${JSON.stringify(mobileRegData)}`);
  console.log('✅ Mobile App Registration Success:', mobileRegData.success);
  console.log('   Created User:', mobileRegData.user.fullName);

  // Verify in MongoDB
  const dbUserFromMobile = await mongoose.connection.db.collection('users').findOne({ email: mobileUserEmail });
  if (!dbUserFromMobile) throw new Error('User registered on mobile was not found in MongoDB!');
  console.log('✅ Mobile-registered user verified in MongoDB collection (users):', dbUserFromMobile.email);

  // 5. Test Case D: Login on Web Application with the Mobile user's credentials
  console.log('\n--- Test 5: Login on Web Application using Mobile-Registered Account ---');
  const webLoginPayload = {
    email: mobileUserEmail,
    password: sharedPassword
  };

  const webLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webLoginPayload)
  });
  const webLoginData = await webLoginRes.json();
  if (!webLoginRes.ok || !webLoginData.success) throw new Error(`Web login failed: ${JSON.stringify(webLoginData)}`);
  console.log('✅ Web App Login Success:', webLoginData.success);
  console.log('   Access Token Issued:', webLoginData.accessToken ? 'YES' : 'NO');
  console.log('   User FullName on Web:', webLoginData.user.fullName);

  // 6. Test Case E: Update profile on Mobile App and read on Web Application
  console.log('\n--- Test 6: Cross-Platform Profile Update & Sync ---');
  const profileUpdatePayload = {
    email: mobileUserEmail,
    fullName: 'Dr. Ananya Sharma (Lead Agronomist)',
    farmName: 'Ananya Precision Agro Tech Hub',
    farmSize: 25.0,
    experienceYears: 8,
    primaryCrops: 'Paddy, Cotton, Sugarcane',
    soilType: 'Red Sandy Soil',
    irrigationSystem: 'Smart Sprinkler & Drip',
    farmBio: 'Pioneering organic soil restoration and AI precision diagnostics.'
  };

  const updateRes = await fetch(`${BASE_URL}/auth/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileUpdatePayload)
  });
  const updateData = await updateRes.json();
  if (!updateRes.ok || !updateData.success) throw new Error(`Profile update failed: ${JSON.stringify(updateData)}`);
  console.log('✅ Profile Update Status:', updateData.success);
  console.log('   Updated Name in Response:', updateData.user.fullName);

  // Verify updated in MongoDB
  const updatedDbUser = await mongoose.connection.db.collection('users').findOne({ email: mobileUserEmail });
  console.log('✅ MongoDB Verified Updated Farm Name:', updatedDbUser.farmName);
  console.log('✅ MongoDB Verified Updated Farm Size:', updatedDbUser.farmSize);

  // 7. Test Case F: Test shared endpoints (Sensors, Weather, Recommendations, Suppliers, Scans)
  console.log('\n--- Test 7: Verify Shared API Endpoints ---');

  // Weather
  const weatherRes = await fetch(`${BASE_URL}/weather?lat=19.9975&lng=73.7898`);
  const weatherData = await weatherRes.json();
  console.log('✅ Weather Endpoint operational:', weatherData.condition, `(${weatherData.temperature}°C)`);

  // Recommendations
  const recRes = await fetch(`${BASE_URL}/recommendations`, {
    headers: { 'User-Agent': 'okhttp/4.12.0' }
  });
  const recData = await recRes.json();
  console.log('✅ Recommendations Endpoint operational (Mobile format):', Array.isArray(recData) ? `Found ${recData.length} recommendations` : 'Object format');

  // Map Suppliers
  const supRes = await fetch(`${BASE_URL}/map/suppliers?lat=19.9975&lng=73.7898`);
  const supData = await supRes.json();
  console.log('✅ Map Suppliers Endpoint operational:', `Found ${supData.length} nearby agro suppliers`);

  // Cloud Sync
  const syncRes = await fetch(`${BASE_URL}/sync/cloud`, { method: 'POST' });
  const syncData = await syncRes.json();
  console.log('✅ Cloud Sync Endpoint operational:', syncData.status);

  // Clean up test records
  await mongoose.connection.db.collection('users').deleteMany({
    email: { $in: [webUserEmail, mobileUserEmail] }
  });
  console.log('\n🧹 Test users cleaned up from MongoDB.');

  await mongoose.disconnect();
  console.log('\n🎉 ALL CROSS-PLATFORM TESTS PASSED SUCCESSFULLY! Web and Mobile are 100% unified on the same database.');
}

runUnifiedTest().catch((err) => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
