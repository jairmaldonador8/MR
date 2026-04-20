const schedule = require('node-schedule');
const { run, get } = require('../database');
const whatsappService = require('./whatsapp');

class AutomationService {
  constructor() {
    this.scheduledJobs = new Map();
  }

  /**
   * Send instant reply to lead
   * @param {number} leadId - Lead ID
   * @returns {Promise<void>}
   */
  async sendInstantReply(leadId) {
    try {
      const lead = await get('SELECT * FROM leads WHERE id = ?', [leadId]);

      if (!lead) {
        console.error(`❌ Lead not found: ${leadId}`);
        return;
      }

      // Check if lead has phone and contact preference is whatsapp
      if (!lead.phone || lead.contact_preference !== 'whatsapp') {
        console.log(`⏭️ Skipping instant reply for lead ${leadId} (no phone or wrong preference)`);
        return;
      }

      // Check if agent has already contacted
      const agentContact = await get(
        `SELECT id FROM conversations WHERE lead_id = ? AND sender = 'agent' LIMIT 1`,
        [leadId]
      );

      if (agentContact) {
        console.log(`⏭️ Skipping instant reply for lead ${leadId} (agent already contacted)`);
        return;
      }

      const messageText = `¡Hola! Gracias por tu interés en Montana Realty. Un agente te contactará en menos de 5 minutos. 🏡`;

      // Send message via WhatsApp
      await whatsappService.sendMessage(lead.phone, messageText);

      // Log automation record
      await run(
        `INSERT INTO automations (lead_id, automation_type, status, sent_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [leadId, 'instant_reply', 'sent']
      );

      console.log(`✅ Instant reply sent to lead ${leadId}`);
    } catch (err) {
      console.error(`❌ Failed to send instant reply for lead ${leadId}:`, err.message);

      // Log failure
      await run(
        `INSERT INTO automations (lead_id, automation_type, status, error_message)
         VALUES (?, ?, ?, ?)`,
        [leadId, 'instant_reply', 'failed', err.message]
      );
    }
  }

  /**
   * Schedule 24-hour follow-up
   * @param {number} leadId - Lead ID
   * @returns {Promise<void>}
   */
  async schedule24hFollowup(leadId) {
    try {
      const lead = await get('SELECT * FROM leads WHERE id = ?', [leadId]);

      if (!lead || !lead.phone || lead.contact_preference !== 'whatsapp') {
        return;
      }

      const scheduledTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const jobKey = `followup_24h_${leadId}`;

      // Schedule job
      const job = schedule.scheduleJob(scheduledTime, async () => {
        try {
          // Check if agent has already contacted
          const agentContact = await get(
            `SELECT id FROM conversations WHERE lead_id = ? AND sender = 'agent' LIMIT 1`,
            [leadId]
          );

          if (agentContact) {
            console.log(`⏭️ Skipping 24h follow-up for lead ${leadId} (agent already contacted)`);
            return;
          }

          const messageText = `Hola de nuevo! 👋 Queremos asegurarme que no te hayas perdido mi mensaje anterior. ¿Tienes alguna pregunta sobre nuestras propiedades?`;

          await whatsappService.sendMessage(lead.phone, messageText);

          await run(
            `INSERT INTO automations (lead_id, automation_type, status, sent_at)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
            [leadId, 'followup_24h', 'sent']
          );

          console.log(`✅ 24h follow-up sent to lead ${leadId}`);
          this.scheduledJobs.delete(jobKey);
        } catch (err) {
          console.error(`❌ Failed to send 24h follow-up for lead ${leadId}:`, err.message);

          await run(
            `INSERT INTO automations (lead_id, automation_type, status, error_message)
             VALUES (?, ?, ?, ?)`,
            [leadId, 'followup_24h', 'failed', err.message]
          );

          this.scheduledJobs.delete(jobKey);
        }
      });

      this.scheduledJobs.set(jobKey, job);

      // Log pending automation
      await run(
        `INSERT INTO automations (lead_id, automation_type, status, scheduled_for)
         VALUES (?, ?, ?, ?)`,
        [leadId, 'followup_24h', 'pending', scheduledTime.toISOString()]
      );

      console.log(`⏰ 24h follow-up scheduled for lead ${leadId} at ${scheduledTime.toISOString()}`);
    } catch (err) {
      console.error(`❌ Failed to schedule 24h follow-up for lead ${leadId}:`, err.message);
    }
  }

  /**
   * Schedule 48-hour follow-up (more aggressive)
   * @param {number} leadId - Lead ID
   * @returns {Promise<void>}
   */
  async schedule48hFollowup(leadId) {
    try {
      const lead = await get('SELECT * FROM leads WHERE id = ?', [leadId]);

      if (!lead || !lead.phone || lead.contact_preference !== 'whatsapp') {
        return;
      }

      const scheduledTime = new Date(Date.now() + 48 * 60 * 60 * 1000);
      const jobKey = `followup_48h_${leadId}`;

      const job = schedule.scheduleJob(scheduledTime, async () => {
        try {
          // Check if agent has already contacted
          const agentContact = await get(
            `SELECT id FROM conversations WHERE lead_id = ? AND sender = 'agent' LIMIT 1`,
            [leadId]
          );

          if (agentContact) {
            console.log(`⏭️ Skipping 48h follow-up for lead ${leadId} (agent already contacted)`);
            return;
          }

          const messageText = `⚡ Última oportunidad! Tenemos propiedades perfectas para tu presupuesto. ¿Podemos ayudarte hoy? Responde "SÍ" para hablar con un agente.`;

          await whatsappService.sendMessage(lead.phone, messageText);

          await run(
            `INSERT INTO automations (lead_id, automation_type, status, sent_at)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
            [leadId, 'followup_48h', 'sent']
          );

          console.log(`✅ 48h follow-up sent to lead ${leadId}`);
          this.scheduledJobs.delete(jobKey);
        } catch (err) {
          console.error(`❌ Failed to send 48h follow-up for lead ${leadId}:`, err.message);

          await run(
            `INSERT INTO automations (lead_id, automation_type, status, error_message)
             VALUES (?, ?, ?, ?)`,
            [leadId, 'followup_48h', 'failed', err.message]
          );

          this.scheduledJobs.delete(jobKey);
        }
      });

      this.scheduledJobs.set(jobKey, job);

      await run(
        `INSERT INTO automations (lead_id, automation_type, status, scheduled_for)
         VALUES (?, ?, ?, ?)`,
        [leadId, 'followup_48h', 'pending', scheduledTime.toISOString()]
      );

      console.log(`⏰ 48h follow-up scheduled for lead ${leadId} at ${scheduledTime.toISOString()}`);
    } catch (err) {
      console.error(`❌ Failed to schedule 48h follow-up for lead ${leadId}:`, err.message);
    }
  }

  /**
   * Schedule 72-hour escalation to manager
   * @param {number} leadId - Lead ID
   * @returns {Promise<void>}
   */
  async scheduleEscalation(leadId) {
    try {
      const lead = await get('SELECT * FROM leads WHERE id = ?', [leadId]);

      if (!lead || !lead.phone || lead.contact_preference !== 'whatsapp') {
        return;
      }

      const scheduledTime = new Date(Date.now() + 72 * 60 * 60 * 1000);
      const jobKey = `escalation_72h_${leadId}`;

      const job = schedule.scheduleJob(scheduledTime, async () => {
        try {
          // Check if agent has already contacted
          const agentContact = await get(
            `SELECT id FROM conversations WHERE lead_id = ? AND sender = 'agent' LIMIT 1`,
            [leadId]
          );

          if (agentContact) {
            console.log(`⏭️ Skipping escalation for lead ${leadId} (agent already contacted)`);
            return;
          }

          const messageText = `🚨 ESCALADO AL GERENTE: Este es un mensaje prioritario de nuestro equipo de gerencia. Estamos aquí para ayudarte. ¿Podemos hablar ahora?`;

          await whatsappService.sendMessage(lead.phone, messageText);

          // Mark lead as escalated
          await run(
            `UPDATE leads SET status = 'escalated' WHERE id = ?`,
            [leadId]
          );

          await run(
            `INSERT INTO automations (lead_id, automation_type, status, sent_at)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
            [leadId, 'escalation_72h', 'sent']
          );

          console.log(`✅ 72h escalation sent to lead ${leadId}`);
          this.scheduledJobs.delete(jobKey);
        } catch (err) {
          console.error(`❌ Failed to send escalation for lead ${leadId}:`, err.message);

          await run(
            `INSERT INTO automations (lead_id, automation_type, status, error_message)
             VALUES (?, ?, ?, ?)`,
            [leadId, 'escalation_72h', 'failed', err.message]
          );

          this.scheduledJobs.delete(jobKey);
        }
      });

      this.scheduledJobs.set(jobKey, job);

      await run(
        `INSERT INTO automations (lead_id, automation_type, status, scheduled_for)
         VALUES (?, ?, ?, ?)`,
        [leadId, 'escalation_72h', 'pending', scheduledTime.toISOString()]
      );

      console.log(`⏰ 72h escalation scheduled for lead ${leadId} at ${scheduledTime.toISOString()}`);
    } catch (err) {
      console.error(`❌ Failed to schedule escalation for lead ${leadId}:`, err.message);
    }
  }

  /**
   * Initialize all 4 automation sequences for a new lead
   * @param {number} leadId - Lead ID
   * @returns {Promise<void>}
   */
  async initializeLeadAutomations(leadId) {
    try {
      console.log(`🚀 Initializing automations for lead ${leadId}`);

      // Send instant reply (synchronous)
      await this.sendInstantReply(leadId);

      // Schedule all future automations
      await this.schedule24hFollowup(leadId);
      await this.schedule48hFollowup(leadId);
      await this.scheduleEscalation(leadId);

      console.log(`✅ All automations initialized for lead ${leadId}`);
    } catch (err) {
      console.error(`❌ Failed to initialize automations for lead ${leadId}:`, err.message);
    }
  }

  /**
   * Cancel all scheduled jobs for a lead (e.g., if agent contacts them)
   * @param {number} leadId - Lead ID
   * @returns {void}
   */
  cancelLeadAutomations(leadId) {
    try {
      const jobKeys = Array.from(this.scheduledJobs.keys()).filter(key => key.includes(`_${leadId}`));

      for (const key of jobKeys) {
        const job = this.scheduledJobs.get(key);
        if (job) {
          job.cancel();
          this.scheduledJobs.delete(key);
          console.log(`⏹️ Cancelled automation job: ${key}`);
        }
      }

      if (jobKeys.length > 0) {
        console.log(`✅ All automations cancelled for lead ${leadId}`);
      }
    } catch (err) {
      console.error(`❌ Failed to cancel automations for lead ${leadId}:`, err.message);
    }
  }
}

module.exports = new AutomationService();
