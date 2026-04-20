const express = require('express');
const router = express.Router();

// Mock property data (will be enhanced later)
const PROPERTIES = [
  {
    id: 1,
    name: 'Casa Montaña del Valle',
    price: 12500000,
    area: 620,
    location: 'Valle Oriente',
    roi: 4.2,
    appreciation: 'Alto',
  },
  {
    id: 2,
    name: 'Penthouse Vistas',
    price: 8900000,
    area: 280,
    location: 'Del Valle',
    roi: 5.1,
    appreciation: 'Muy Alto',
  },
  {
    id: 3,
    name: 'Residencia Bosques',
    price: 15200000,
    area: 750,
    location: 'Bosques de las Lomas',
    roi: 3.8,
    appreciation: 'Alto',
  },
  {
    id: 4,
    name: 'Departamento Reforma',
    price: 5600000,
    area: 180,
    location: 'Juárez',
    roi: 6.2,
    appreciation: 'Muy Alto',
  },
];

// POST /api/comparison - Get comparison data
router.post('/', async (req, res) => {
  try {
    const { propertyIds } = req.body;

    if (!propertyIds || propertyIds.length === 0) {
      return res.status(400).json({ error: 'propertyIds required' });
    }

    const comparison = PROPERTIES.filter(p => propertyIds.includes(p.id));

    res.json({
      properties: comparison,
      analysis: {
        bestValue: comparison[0]?.id, // TODO: Implement logic
        bestROI: comparison[0]?.id,
        summary: 'Comparison analysis',
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate comparison' });
  }
});

module.exports = router;
