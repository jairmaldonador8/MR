const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDatabase } = require('./database');
const config = require('./config');

// Import route handlers
const leadsApi = require('./api/leads');
const comparisonApi = require('./api/comparison');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

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

// Initialize and start server
async function start() {
  try {
    await initDatabase();
    console.log('✅ Database initialized');

    app.listen(config.server.port, () => {
      console.log(`✅ Server running on http://localhost:${config.server.port}`);
      console.log(`📝 Environment: ${config.server.nodeEnv}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
