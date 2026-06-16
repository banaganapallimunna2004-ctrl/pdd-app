const sendSms = async ({ to, message }) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, NODE_ENV } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.log(`[DEV SMS] ${to}: ${message}`);
    return { delivered: false, provider: 'development' };
  }

  const body = new URLSearchParams({
    To: to,
    From: TWILIO_PHONE_NUMBER,
    Body: message,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    }
  );

  if (!response.ok) {
    const details = await response.text();
    console.error('SMS provider failed', details);
    if (NODE_ENV === 'production') {
      throw new Error('Unable to send OTP right now.');
    }
    return { delivered: false, provider: 'twilio', details };
  }

  return { delivered: true, provider: 'twilio' };
};

module.exports = { sendSms };
