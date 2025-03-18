import LowStockAlert from '../models/lowStockAlerts.js';
import nodemailer from 'nodemailer';

// Send Email Function
const sendEmail = async (itemDetails) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Example: Gmail SMTP
    auth: {
      user: 'your_email@example.com',
      pass: 'your_email_password',
    },
  });

  const mailOptions = {
    from: 'your_email@example.com',
    to: 'erp_system@example.com', // Your ERP system email
    subject: `Low Stock Alert for ${itemDetails.itemName}`,
    text: `Item: ${itemDetails.itemName}\nCurrent Quantity: ${itemDetails.quantity}\nReorder Level: ${itemDetails.reorderLevel}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// CREATE: Create low stock alert
export const createLowStockAlert = async (req, res) => {
  const { item_ID, itemName, quantity, reorderLevel } = req.body;

  try {
    const newAlert = new LowStockAlert({ item_ID, itemName, quantity, reorderLevel });

    // Check if quantity is below reorder level
    if (quantity <= reorderLevel) {
      await sendEmail({ itemName, quantity, reorderLevel });
    }

    await newAlert.save();
    res.status(201).json({ message: 'Low Stock Alert Created', newAlert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get all low stock alerts
export const getAllLowStockAlerts = async (req, res) => {
  try {
    const alerts = await LowStockAlert.find();
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Update a low stock alert
export const updateLowStockAlert = async (req, res) => {
  try {
    const updatedAlert = await LowStockAlert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedAlert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Delete a low stock alert
export const deleteLowStockAlert = async (req, res) => {
  try {
    const deletedAlert = await LowStockAlert.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Low Stock Alert Deleted', deletedAlert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
