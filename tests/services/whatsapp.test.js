const whatsappService = require('../../services/whatsapp');

describe('WhatsApp Service', () => {
  describe('sendMessage', () => {
    it('should have sendMessage method', () => {
      expect(typeof whatsappService.sendMessage).toBe('function');
    });

    it('should accept recipientPhone and messageText parameters', () => {
      const method = whatsappService.sendMessage;
      expect(method.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('sendTemplateMessage', () => {
    it('should have sendTemplateMessage method', () => {
      expect(typeof whatsappService.sendTemplateMessage).toBe('function');
    });

    it('should accept templateName and parameters', () => {
      const method = whatsappService.sendTemplateMessage;
      expect(method.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('handleWebhook', () => {
    it('should have handleWebhook method', () => {
      expect(typeof whatsappService.handleWebhook).toBe('function');
    });

    it('should accept a webhook body', async () => {
      const mockWebhook = {
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              messages: [],
              contacts: [],
            },
          }],
        }],
      };

      // Should not throw
      await expect(whatsappService.handleWebhook(mockWebhook)).resolves.not.toThrow();
    });
  });

  describe('logConversation', () => {
    it('should have logConversation method', () => {
      expect(typeof whatsappService.logConversation).toBe('function');
    });
  });

  describe('Service Structure', () => {
    it('should have phoneNumberId property', () => {
      expect(whatsappService.phoneNumberId).toBeDefined();
    });

    it('should have businessAccountId property', () => {
      expect(whatsappService.businessAccountId).toBeDefined();
    });

    it('should have accessToken property', () => {
      expect(whatsappService.accessToken).toBeDefined();
    });

    it('should have baseUrl property', () => {
      expect(whatsappService.baseUrl).toBeDefined();
    });
  });
});
