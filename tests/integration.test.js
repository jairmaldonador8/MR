const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { initDatabase, run, get, all } = require('../database');
const LeadScoringService = require('../services/leadScoring');

// Import route handlers
const leadsApi = require('../api/leads');
const comparisonApi = require('../api/comparison');

describe('Integration Tests - Montana Realty Lead Generation Flow', () => {
  let testLeadId = null;
  let app = null;

  // Setup: Initialize database and create test app
  beforeAll(async () => {
    try {
      await initDatabase();
      console.log('✅ Database initialized for integration tests');

      // Create test app (without listening)
      app = express();
      app.use(cors());
      app.use(bodyParser.json({ limit: '10mb' }));
      app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
      app.use(express.static(path.join(__dirname, '../admin')));

      // Routes
      app.use('/api/leads', leadsApi);
      app.use('/api/comparison', comparisonApi);

      // Health check
      app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
      });

      // Error handler
      app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(err.status || 500).json({
          error: err.message || 'Internal server error',
          timestamp: new Date().toISOString(),
        });
      });
    } catch (err) {
      console.error('❌ Failed to initialize database:', err);
      throw err;
    }
  }, 30000);

  // Cleanup: Close database after all tests
  afterAll(async () => {
    try {
      // Close any scheduled jobs
      const automationService = require('../services/automation');
      for (const key of automationService.scheduledJobs.keys()) {
        const job = automationService.scheduledJobs.get(key);
        if (job) {
          job.cancel();
        }
      }
    } catch (err) {
      console.error('Cleanup error:', err);
    }
  });

  // Test 1: Complete form submission flow
  describe('Test 1: Complete form submission flow', () => {
    it('should submit lead via POST /api/leads and verify complete flow', async () => {
      const leadData = {
        name: 'Juan Pérez',
        email: `test-${Date.now()}@example.com`,
        phone: '+52-5555555555',
        properties: [1, 2, 3],
        budget: {
          min: 5000000,
          max: 10000000,
        },
        contactPreference: 'whatsapp',
        source: 'form',
      };

      // Step 1: Submit lead form
      const response = await request(app)
        .post('/api/leads')
        .send(leadData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('leadId');
      expect(response.body).toHaveProperty('leadScore');
      expect(response.body).toHaveProperty('priority');
      expect(response.body.message).toContain('agente');

      testLeadId = response.body.leadId;

      // Step 2: Verify lead stored in database with correct data
      const storedLead = await get('SELECT * FROM leads WHERE id = ?', [testLeadId]);

      expect(storedLead).toBeDefined();
      expect(storedLead.name).toBe(leadData.name);
      expect(storedLead.email).toBe(leadData.email);
      expect(storedLead.phone).toBe(leadData.phone);
      expect(storedLead.contact_preference).toBe('whatsapp');
      expect(storedLead.source).toBe('form');

      // Parse property_ids JSON
      const storedProperties = JSON.parse(storedLead.property_ids);
      expect(storedProperties).toEqual([1, 2, 3]);

      // Step 3: Verify lead_score calculated
      expect(storedLead.lead_score).toBeGreaterThan(0);
      expect(storedLead.lead_score).toBeLessThanOrEqual(100);

      // Calculate expected score and verify it matches
      const scoreData = {
        properties: [1, 2, 3],
        budget_min: 5000000,
        budget_max: 10000000,
        contact_preference: 'whatsapp',
        source: 'form',
      };
      const expectedScore = LeadScoringService.calculateScore(scoreData);
      expect(storedLead.lead_score).toBe(expectedScore);

      // Step 4: Verify automation record created
      // Give automations time to be inserted (they run asynchronously in background)
      // Retry logic to handle timing delays
      let automations = [];
      let retries = 10;
      while (automations.length === 0 && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
        automations = await all('SELECT * FROM automations WHERE lead_id = ?', [testLeadId]);
        retries--;
      }

      // Should have at least one automation scheduled
      expect(automations.length).toBeGreaterThan(0);

      // At minimum, we should have scheduled something
      // May have followups, instant reply, or escalation
      const automationTypes = automations.map(a => a.automation_type);
      const hasAnyAutomation = automationTypes.some(t =>
        t === 'followup_24h' ||
        t === 'followup_48h' ||
        t === 'instant_reply' ||
        t === 'escalation_72h'
      );
      expect(hasAnyAutomation).toBe(true);

      console.log(`✅ Test 1 passed: Lead ${testLeadId} created with score ${storedLead.lead_score}`);
    });

    it('should reject lead submission without required fields', async () => {
      const response = await request(app)
        .post('/api/leads')
        .send({
          phone: '+52-5555555555',
          properties: [1],
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('required');
    });

    it('should reject duplicate email addresses', async () => {
      const email = `duplicate-${Date.now()}@example.com`;
      const leadData = {
        name: 'Test User',
        email,
        phone: '+52-5555555555',
        properties: [1],
      };

      // First submission should succeed
      await request(app)
        .post('/api/leads')
        .send(leadData)
        .expect(201);

      // Second submission with same email should fail
      const response = await request(app)
        .post('/api/leads')
        .send(leadData)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  // Test 2: Property comparison generates correct data
  describe('Test 2: Property comparison generates correct data', () => {
    it('should generate comparison data for selected properties', async () => {
      const response = await request(app)
        .post('/api/comparison')
        .send({
          propertyIds: [1, 2],
        })
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty('properties');
      expect(response.body).toHaveProperty('analysis');

      // Verify properties array length
      expect(Array.isArray(response.body.properties)).toBe(true);
      expect(response.body.properties.length).toBe(2);

      // Verify analysis object exists
      expect(response.body.analysis).toBeDefined();
      expect(response.body.analysis).toHaveProperty('bestValue');
      expect(response.body.analysis).toHaveProperty('bestROI');
      expect(response.body.analysis).toHaveProperty('summary');

      // Verify property data
      const properties = response.body.properties;
      expect(properties[0]).toHaveProperty('id');
      expect(properties[0]).toHaveProperty('name');
      expect(properties[0]).toHaveProperty('price');
      expect(properties[0]).toHaveProperty('area');
      expect(properties[0]).toHaveProperty('location');
      expect(properties[0]).toHaveProperty('roi');
      expect(properties[0]).toHaveProperty('appreciation');

      console.log('✅ Test 2 passed: Comparison data generated correctly');
    });

    it('should handle multiple properties comparison', async () => {
      const response = await request(app)
        .post('/api/comparison')
        .send({
          propertyIds: [1, 2, 3, 4],
        })
        .expect(200);

      expect(response.body.properties.length).toBe(4);
      expect(response.body.analysis).toBeDefined();
    });

    it('should return error for empty propertyIds', async () => {
      const response = await request(app)
        .post('/api/comparison')
        .send({
          propertyIds: [],
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return error when propertyIds not provided', async () => {
      const response = await request(app)
        .post('/api/comparison')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  // Test 3: Lead scoring prioritizes based on intent
  describe('Test 3: Lead scoring prioritizes based on intent', () => {
    it('should score low-intent leads lower than high-intent leads', () => {
      // Low-intent lead: minimal properties, no budget specified, email preference
      const lowIntentData = {
        properties: [],
        budget_min: null,
        budget_max: null,
        contact_preference: 'email',
        source: 'form',
      };

      // High-intent lead: multiple properties, specific budget, whatsapp preference, from comparison tool
      const highIntentData = {
        properties: [1, 2, 3, 4],
        budget_min: 5000000,
        budget_max: 7000000, // Narrow budget range (< 2M difference is worth bonus)
        contact_preference: 'whatsapp',
        source: 'comparison',
      };

      const lowScore = LeadScoringService.calculateScore(lowIntentData);
      const highScore = LeadScoringService.calculateScore(highIntentData);

      expect(highScore).toBeGreaterThan(lowScore);

      console.log(`✅ Low-intent score: ${lowScore}, High-intent score: ${highScore}`);
    });

    it('should correctly apply scoring algorithm rules', () => {
      // Test: Base score (10 points)
      const baseScore = LeadScoringService.calculateScore({
        properties: [],
        budget_min: null,
        budget_max: null,
        contact_preference: 'email',
        source: 'form',
      });
      expect(baseScore).toBe(10); // 10 points base

      // Test: Base + properties (1 point each, max 5)
      const withProperties = LeadScoringService.calculateScore({
        properties: [1, 2, 3],
        budget_min: null,
        budget_max: null,
        contact_preference: 'email',
        source: 'form',
      });
      expect(withProperties).toBe(13); // 10 + 3

      // Test: Budget bonus (5 points)
      const withBudget = LeadScoringService.calculateScore({
        properties: [],
        budget_min: 5000000,
        budget_max: 10000000,
        contact_preference: 'email',
        source: 'form',
      });
      expect(withBudget).toBe(15); // 10 + 5

      // Test: Narrow budget bonus (additional 2 points when range < 2M)
      const withNarrowBudget = LeadScoringService.calculateScore({
        properties: [],
        budget_min: 5000000,
        budget_max: 6000000, // 1M range
        contact_preference: 'email',
        source: 'form',
      });
      expect(withNarrowBudget).toBe(17); // 10 + 5 + 2

      // Test: WhatsApp preference (3 points)
      const withWhatsApp = LeadScoringService.calculateScore({
        properties: [],
        budget_min: null,
        budget_max: null,
        contact_preference: 'whatsapp',
        source: 'form',
      });
      expect(withWhatsApp).toBe(13); // 10 + 3

      // Test: Comparison tool source (5 points)
      const fromComparison = LeadScoringService.calculateScore({
        properties: [],
        budget_min: null,
        budget_max: null,
        contact_preference: 'email',
        source: 'comparison',
      });
      expect(fromComparison).toBe(15); // 10 + 5

      // Test: Maximum score capped at 100
      const maxScore = LeadScoringService.calculateScore({
        properties: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Many properties
        budget_min: 1000000,
        budget_max: 2000000, // Narrow range
        contact_preference: 'whatsapp',
        source: 'comparison',
      });
      expect(maxScore).toBeLessThanOrEqual(100);
    });

    it('should determine correct priority based on score', () => {
      expect(LeadScoringService.getPriority(30)).toBe('hot');
      expect(LeadScoringService.getPriority(25)).toBe('hot');
      expect(LeadScoringService.getPriority(24)).toBe('warm');
      expect(LeadScoringService.getPriority(15)).toBe('warm');
      expect(LeadScoringService.getPriority(14)).toBe('cold');
      expect(LeadScoringService.getPriority(10)).toBe('cold');
    });
  });

  // Test 4: Retrieve lead details via API
  describe('Test 4: Retrieve lead details via API', () => {
    it('should retrieve lead details via GET /api/leads/:id', async () => {
      if (!testLeadId) {
        console.warn('⚠️ Skipping: testLeadId not set from Test 1');
        return;
      }

      const response = await request(app)
        .get(`/api/leads/${testLeadId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', testLeadId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('lead_score');
      expect(response.body).toHaveProperty('created_at');
    });

    it('should return 404 for non-existent lead', async () => {
      const response = await request(app)
        .get('/api/leads/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should retrieve all leads via GET /api/leads', async () => {
      const response = await request(app)
        .get('/api/leads')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check that leads have expected properties
      response.body.forEach(lead => {
        expect(lead).toHaveProperty('id');
        expect(lead).toHaveProperty('name');
        expect(lead).toHaveProperty('email');
        expect(lead).toHaveProperty('lead_score');
      });
    });
  });

  // Test 5: Health check endpoint
  describe('Test 5: Health check endpoint', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
