const mongoose = require('mongoose');

async function checkDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/agro_ai_system');
        console.log("✅ Successfully connected to MongoDB");
        
        // Check collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("\n📁 Collections in database:");
        collections.forEach(c => console.log(`  - ${c.name}`));

        // Get count of reports and sensors
        if (collections.some(c => c.name === 'diseasereports')) {
            const reportCount = await mongoose.connection.db.collection('diseasereports').countDocuments();
            console.log(`\n🩺 Found ${reportCount} Disease Reports`);
            if (reportCount > 0) {
                const latestReport = await mongoose.connection.db.collection('diseasereports').findOne({}, { sort: { _id: -1 } });
                console.log("Most recent report:", JSON.stringify(latestReport, null, 2));
            }
        }

        if (collections.some(c => c.name === 'sensordatas')) {
            const sensorCount = await mongoose.connection.db.collection('sensordatas').countDocuments();
            console.log(`\n🌡️ Found ${sensorCount} Sensor Data Entries`);
            if (sensorCount > 0) {
                const latestSensor = await mongoose.connection.db.collection('sensordatas').findOne({}, { sort: { _id: -1 } });
                console.log("Most recent sensor reading:", JSON.stringify(latestSensor, null, 2));
            }
        }

    } catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err.message);
        console.error("Make sure your local MongoDB service is running and accessible on port 27017.");
    } finally {
        await mongoose.disconnect();
    }
}

checkDatabase();
