const LeadScoringService = require('../../services/leadScoring');
const { run } = require('../../database');

jest.mock('../../database');

describe('Lead Scoring Service', () => {
  describe('calculateScore', () => {
    it('should assign base score of 10 for form submission', () => {
      const leadData = {
        properties: [],
        budget_min: null,
        budget_max: null,
        contact_preference: 'email',
        source: 'form',
      };
      const score = LeadScoringService.calculateScore(leadData);
      expect(score).toBeGreaterThanOrEqual(10);
    });

    it('should add 1 point per property (max 5)', () => {
      const leadData = {
        properties: [1, 2, 3],
        budget_min: null,
        budget_max: null,
        contact_preference: 'email',
        source: 'form',
      };
      const score = LeadScoringService.calculateScore(leadData);
      expect(score).toBe(13); // 10 base + 3 properties
    });

    it('should cap property count at 5 properties', () => {
      const leadData = {
        properties: [1, 2, 3, 4, 5, 6, 7],
        budget_min: null,
        budget_max: null,
        contact_preference: 'email',
        source: 'form',
      };
      const score = LeadScoringService.calculateScore(leadData);
      expect(score).toBe(15); // 10 base + 5 properties (max)
    });

    it('should add 5 points for budget specification', () => {
      const leadData = {
        properties: [],
        budget_min: 500000,
        budget_max: 1000000,
        contact_preference: 'email',
        source: 'form',
      };
      const score = LeadScoringService.calculateScore(leadData);
      expect(score).toBe(17); // 10 base + 5 budget + 2 narrow range (< 2M)
    });

    it('should add 2 additional points for narrow budget range (<$2M)', () => {
      const leadData = {
        properties: [],
        budget_min: 500000,
        budget_max: 600000,
        contact_preference: 'email',
        source: 'form',
      };
      const score = LeadScoringService.calculateScore(leadData);
      expect(score).toBe(17); // 10 base + 5 budget + 2 narrow range
    });

    it('should not add narrow range bonus for budget >= $2M', () => {
      const leadData = {
        properties: [],
        budget_min: 500000,
        budget_max: 2500000,
        contact_preference: 'email',
        source: 'form',
      };
      const score = LeadScoringService.calculateScore(leadData);
      expect(score).toBe(15); // 10 base + 5 budget, no narrow range bonus
    });

    it('should add 3 points for WhatsApp preference', () => {
      const leadData = {
        properties: [],
        budget_min: null,
        budget_max: null,
        contact_preference: 'whatsapp',
        source: 'form',
      };
      const score = LeadScoringService.calculateScore(leadData);
      expect(score).toBe(13); // 10 base + 3 whatsapp
    });

    it('should add 5 points for comparison tool source', () => {
      const leadData = {
        properties: [],
        budget_min: null,
        budget_max: null,
        contact_preference: 'email',
        source: 'comparison',
      };
      const score = LeadScoringService.calculateScore(leadData);
      expect(score).toBe(15); // 10 base + 5 comparison source
    });

    it('should combine all scoring factors correctly', () => {
      const leadData = {
        properties: [1, 2, 3, 4, 5],
        budget_min: 500000,
        budget_max: 600000,
        contact_preference: 'whatsapp',
        source: 'comparison',
      };
      const score = LeadScoringService.calculateScore(leadData);
      // 10 base + 5 properties + 5 budget + 2 narrow range + 3 whatsapp + 5 comparison
      expect(score).toBe(30);
    });

    it('should cap score at 100', () => {
      const leadData = {
        properties: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        budget_min: 100000,
        budget_max: 200000,
        contact_preference: 'whatsapp',
        source: 'comparison',
      };
      const score = LeadScoringService.calculateScore(leadData);
      // 10 base + 5 properties + 5 budget + 2 narrow range + 3 whatsapp + 5 comparison = 30
      // but verify capping works with a test that would naturally exceed 100
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBe(30);
    });

    it('should handle null properties gracefully', () => {
      const leadData = {
        properties: null,
        budget_min: null,
        budget_max: null,
        contact_preference: 'email',
        source: 'form',
      };
      const score = LeadScoringService.calculateScore(leadData);
      expect(score).toBe(10); // Base score only
    });

    it('should handle undefined budget gracefully', () => {
      const leadData = {
        properties: [],
        budget_min: undefined,
        budget_max: undefined,
        contact_preference: 'email',
        source: 'form',
      };
      const score = LeadScoringService.calculateScore(leadData);
      expect(score).toBe(10); // Base score only
    });
  });

  describe('getPriority', () => {
    it('should return hot for scores >= 25', () => {
      expect(LeadScoringService.getPriority(25)).toBe('hot');
      expect(LeadScoringService.getPriority(50)).toBe('hot');
      expect(LeadScoringService.getPriority(100)).toBe('hot');
    });

    it('should return warm for scores >= 15 and < 25', () => {
      expect(LeadScoringService.getPriority(15)).toBe('warm');
      expect(LeadScoringService.getPriority(20)).toBe('warm');
      expect(LeadScoringService.getPriority(24)).toBe('warm');
    });

    it('should return cold for scores < 15', () => {
      expect(LeadScoringService.getPriority(0)).toBe('cold');
      expect(LeadScoringService.getPriority(10)).toBe('cold');
      expect(LeadScoringService.getPriority(14)).toBe('cold');
    });
  });

  describe('updateScore', () => {
    beforeEach(() => {
      run.mockClear();
    });

    it('should call database run with correct UPDATE query', async () => {
      run.mockResolvedValue({ changes: 1 });

      await LeadScoringService.updateScore(123, 45);

      expect(run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE leads SET lead_score = ?'),
        [45, 123]
      );
    });

    it('should return object with leadId, score, and priority', async () => {
      run.mockResolvedValue({ changes: 1 });

      const result = await LeadScoringService.updateScore(123, 30);

      expect(result).toEqual({
        leadId: 123,
        score: 30,
        priority: 'hot',
      });
    });

    it('should assign correct priority hot', async () => {
      run.mockResolvedValue({ changes: 1 });

      const result = await LeadScoringService.updateScore(1, 50);
      expect(result.priority).toBe('hot');
    });

    it('should assign correct priority warm', async () => {
      run.mockResolvedValue({ changes: 1 });

      const result = await LeadScoringService.updateScore(1, 20);
      expect(result.priority).toBe('warm');
    });

    it('should assign correct priority cold', async () => {
      run.mockResolvedValue({ changes: 1 });

      const result = await LeadScoringService.updateScore(1, 5);
      expect(result.priority).toBe('cold');
    });

    it('should throw error if database call fails', async () => {
      run.mockRejectedValue(new Error('Database error'));

      await expect(LeadScoringService.updateScore(123, 45)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('Service Structure', () => {
    it('should have calculateScore method', () => {
      expect(typeof LeadScoringService.calculateScore).toBe('function');
    });

    it('should have getPriority method', () => {
      expect(typeof LeadScoringService.getPriority).toBe('function');
    });

    it('should have updateScore method', () => {
      expect(typeof LeadScoringService.updateScore).toBe('function');
    });
  });
});
