require('dotenv').config();

module.exports = {
  database: {
    path: process.env.DB_PATH || './data/montana.db',
  },
  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
  },
  crm: {
    apiUrl: process.env.CRM_API_URL,
    apiKey: process.env.CRM_API_KEY,
    leadSource: process.env.CRM_LEAD_SOURCE || 'Montana Realty Website',
  },
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  webhook: {
    verifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
  },
};
