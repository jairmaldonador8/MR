# Montana Realty Lead Generation Platform

A modern, high-performance lead generation and customer engagement platform built for premium real estate companies. Montana Realty streamlines the lead acquisition process with an intelligent 3-step progressive form, property comparison tools, automated WhatsApp follow-ups, and a comprehensive admin dashboard.

## Key Features

### 1. Progressive Lead Capture Form
- **3-Step Form:** Guides visitors through a smooth, non-intrusive lead capture experience
- **Field Validation:** Real-time validation ensures data quality
- **Smart Defaults:** Context-aware field suggestions based on user behavior
- **Conversion Optimized:** Designed for maximum completion rates (28-35% target)

### 2. Property Comparison Tool
- **Multi-Property Analysis:** Compare up to 5 properties simultaneously
- **Key Metrics:** Price, area, location, ROI, appreciation potential
- **Investment Insights:** Data-driven recommendations for lead decision-making
- **Visual Comparison:** Side-by-side property details for easy evaluation

### 3. Lead Scoring Algorithm
- **Intelligent Scoring:** Automatic scoring based on property interest, budget, and source
- **Priority Levels:** Automatic categorization (cold/warm/hot)
- **Real-Time Calculation:** Scores computed instantly on form submission
- **Lead Ranking:** Helps agents prioritize follow-ups

### 4. WhatsApp Business API Integration
- **Automated Sequences:** Scheduled follow-up messages at optimal times
  - 0 minutes: Welcome message
  - 24 hours: Property details and insights
  - 48 hours: Investment tips and market analysis
  - 72 hours: Available agents and next steps
- **2-Way Messaging:** Track conversations with leads
- **Message Templates:** Pre-approved templates for compliance
- **Delivery Tracking:** Monitor message status and engagement

### 5. Real Geeks CRM Synchronization
- **Bi-Directional Sync:** Automatically sync leads with Real Geeks CRM
- **Custom Fields:** Map form data to CRM fields
- **Duplicate Prevention:** Checks for existing leads by email
- **Lead Score Syncing:** CRM receives calculated lead quality scores

### 6. Admin Dashboard
- **Lead Queue:** View all leads with filtering and sorting
- **Contact Management:** Quick contact buttons (WhatsApp, Phone, Email)
- **Lead Details:** Complete view of lead information and conversation history
- **Agent Assignment:** Assign leads to team members
- **Performance Analytics:** Track conversion rates and response times

### 7. Sticky CTA Button
- **Always Visible:** Persistent call-to-action for high visibility
- **Mobile Optimized:** Responsive design for all devices
- **Customizable:** Easy to adjust text, color, and position
- **Analytics Tracking:** Monitor CTA engagement

## Quick Start

### Prerequisites

- Node.js v16.0.0 or higher
- npm v7.0.0 or higher
- Git
- SQLite3 (included with Node)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/montana-realty.git
cd montana-realty

# Install dependencies
npm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your credentials
# - WhatsApp Business API credentials
# - Real Geeks CRM API key
# - Server port (default: 3000)
```

### Step 3: Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Step 4: Access the Application

- **Frontend:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000 (includes login)
- **API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health

## Project Structure

```
montana-realty/
├── admin/                    # Admin dashboard
│   ├── auth.js              # Authentication logic
│   ├── dashboard.html       # Dashboard UI
│   └── dashboard.js         # Dashboard functionality
├── api/                     # API route handlers
│   ├── leads.js             # Lead creation and retrieval
│   ├── comparison.js        # Property comparison
│   └── contact.js           # Contact management
├── db/                      # Database files
│   └── schema.sql           # Database schema
├── data/                    # SQLite database (generated)
│   └── montana.db
├── services/                # Business logic
│   ├── automation.js        # WhatsApp automation sequences
│   ├── crm.js              # Real Geeks CRM integration
│   ├── leadScoring.js      # Lead scoring algorithm
│   └── whatsapp.js         # WhatsApp API client
├── tests/                   # Jest test suite
│   └── integration.test.js  # Integration tests
├── docs/                    # Documentation
│   ├── API.md              # Complete API reference
│   └── DEPLOYMENT.md       # Deployment instructions
├── config.js               # Configuration loader
├── database.js             # Database utilities
├── server.js               # Express app entry point
├── package.json            # Dependencies and scripts
└── .env.example            # Environment template
```

## API Documentation

Complete API endpoint documentation is available in [docs/API.md](/docs/API.md).

### Core Endpoints

- `POST /api/leads` - Submit a new lead
- `GET /api/leads` - Retrieve all leads with filtering
- `GET /api/leads/:id` - Get specific lead details
- `POST /api/comparison` - Compare properties
- `GET /api/health` - Server health check

**Example:**
```bash
# Create a lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+52 55 1234 5678",
    "properties": [1, 2],
    "budget": { "min": 5000000, "max": 15000000 },
    "contactPreference": "whatsapp"
  }'
```

## Deployment

Comprehensive deployment instructions for local, staging, and production environments are available in [docs/DEPLOYMENT.md](/docs/DEPLOYMENT.md).

### Quick Deployment Summary

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```

**Heroku:**
```bash
heroku create montana-realty
git push heroku main
```

**AWS EC2:**
```bash
# Follow detailed guide in docs/DEPLOYMENT.md
```

**Docker:**
```bash
docker build -t montana-realty .
docker run -p 3000:3000 --env-file .env montana-realty
```

## Testing

Run the comprehensive test suite:

```bash
# Run all tests with coverage
npm test

# Watch mode (re-run on file changes)
npm run test:watch
```

### Test Coverage

