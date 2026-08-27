const mongoose = require('mongoose');

async function updateUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agro_ai_system');
    const res = await mongoose.connection.db.collection('users').updateMany(
      {},
      {
        $set: { verified: true, phoneVerified: true },
        $unset: { verificationToken: '', emailOtpHash: '', phoneOtpHash: '' }
      }
    );
    console.log('Successfully updated users:', res);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

updateUsers();
