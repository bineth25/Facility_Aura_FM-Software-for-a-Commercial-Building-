import nodemailer from 'nodemailer';

// Email service state tracking
let emailServiceAvailable = false;
let transporter = null;
let emailInitialized = false;

// Initialize email service
export const initializeEmailService = () => {
  // Skip if already initialized
  if (emailInitialized) return;

  try {
    // Check required email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('\x1b[33m%s\x1b[0m', '⚠️ Email credentials missing - email functionality disabled');
      emailServiceAvailable = false;
      return;
    }

    // Create transporter
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Test connection
    transporter.verify((error) => {
      if (error) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Email service verification failed:', error);
        emailServiceAvailable = false;
      } else {
        console.log('✅ Email service initialized successfully');
        emailServiceAvailable = true;
      }
    });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Failed to initialize email service:', error);
    emailServiceAvailable = false;
  } finally {
    emailInitialized = true;
  }
};

export const sendLeaseExpiryEmail = async (toEmail, tenantName, leaseEndDate) => {
  // If service is not available, throw appropriate error
  if (!emailServiceAvailable) {
    throw new Error('Email service not available. Please check server configuration.');
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Lease Expiry Reminder - ${tenantName}`,
      html: `
        <p>Dear ${tenantName},</p>
        <p>We would like to remind you that your current lease agreement is scheduled to expire on <b>${new Date(leaseEndDate).toLocaleDateString()}</b>.</p>
        <p>To ensure a smooth continuation of your tenancy, we kindly request you to contact us at your earliest convenience regarding lease renewal options or any questions you may have.</p>
        <p>If you intend to renew, discuss changes, or require assistance with the next steps, our team is ready to assist you.</p>
        <p>We truly value your tenancy and look forward to continuing our relationship.</p>
        <p>Thank you for choosing our facility!</p>
        <p>Best regards,<br/>
        <i>Facility Management Team</i></p>

      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};