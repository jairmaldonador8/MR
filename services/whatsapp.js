const axios = require('axios');
const config = require('../config');
const { run, get } = require('../database');

class WhatsAppService {
  constructor() {
    this.phoneNumberId = config.whatsapp.phoneNumberId;
    this.businessAccountId = config.whatsapp.businessAccountId;
    this.accessToken = config.whatsapp.accessToken;
    this.apiVersion = config.whatsapp.apiVersion;
    this.baseUrl = `https://graph.instagram.com/${this.apiVersion}`;
  }

  /**
   * Send a text message via WhatsApp Business API
   * @param {string} recipientPhone - Recipient phone number (with country code, e.g., +1234567890)
   * @param {string} messageText - Message text to send
   * @returns {Promise<Object>} API response
   */
  async sendMessage(recipientPhone, messageText) {
    try {
      if (!this.phoneNumberId || !this.accessToken) {
        throw new Error('WhatsApp credentials not configured');
      }

      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      const data = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone.replace(/\D/g, ''),
        type: 'text',
        text: {
          body: messageText,
        },
      };

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`✅ WhatsApp message sent to ${recipientPhone}`);
      return response.data;
    } catch (err) {
      console.error(`❌ Failed to send WhatsApp message to ${recipientPhone}:`, err.message);
      throw err;
    }
  }

  /**
   * Send a pre-approved template message via WhatsApp Business API
   * @param {string} recipientPhone - Recipient phone number
   * @param {string} templateName - Name of the pre-approved template
   * @param {Array<string>} parameters - Template parameters
   * @returns {Promise<Object>} API response
   */
  async sendTemplateMessage(recipientPhone, templateName, parameters = []) {
    try {
      if (!this.phoneNumberId || !this.accessToken) {
        throw new Error('WhatsApp credentials not configured');
      }

      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      const data = {
        messaging_product: 'whatsapp',
        to: recipientPhone.replace(/\D/g, ''),
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en_US',
          },
          components: parameters.length > 0 ? [
            {
              type: 'body',
              parameters: parameters.map(param => ({ type: 'text', text: param })),
            },
          ] : [],
        },
      };

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`✅ WhatsApp template message sent to ${recipientPhone}`);
      return response.data;
    } catch (err) {
      console.error(`❌ Failed to send WhatsApp template to ${recipientPhone}:`, err.message);
      throw err;
    }
  }

  /**
   * Handle incoming WhatsApp webhook
   * @param {Object} body - Webhook body from WhatsApp
   * @returns {Promise<void>}
   */
  async handleWebhook(body) {
    try {
      if (!body.entry || !body.entry[0]) {
        return;
      }

      const entry = body.entry[0];
      const changes = entry.changes || [];

      for (const change of changes) {
        if (change.field === 'messages') {
          const value = change.value;
          const messages = value.messages || [];

          for (const message of messages) {
            const senderPhone = value.contacts[0]?.wa_id;
            const messageText = message.text?.body || '';
            const messageType = message.type;

            // Log message to conversations table
            await this.logConversation(senderPhone, messageText, 'lead');
          }
        }
      }
    } catch (err) {
      console.error('❌ Error handling WhatsApp webhook:', err.message);
    }
  }

  /**
   * Log conversation message to database
   * @param {string} leadPhone - Lead phone number
   * @param {string} message - Message content
   * @param {string} sender - 'lead' or 'agent' or 'system'
   * @returns {Promise<void>}
   */
  async logConversation(leadPhone, message, sender) {
    try {
      // Find lead by phone number
      const lead = await get('SELECT id FROM leads WHERE phone = ?', [leadPhone]);

      if (!lead) {
        console.warn(`⚠️ Lead not found for phone: ${leadPhone}`);
        return;
      }

      await run(
        `INSERT INTO conversations (lead_id, channel, message, sender)
         VALUES (?, ?, ?, ?)`,
        [lead.id, 'whatsapp', message, sender]
      );
    } catch (err) {
      console.error('❌ Failed to log conversation:', err.message);
    }
  }
}

module.exports = new WhatsAppService();
