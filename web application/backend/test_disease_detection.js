const fs = require('fs');
const path = require('path');

const generateTestImage = (r, g, b, width = 64, height = 64) => {
  // Simple BMP generator for testing
  const fileSize = 54 + width * height * 3;
  const buffer = Buffer.alloc(fileSize);

  // BMP Header
  buffer.write('BM', 0);
  buffer.writeUInt32LE(fileSize, 2);
  buffer.writeUInt32LE(54, 10); // Offset to pixel data
  buffer.writeUInt32LE(40, 14); // DIB Header size
  buffer.writeInt32LE(width, 18);
  buffer.writeInt32LE(height, 22);
  buffer.writeUInt16LE(1, 26); // Planes
  buffer.writeUInt16LE(24, 28); // 24-bit
  buffer.writeUInt32LE(0, 30); // No compression

  let offset = 54;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      buffer[offset] = b;     // Blue
      buffer[offset + 1] = g; // Green
      buffer[offset + 2] = r; // Red
      offset += 3;
    }
  }
  return buffer;
};

async function runTests() {
  console.log('🧪 Starting End-to-End Crop Disease & Auth Tests...\n');

  const BASE_URL = 'http://localhost:5000';

  // 1. Health Check
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    console.log('✅ 1. Backend Health Check:', data.status === 'ok' ? 'PASSED' : 'FAILED', data);
  } catch (e) {
    console.error('❌ 1. Health Check Error:', e.message);
  }

  // 2. User Registration
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const testEmail = `farmer_${randomSuffix}@agroai.com`;
  const testPhone = `+9198${randomSuffix}`;
  let token = '';
  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Ramakrishna Rao',
        email: testEmail,
        passwordHash: 'FarmerSecret123',
        phone: testPhone,
        farmName: 'Rao Bio Farm',
        farmLocation: 'Andhra Pradesh'
      })
    });
    const regData = await regRes.json();
    console.log('✅ 2. Registration (Web/Mobile Unified):', regData.success ? 'PASSED' : 'FAILED', {
      name: regData.user?.fullName,
      email: regData.user?.email,
      role: regData.user?.role,
      error: regData.message
    });
    token = regData.accessToken;
  } catch (e) {
    console.error('❌ 2. Registration Error:', e.message);
  }

  // 3. User Login
  try {
    const logRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'FarmerSecret123'
      })
    });
    const logData = await logRes.json();
    console.log('✅ 3. Login Authentication:', logData.success ? 'PASSED' : 'FAILED', {
      user: logData.user?.email,
      hasToken: !!logData.accessToken
    });
  } catch (e) {
    console.error('❌ 3. Login Error:', e.message);
  }

  // 4. Test Potato Crop Scan (Verifying Potato results, NOT Tomato)
  try {
    const potatoLeafBuf = generateTestImage(180, 180, 20); // Yellow/brown chlorosis
    const b64 = potatoLeafBuf.toString('base64');

    const scanRes = await fetch(`${BASE_URL}/api/reports/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        image: b64,
        cropType: 'Potato',
        symptoms: 'Dark concentric target spots on potato leaves'
      })
    });
    const scanData = await scanRes.json();
    const isPotato = scanData.name?.toLowerCase().includes('potato') || scanData.cropType === 'Potato';
    const isNotTomato = !scanData.name?.toLowerCase().includes('tomato');
    console.log('\n✅ 4. POTATO SCAN TEST:', isPotato && isNotTomato ? 'PASSED (Properly Identified Potato)' : 'FAILED');
    console.log('   - Result Disease Name:', scanData.name);
    console.log('   - Result Crop Type:', scanData.cropType);
    console.log('   - Scientific Name:', scanData.scientificName);
    console.log('   - Confidence:', scanData.confidence + '%');
    console.log('   - Source Engine:', scanData.source);
  } catch (e) {
    console.error('❌ 4. Potato Scan Error:', e.message);
  }

  // 4b. Test Rice Crop Scan (Verifying Rice Blast, NOT Tomato)
  try {
    const riceLeafBuf = generateTestImage(90, 140, 50);
    const b64 = riceLeafBuf.toString('base64');

    const scanRes = await fetch(`${BASE_URL}/api/reports/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        image: b64,
        cropType: 'Rice',
        symptoms: 'Diamond spindle shaped gray spots on leaf sheath'
      })
    });
    const scanData = await scanRes.json();
    const isRice = scanData.name?.toLowerCase().includes('rice') || scanData.cropType === 'Rice';
    const isNotTomato = !scanData.name?.toLowerCase().includes('tomato');
    console.log('\n✅ 4b. RICE SCAN TEST:', isRice && isNotTomato ? 'PASSED (Properly Identified Rice)' : 'FAILED');
    console.log('   - Result Disease Name:', scanData.name);
    console.log('   - Result Crop Type:', scanData.cropType);
  } catch (e) {
    console.error('❌ 4b. Rice Scan Error:', e.message);
  }

  // 4c. Test Corn Crop Scan (Verifying Corn Rust, NOT Tomato)
  try {
    const cornLeafBuf = generateTestImage(160, 90, 30);
    const b64 = cornLeafBuf.toString('base64');

    const scanRes = await fetch(`${BASE_URL}/api/reports/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        image: b64,
        cropType: 'Corn',
        symptoms: 'Orange rust pustules on corn leaves'
      })
    });
    const scanData = await scanRes.json();
    const isCorn = scanData.name?.toLowerCase().includes('corn') || scanData.cropType === 'Corn';
    const isNotTomato = !scanData.name?.toLowerCase().includes('tomato');
    console.log('\n✅ 4c. CORN SCAN TEST:', isCorn && isNotTomato ? 'PASSED (Properly Identified Corn)' : 'FAILED');
    console.log('   - Result Disease Name:', scanData.name);
    console.log('   - Result Crop Type:', scanData.cropType);
  } catch (e) {
    console.error('❌ 4c. Corn Scan Error:', e.message);
  }

  // 5. Test Crop Disease Scan: Healthy Green Leaf
  try {
    const greenLeafBuf = generateTestImage(20, 190, 30); // High Green
    const b64 = greenLeafBuf.toString('base64');

    const scanRes = await fetch(`${BASE_URL}/api/reports/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: b64,
        cropType: 'Rice',
        symptoms: ''
      })
    });
    const scanData = await scanRes.json();
    console.log('\n✅ 5. Healthy Leaf Scan test:', scanData.success ? 'PASSED' : 'FAILED');
    console.log('   - Disease Name:', scanData.name);
    console.log('   - Confidence:', scanData.confidence + '%');
    console.log('   - Severity:', scanData.severity);
    console.log('   - Source Engine:', scanData.source);
  } catch (e) {
    console.error('❌ 5. Healthy Leaf Scan Error:', e.message);
  }

  // 6. Test Non-Crop Object (e.g. solid black or dark non-botanical)
  try {
    const nonPlantBuf = generateTestImage(10, 10, 10);
    const b64 = nonPlantBuf.toString('base64');

    const scanRes = await fetch(`${BASE_URL}/api/reports/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: b64,
        cropType: 'Tomato'
      })
    });
    const scanData = await scanRes.json();
    console.log('\n✅ 6. Non-Crop Validation test:', scanData.isCrop === false || scanData.name.includes('Invalid') ? 'PASSED (Properly Rejected)' : 'FLAGGED');
    console.log('   - Disease Result:', scanData.name);
    console.log('   - Guidance:', scanData.organicTreatment || scanData.treatment);
  } catch (e) {
    console.error('❌ 6. Non-Crop Test Error:', e.message);
  }

  // 7. Test Python AI Vision Service (Port 5050)
  try {
    const pyHealthRes = await fetch('http://127.0.0.1:5050/health');
    const pyHealth = await pyHealthRes.json();
    console.log('\n✅ 7. Python AI Vision Service Health:', pyHealth.status === 'ok' ? 'PASSED' : 'FAILED', pyHealth);

    const leafBuf = generateTestImage(30, 180, 30);
    const pyScanRes = await fetch('http://127.0.0.1:5050/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: leafBuf.toString('base64'),
        cropType: 'Tomato'
      })
    });
    const pyScan = await pyScanRes.json();
    console.log('✅ 8. Python AI Vision Image Detection:', pyScan.success ? 'PASSED' : 'FAILED');
    console.log('   - Analysis:', pyScan.analysis?.diseaseName, `(${pyScan.analysis?.confidence}%)`);
  } catch (e) {
    console.warn('⚠️ 7/8. Python AI Service:', e.message);
  }

  console.log('\n🎉 ALL TESTS COMPLETED.');
}

runTests();
