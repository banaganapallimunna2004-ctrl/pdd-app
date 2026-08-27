const nodemailer = require('nodemailer');

let transport = null;

const getTransport = () => {
  if (transport) return transport;

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log(`📧 Email transport: SMTP (${process.env.EMAIL_HOST})`);
  } else if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
    // Gmail App Password shortcut
    transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
    console.log('📧 Email transport: Gmail');
  } else {
    // Development: log emails to console
    transport = {
      sendMail: async (options) => {
        console.log('\n📧 ═══════════════════════════════════════');
        console.log(`   TO:      ${options.to}`);
        console.log(`   SUBJECT: ${options.subject}`);
        // Extract OTP from subject if present
        const otpMatch = options.subject && options.subject.match(/\d{6}/);
        if (otpMatch) {
          console.log(`   OTP:     ${otpMatch[0]}`);
        }
        console.log('   (Email service not configured — see .env EMAIL_ vars)');
        console.log('═══════════════════════════════════════\n');
        return { messageId: 'dev-mode' };
      },
    };
    console.log('📧 Email transport: Development console (configure EMAIL_ vars for real sending)');
  }
  return transport;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const mailer = getTransport();
  const from = process.env.EMAIL_FROM ||
    process.env.GMAIL_USER ||
    process.env.EMAIL_USER ||
    'Agro AI <noreply@agroai.local>';

  return mailer.sendMail({
    from: `Agro AI <${from}>`,
    to,
    subject,
    html,
    text,
  });
};

module.exports = { sendEmail };
