const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure your email service here
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendLowStockAlert = async (itemDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ERP_EMAIL, // Configure ERP system email
      subject: `Low Stock Alert - Item ${itemDetails.itemId}`,
      html: `
        <h2>Low Stock Alert</h2>
        <p>The following item needs to be reordered:</p>
        <ul>
          <li>Item ID: ${itemDetails.itemId}</li>
          <li>Current Quantity: ${itemDetails.currentQuantity}</li>
          <li>Threshold: ${itemDetails.threshold}</li>
        </ul>
        <p>Please process this reorder request as soon as possible.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendLowStockAlert
}; 