- 14 integration tests covering all major features
- Tests for lead creation, retrieval, and scoring
- CRM sync testing
- WhatsApp automation testing
- Property comparison testing

## Environment Configuration

### Required Variables

```bash
# Database
DB_PATH=./data/montana.db

# WhatsApp Business API (get from Meta Business Manager)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_API_VERSION=v18.0

# Real Geeks CRM (get from your Real Geeks account)
CRM_API_URL=https://api.realgeeks.com
CRM_API_KEY=your_api_key
CRM_LEAD_SOURCE=Montana Realty Website

# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Webhook Verification
WEBHOOK_VERIFY_TOKEN=your_secure_token
```

See [docs/DEPLOYMENT.md](/docs/DEPLOYMENT.md) for detailed configuration instructions.

## Features in Detail

### Lead Scoring Algorithm

Leads are scored based on multiple factors with a maximum possible score of approximately 30:

| Factor | Points |
|--------|--------|
| Base score (form submission) | 10 |
| Property interest | +1 per property (max 5) |
| Budget specified | +5 |
| Narrow budget range (<2M) | +2 |
| WhatsApp preference | +3 |
| Comparison tool source | +5 |
| **Maximum possible score** | **~30** |

**Priority Tiers:**
- **Hot (score >= 25):** Immediate follow-up required
- **Warm (score 15-24):** Standard follow-up within 24 hours
- **Cold (score < 15):** Educational nurture sequence

### WhatsApp Automation Sequence

Leads receive a 4-stage automated sequence:

1. **Stage 0 (Immediate):** Welcome message acknowledging lead submission
2. **Stage 1 (24h):** Personalized property recommendations
3. **Stage 2 (48h):** Investment insights and market analysis
4. **Stage 3 (72h):** Agent introduction and consultation offer

Each message is customized based on lead data and can be manually overridden by agents.

### Admin Dashboard Features

- **Lead Queue:** All leads sorted by score and creation date
- **Quick Actions:** WhatsApp, call, email buttons for each lead
- **Bulk Operations:** Assign agents, change status for multiple leads
- **Search & Filter:** Find leads by name, email, property interest
- **Conversation History:** View all interactions with each lead
- **Performance Metrics:** Conversion rates, response times, agent productivity

## Success Metrics

Montana Realty is designed to achieve:

- **28-35% Form Conversion Rate:** 3-step progressive form design optimizes completion
- **3-5x Faster Response Time:** Automated WhatsApp sequences provide immediate follow-up
- **87% Follow-up Rate:** Scheduled automations ensure no leads are missed
- **60%+ Lead Quality:** Lead scoring filters out low-intent prospects
- **40%+ Qualified Lead Rate:** Real-time scoring identifies most promising opportunities

## Performance Optimization

- **Database Indexing:** Optimized queries for fast lead retrieval
- **Caching Layer:** Reduce database hits for frequently accessed data
- **API Rate Limiting:** Protect against abuse and ensure fair usage
- **Pagination:** Handle large datasets efficiently
- **Connection Pooling:** Reuse database connections

## Security Considerations

- Input validation on all endpoints
- SQL injection prevention through parameterized queries
- CORS configuration for production
- Rate limiting on sensitive endpoints
- Environment variable management for credentials
- HTTPS enforcement in production

## Troubleshooting

### Server won't start
```bash
# Check if port is already in use
lsof -i :3000
# Kill existing process if needed
kill -9 <PID>
```

### Database issues
```bash
# Reset database
rm -f data/montana.db
npm run dev
```

### WhatsApp not sending messages
1. Verify phone number is registered in Meta
2. Check access token hasn't expired
3. Confirm webhook is properly configured
4. Review server logs for errors

### CRM sync failing
1. Verify API key in .env
2. Test connectivity: `curl https://api.realgeeks.com`
3. Check API key has correct permissions

See [docs/DEPLOYMENT.md](/docs/DEPLOYMENT.md) for detailed troubleshooting guide.

## Git Workflow

### Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

### Deployment
```bash
# Always merge to main before deploying
git checkout main
git pull origin main
git merge feature/your-feature
git push origin main

# Production deployment will trigger automatically
```

## Contributing Guidelines

1. Create a feature branch from `main`
2. Write clear commit messages
3. Include tests for new functionality
4. Update documentation
5. Submit pull request for review
6. Ensure all tests pass before merging

## Available Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server with auto-reload
- `npm test` - Run test suite with coverage
- `npm run test:watch` - Run tests in watch mode

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **Testing:** Jest + Supertest
- **API Integration:** Axios
- **Scheduling:** node-schedule
- **Environment:** dotenv

## Project Status

Phase 1 (Current): ✅ Complete
- Database schema and setup
- Express server and API
- WhatsApp Business API integration
- CRM integration and lead scoring
- Progressive form component
- Property comparison tool
- Sticky CTA button
- Admin dashboard
- Integration testing
- Documentation and deployment preparation

## Future Roadmap

Phase 2:
- Advanced analytics dashboard
- Lead nurture workflows
- SMS integration
- Email campaign automation
- Mobile app
- AI-powered lead insights

## Support & Contact

For issues, questions, or feature requests:

1. Check the [API documentation](/docs/API.md)
2. Review the [deployment guide](/docs/DEPLOYMENT.md)
3. Check server logs: `npm run dev`
4. Open an issue on GitHub

## License

MIT License - See LICENSE file for details

## Changelog

### v1.0.0 (Initial Release)
- Phase 1 implementation complete
- All core features functional
- Comprehensive documentation
- Production-ready deployment guides

---

**Last Updated:** April 20, 2026
**Maintainer:** Montana Realty Development Team
