
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const sendSlackWebhook = async (message) => {
  const webhookUrl = process.env.ERP_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('❗ ERP_WEBHOOK_URL is missing in .env');
    return;
  }

  try {
    await axios.post(webhookUrl, { text: message });
    console.log('✅ Slack/Webhook alert sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send Slack/Webhook alert:', error.message);
    throw new Error('Slack delivery failed');
  }
};
