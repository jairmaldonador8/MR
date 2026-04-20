const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');
const AutomationService = require('../services/automation');
const LeadScoringService = require('../services/leadScoring');
const CRMService = require('../services/crm');

// POST /api/leads - Submit lead form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, properties, budget, contactPreference, source } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    // Store lead
    const result = await run(
      `INSERT INTO leads (name, email, phone, property_ids, budget_min, budget_max, contact_preference, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, JSON.stringify(properties || []), budget?.min || null, budget?.max || null, contactPreference || 'whatsapp', source || 'form']
    );

    console.log(`✅ Lead created: ${email} (ID: ${result.id})`);

    // Calculate lead score
    const scoreData = {
      properties: properties || [],
      budget_min: budget?.min || null,
      budget_max: budget?.max || null,
      contact_preference: contactPreference || 'whatsapp',
      source: source || 'form',
    };
    const score = LeadScoringService.calculateScore(scoreData);

    // Update database with score
    await LeadScoringService.updateScore(result.id, score);

    // Sync to CRM with score
    const crmData = {
      name,
      email,
      phone,
      properties,
      budget_min: budget?.min || null,
      budget_max: budget?.max || null,
      contact_preference: contactPreference || 'whatsapp',
      source: source || 'form',
      lead_score: score,
    };
    CRMService.syncLead(crmData).catch(err => {
      console.error('Error syncing to CRM:', err);
    });

    // Initialize WhatsApp automations
    AutomationService.initializeLeadAutomations(result.id).catch(err => {
      console.error('Error initializing automations:', err);
    });

    res.status(201).json({
      success: true,
      leadId: result.id,
      leadScore: score,
      priority: LeadScoringService.getPriority(score),
      message: 'Un agente te contactará en menos de 5 minutos',
    });
  } catch (err) {
    console.error('Error creating lead:', err);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// GET /api/leads/:id - Retrieve lead details (for admin dashboard)
router.get('/:id', async (req, res) => {
  try {
    const lead = await get('SELECT * FROM leads WHERE id = ?', [req.params.id]);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve lead' });
  }
});

// GET /api/leads - Get all leads (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { status, assignedAgent, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM leads WHERE 1=1';
    let params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (assignedAgent) {
      query += ' AND assigned_agent_id = ?';
      params.push(assignedAgent);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const leads = await all(query, params);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve leads' });
  }
});

module.exports = router;
