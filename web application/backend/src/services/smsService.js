/**
 * SMS Service — Real-time OTP delivery via Twilio
 * Supports Indian phone numbers (+91 format)
 * Falls back to console logging in development mode
 */

const normalizeToE164 = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (String(phone).startsWith('+')) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`; // Indian mobile
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return phone;
};

const sendSms = async ({ to, message }) => {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    NODE_ENV,
  } = process.env;

  const formattedTo = normalizeToE164(to);

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER ||
      TWILIO_ACCOUNT_SID.startsWith('ACxxxxxxxxx')) {
    // Development mode: print to console
    console.log('\n📱 ═══════════════════════════════════════');
    console.log(`   SMS TO:     ${formattedTo}`);
    console.log(`   MESSAGE:    ${message}`);
    const otpMatch = message && message.match(/\d{6}/);
    if (otpMatch) {
      console.log(`   ✅ OTP CODE: ${otpMatch[0]}`);
    }
    console.log('   (Configure Twilio in backend/.env for real SMS delivery)');
    console.log('═══════════════════════════════════════\n');
    return { delivered: false, provider: 'development',  };
  }

  // Real Twilio delivery
  const body = new URLSearchParams({
    To: formattedTo,
    From: TWILIO_PHONE_NUMBER,
    Body: message,
  });

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      const errMsg = result?.message || result?.error_message || 'Twilio API error';
      console.error(`❌ Twilio SMS Error [${result?.code}]: ${errMsg}`);
      if (NODE_ENV !== 'production') {
        console.log(`📱 Dev fallback OTP: ${message.match(/\d{6}/)?.[0]}`);
        return { delivered: false, provider: 'twilio', error: errMsg };
      }
      throw new Error('SMS delivery failed. Please try again shortly.');
    }

    console.log(`✅ SMS sent via Twilio: SID ${result.sid} → ${formattedTo}`);
    return { delivered: true, provider: 'twilio', sid: result.sid };
  } catch (err) {
    console.error('❌ SMS service exception:', err.message);
    if (NODE_ENV !== 'production') {
      return { delivered: false, provider: 'twilio', error: err.message };
    }
    throw err;
  }
};

module.exports = { sendSms };
