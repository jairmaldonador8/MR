const { run } = require('../database');

class LeadScoringService {
  /**
   * Calculate lead score based on lead data
   * Scoring algorithm:
   * - Base score: 10 points (form submission)
   * - Property interest: +1 point per property (max 5)
   * - Budget specified: +5 points
   * - Narrow budget range (<2M): +2 points
   * - WhatsApp preference: +3 points
   * - Source=comparison: +5 points
   * - Max score: 100
   *
   * @param {Object} leadData - Lead data object
   * @returns {number} Calculated score (0-100)
   */
  calculateScore(leadData) {
    let score = 10; // Base score for form submission

    // Property interest: +1 per property (max 5)
    if (leadData.properties && Array.isArray(leadData.properties)) {
      const propertyCount = Math.min(leadData.properties.length, 5);
      score += propertyCount;
    }

    // Budget specified: +5 points
    const hasBudgetMin = leadData.budget_min !== null && leadData.budget_min !== undefined;
    const hasBudgetMax = leadData.budget_max !== null && leadData.budget_max !== undefined;

    if (hasBudgetMin || hasBudgetMax) {
      score += 5;

      // Narrow budget range (<$2M): +2 additional points
      if (
        hasBudgetMin &&
        hasBudgetMax &&
        (leadData.budget_max - leadData.budget_min) < 2000000
      ) {
        score += 2;
      }
    }

    // WhatsApp preference: +3 points
    if (leadData.contact_preference === 'whatsapp') {
      score += 3;
    }

    // Source = comparison tool: +5 points
    if (leadData.source === 'comparison') {
      score += 5;
    }

    // Cap at 100
    return Math.min(score, 100);
  }

  /**
   * Determine priority tier based on score
   * @param {number} score - Lead score
   * @returns {string} Priority tier: 'hot', 'warm', or 'cold'
   */
  getPriority(score) {
    if (score >= 25) {
      return 'hot';
    } else if (score >= 15) {
      return 'warm';
    } else {
      return 'cold';
    }
  }

  /**
   * Update lead score in database and return priority
   * @param {number} leadId - Lead ID
   * @param {number} score - Lead score to update
   * @returns {Promise<Object>} Object with score and priority
   */
  async updateScore(leadId, score) {
    try {
      const priority = this.getPriority(score);

      await run(
        `UPDATE leads SET lead_score = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [score, leadId]
      );

      console.log(`✅ Lead score updated: ${leadId} (Score: ${score}, Priority: ${priority})`);

      return {
        leadId,
        score,
        priority,
      };
    } catch (err) {
      console.error('❌ Failed to update lead score:', err);
      throw err;
    }
  }
}

module.exports = new LeadScoringService();
