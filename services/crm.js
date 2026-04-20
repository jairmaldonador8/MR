const axios = require('axios');

class CRMService {
  constructor() {
    this.baseURL = process.env.REAL_GEEKS_API_URL || 'https://api.realgeeks.com/v1';
    this.apiKey = process.env.REAL_GEEKS_API_KEY || '';
  }

  /**
   * Sync lead to Real Geeks CRM
   * @param {Object} leadData - Lead data to sync
   * @returns {Promise<Object>} CRM response with lead ID
   */
  async syncLead(leadData) {
    try {
      const payload = {
        first_name: leadData.name?.split(' ')[0] || '',
        last_name: leadData.name?.split(' ').slice(1).join(' ') || '',
        email: leadData.email,
        phone: leadData.phone || '',
        lead_score: leadData.lead_score || 0,
        source: leadData.source || 'form',
        property_interest: leadData.properties ? leadData.properties.length : 0,
        custom_fields: {
          budget_min: leadData.budget_min,
          budget_max: leadData.budget_max,
          contact_preference: leadData.contact_preference,
          lead_score: leadData.lead_score,
        },
      };

      // In production, this would call the actual Real Geeks API
      // For now, we'll simulate the API call
      if (!this.apiKey) {
        console.log('⚠️ Real Geeks API key not configured, simulating CRM sync');
        return {
          success: true,
          crm_lead_id: `sim_${Date.now()}`,
          status: 'synced',
        };
      }

      const response = await axios.post(`${this.baseURL}/leads`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`✅ Lead synced to CRM: ${leadData.email} (CRM ID: ${response.data.id})`);
      return {
        success: true,
        crm_lead_id: response.data.id,
        status: 'synced',
      };
    } catch (err) {
      console.error('❌ CRM sync failed:', err.message);
      return {
        success: false,
        error: err.message,
        status: 'failed',
      };
    }
  }

  /**
   * Assign lead to agent in CRM
   * @param {string} crmLeadId - CRM lead ID
   * @param {string} agentId - Agent ID
   * @returns {Promise<Object>} Assignment response
   */
  async assignLead(crmLeadId, agentId) {
    try {
      if (!this.apiKey) {
        console.log(`⚠️ Simulating lead assignment: ${crmLeadId} -> ${agentId}`);
        return {
          success: true,
          crm_lead_id: crmLeadId,
          agent_id: agentId,
          status: 'assigned',
        };
      }

      const response = await axios.put(
        `${this.baseURL}/leads/${crmLeadId}/assign`,
        { agent_id: agentId },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Lead assigned in CRM: ${crmLeadId} -> ${agentId}`);
      return {
        success: true,
        crm_lead_id: crmLeadId,
        agent_id: agentId,
        status: 'assigned',
      };
    } catch (err) {
      console.error('❌ CRM assignment failed:', err.message);
      return {
        success: false,
        error: err.message,
        status: 'failed',
      };
    }
  }

  /**
   * Update lead status in CRM
   * @param {string} crmLeadId - CRM lead ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Status update response
   */
  async updateLeadStatus(crmLeadId, status) {
    try {
      if (!this.apiKey) {
        console.log(`⚠️ Simulating status update: ${crmLeadId} -> ${status}`);
        return {
          success: true,
          crm_lead_id: crmLeadId,
          status: status,
        };
      }

      const response = await axios.put(
        `${this.baseURL}/leads/${crmLeadId}`,
        { status: status },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Lead status updated in CRM: ${crmLeadId} -> ${status}`);
      return {
        success: true,
        crm_lead_id: crmLeadId,
        status: status,
      };
    } catch (err) {
      console.error('❌ CRM status update failed:', err.message);
      return {
        success: false,
        error: err.message,
        status: 'failed',
      };
    }
  }
}

module.exports = new CRMService();
