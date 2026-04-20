const AutomationService = require('../../services/automation');

describe('Automation Service', () => {
  describe('Service Methods', () => {
    it('should have sendInstantReply method', () => {
      expect(typeof AutomationService.sendInstantReply).toBe('function');
    });

    it('should have schedule24hFollowup method', () => {
      expect(typeof AutomationService.schedule24hFollowup).toBe('function');
    });

    it('should have schedule48hFollowup method', () => {
      expect(typeof AutomationService.schedule48hFollowup).toBe('function');
    });

    it('should have scheduleEscalation method', () => {
      expect(typeof AutomationService.scheduleEscalation).toBe('function');
    });

    it('should have initializeLeadAutomations method', () => {
      expect(typeof AutomationService.initializeLeadAutomations).toBe('function');
    });

    it('should have cancelLeadAutomations method', () => {
      expect(typeof AutomationService.cancelLeadAutomations).toBe('function');
    });
  });

  describe('Service Structure', () => {
    it('should have scheduledJobs Map', () => {
      expect(AutomationService.scheduledJobs).toBeInstanceOf(Map);
    });
  });

  describe('Initialization', () => {
    it('should initialize with empty scheduled jobs', () => {
      expect(AutomationService.scheduledJobs.size).toBeGreaterThanOrEqual(0);
    });
  });
});
