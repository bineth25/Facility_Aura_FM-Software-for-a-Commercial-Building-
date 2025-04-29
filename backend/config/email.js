import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // ✅ Load environment variables
dotenv.config(); // ✅ Initialize dotenv

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // ✅ from .env
    pass: process.env.EMAIL_PASS, // ✅ from .env
  },
});

export const sendLowStockEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};
