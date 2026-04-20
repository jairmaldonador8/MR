# Deployment Guide

Complete instructions for deploying Montana Realty Lead Generation Platform across different environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [WhatsApp API Setup](#whatsapp-api-setup)
6. [Real Geeks CRM Setup](#real-geeks-crm-setup)
7. [Running the Server](#running-the-server)
8. [Testing](#testing)
9. [Production Deployment](#production-deployment)
10. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Prerequisites

### System Requirements

- **Node.js:** v16.0.0 or higher
- **npm:** v7.0.0 or higher
- **Git:** For version control
- **SQLite3:** Included with Node (no separate installation needed)

### Verify Installation

```bash
node --version  # Should be v16.0.0 or higher
npm --version   # Should be v7.0.0 or higher
git --version   # Should be installed
```

### Optional Tools

- **Postman:** For API testing
- **ngrok:** For testing WhatsApp webhooks locally
- **PM2:** For production process management

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/montana-realty.git
cd montana-realty
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- `express` - Web framework
- `sqlite3` - Database
- `axios` - HTTP client
- `dotenv` - Environment variable management
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing
- `node-schedule` - Job scheduling

### Step 3: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### Step 4: Initialize Database

```bash
mkdir -p data
npm run dev
```

The database will auto-initialize on first server start. Press `Ctrl+C` to stop.

### Step 5: Verify Setup

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-20T14:30:00.000Z"
}
```

---

## Environment Configuration

### .env File Template

Copy the content below to `.env` in the project root:

```bash
# ========== Database ==========
DB_PATH=./data/montana.db

# ========== WhatsApp Business API ==========
# Get these from Meta Business Manager: https://business.facebook.com
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_API_VERSION=v18.0

# ========== Real Geeks CRM ==========
# Get API URL and key from your Real Geeks account settings
CRM_API_URL=https://api.realgeeks.com
CRM_API_KEY=your_real_geeks_api_key_here
CRM_LEAD_SOURCE=Montana Realty Website

# ========== Server Configuration ==========
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# ========== Webhook Verification ==========
# Use any secure string for webhook verification
WEBHOOK_VERIFY_TOKEN=your_secure_webhook_token_here
```

### Environment Variables Explained

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_PATH` | No | `./data/montana.db` | SQLite database file path |
| `WHATSAPP_PHONE_NUMBER_ID` | Yes* | - | WhatsApp phone number ID from Meta |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Yes* | - | WhatsApp business account ID |
| `WHATSAPP_ACCESS_TOKEN` | Yes* | - | WhatsApp API access token |
| `WHATSAPP_API_VERSION` | No | `v18.0` | WhatsApp API version |
| `CRM_API_URL` | Yes* | - | Real Geeks API endpoint |
| `CRM_API_KEY` | Yes* | - | Real Geeks API key |
| `CRM_LEAD_SOURCE` | No | `Montana Realty Website` | Lead source label in CRM |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment (development/production) |
| `LOG_LEVEL` | No | `info` | Logging level (debug/info/warn/error) |
| `WEBHOOK_VERIFY_TOKEN` | Yes* | - | WhatsApp webhook verification token |

*Required for full functionality, but server will run without them in development mode (with limited features).

### Development vs Production Settings

**Development (.env.development):**
```bash
NODE_ENV=development
LOG_LEVEL=debug
PORT=3000
DB_PATH=./data/montana.db
```

**Production (.env.production):**
```bash
NODE_ENV=production
LOG_LEVEL=warn
PORT=3000
DB_PATH=/var/lib/montana/data.db
# Must have all WhatsApp and CRM credentials
```

---

## Database Setup

### Automatic Initialization

The database initializes automatically on server start:

```bash
npm run dev
```

### Manual Database Reset

To reset the database (development only):

```bash
rm -f data/montana.db
npm run dev
```

### Database Schema

The database is created with the following tables:

#### Leads Table
```sql
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  property_ids TEXT,
  budget_min REAL,
  budget_max REAL,
  contact_preference TEXT DEFAULT 'whatsapp',
  source TEXT,
  status TEXT DEFAULT 'new',
  lead_score INTEGER DEFAULT 0,
  assigned_agent_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Conversations Table
```sql
CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  message TEXT,
  sender TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);
```

#### Automations Table
```sql
CREATE TABLE IF NOT EXISTS automations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  sequence_type TEXT,
  scheduled_time DATETIME,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);
```

#### Agents Table
```sql
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  status TEXT DEFAULT 'available',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Backup & Restore

**Backup:**
```bash
cp data/montana.db data/montana.db.backup-$(date +%Y%m%d-%H%M%S)
```

**Restore:**
```bash
cp data/montana.db.backup-YYYYMMDD-HHMMSS data/montana.db
```

---

## WhatsApp API Setup

### Step 1: Create Meta Business Account

1. Go to https://business.facebook.com
2. Sign in or create an account
3. Create a new Business App

### Step 2: Get WhatsApp Credentials

1. In App Dashboard, go to "WhatsApp" > "Getting Started"
2. Click "Create app" if you haven't already
3. Go to "API Setup" and find:
   - **Phone Number ID:** Copy this to `WHATSAPP_PHONE_NUMBER_ID`
   - **Business Account ID:** Copy this to `WHATSAPP_BUSINESS_ACCOUNT_ID`

### Step 3: Generate Access Token

1. Go to "Settings" > "User Access Tokens"
2. Create a new token with scopes:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
3. Copy the token to `WHATSAPP_ACCESS_TOKEN`

### Step 4: Configure Webhook

1. Go to "Configuration" > "Webhooks"
2. Set webhook URL: `https://yourdomain.com/webhook/whatsapp`
3. Set Verify Token: Copy the value of `WEBHOOK_VERIFY_TOKEN` from `.env`
4. Subscribe to these events:
   - `message` - Incoming messages
   - `message_status` - Message delivery status
   - `message_template_status_update` - Template approvals

### Step 5: Test Connection

Once configured, test with:

```bash
curl -X GET "https://graph.instagram.com/v18.0/me/whatsapp_business_accounts?access_token=YOUR_ACCESS_TOKEN"
```

Expected response should list your business accounts.

### Troubleshooting WhatsApp

- **Token expired:** Generate a new one every 60 days
- **Webhook not verified:** Check `WEBHOOK_VERIFY_TOKEN` matches exactly
- **Messages not sending:** Verify phone number is verified with Meta
- **Rate limited:** WhatsApp has rate limits per phone number

---

## Real Geeks CRM Setup

### Step 1: Get Real Geeks Credentials

1. Log in to your Real Geeks account: https://realgeeks.com
2. Go to "Settings" > "API & Integrations"
3. Create a new API key
4. Copy the API key to `CRM_API_KEY`
5. Note your CRM API URL (usually `https://api.realgeeks.com`)

### Step 2: Configure CRM Settings

Update `.env`:

```bash
CRM_API_URL=https://api.realgeeks.com
CRM_API_KEY=your_api_key_here
CRM_LEAD_SOURCE=Montana Realty Website
```

### Step 3: Test CRM Connection

Create a test lead through the API:

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "email": "test@example.com",
    "phone": "+52 55 1234 5678"
  }'
```

Check Real Geeks dashboard to confirm lead was synced.

### Step 4: Map Custom Fields

If you have custom fields in Real Geeks:

1. Get custom field IDs from Real Geeks API
2. Update `services/crm.js` to map fields correctly
3. Test with a complete lead submission

### Troubleshooting CRM

- **API key invalid:** Regenerate from Real Geeks settings
- **Leads not syncing:** Check CRM_API_KEY in production environment
- **Connection timeout:** Verify network access to Real Geeks API
- **Missing fields:** Map custom fields in services/crm.js

---

## Running the Server

### Development Mode

Start with hot reload (using nodemon):

```bash
npm run dev
```

Server will restart automatically when you modify files.

### Production Mode

```bash
npm start
```

Or with PM2 for process management:

```bash
npm install -g pm2
pm2 start server.js --name "montana-realty"
pm2 save
pm2 startup
```

### Verify Server is Running

```bash
# Check if server is responding
curl http://localhost:3000/api/health

# View recent logs
# (Output will show database initialized and server running messages)
```

### Stop Server

```bash
# If using npm
Ctrl+C

# If using PM2
pm2 stop montana-realty
pm2 delete montana-realty
```

---

## Testing

### Run All Tests

```bash
npm test
```

This runs Jest with coverage report. Expected output:
- 14 tests should pass
- Coverage should be >80% for critical paths

### Run Tests in Watch Mode

```bash
npm run test:watch
```

Automatically re-runs tests when you modify files.

### Manual API Testing

Use cURL to test endpoints:

```bash
# Health check
curl http://localhost:3000/api/health

# Create a lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+52 55 1234 5678"
  }'

# Get leads
curl http://localhost:3000/api/leads

# Compare properties
curl -X POST http://localhost:3000/api/comparison \
  -H "Content-Type: application/json" \
  -d '{"propertyIds": [1, 2]}'
```

### Admin Dashboard Testing

1. Start server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Log in with default credentials
4. Test lead management features

---

## Production Deployment

### Option 1: Vercel

Vercel provides serverless hosting for Node.js applications.

**Setup:**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - All `.env` variables

4. Redeploy:
   ```bash
   vercel --prod
   ```

### Option 2: Heroku

Heroku offers simple container deployment.

**Setup:**

1. Create Heroku account: https://heroku.com
2. Install Heroku CLI
3. Create app:
   ```bash
   heroku create montana-realty
   ```

4. Set environment variables:
   ```bash
   heroku config:set PORT=3000
   heroku config:set NODE_ENV=production
   heroku config:set DB_PATH=/var/lib/montana/montana.db
   heroku config:set WHATSAPP_PHONE_NUMBER_ID=your_id
   # ... set all other variables
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

### Option 3: AWS EC2

For more control, deploy to AWS.

**Setup:**

1. Create EC2 instance (Ubuntu 20.04 LTS)
2. SSH into instance:
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. Clone repository:
   ```bash
   git clone https://github.com/yourusername/montana-realty.git
   cd montana-realty
   ```

5. Install dependencies:
   ```bash
   npm install --production
   ```

6. Create `.env` file with production variables

7. Start with PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "montana-realty"
   pm2 startup
   pm2 save
   ```

8. Configure Nginx as reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. Get SSL certificate:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 4: Docker

Containerize your application.

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t montana-realty .
docker run -p 3000:3000 --env-file .env montana-realty
```

### Option 5: DigitalOcean App Platform

Simple PaaS alternative to Heroku.

1. Connect GitHub repository
2. Set build command: `npm install`
3. Set run command: `npm start`
4. Configure environment variables
5. Deploy

### Production Checklist

- [ ] NODE_ENV set to "production"
- [ ] All API credentials configured
- [ ] Database backed up
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting configured
- [ ] Error logging enabled
- [ ] Monitoring tools set up
- [ ] Database backups automated
- [ ] Health check endpoint working
- [ ] WhatsApp webhook verified
- [ ] CRM sync tested with real data

---

## Monitoring & Troubleshooting

### View Server Logs

**Local:**
```bash
# Logs are printed to console
npm run dev
```

**Production (with PM2):**
```bash
pm2 logs montana-realty
pm2 logs montana-realty --lines 100 --err
```

### Check Server Health

```bash
curl http://yourdomain.com/api/health
```

### Common Issues

#### Server won't start

**Error:** `Error: Database file locked`

**Solution:**
```bash
# Kill existing process
pkill -f "node server.js"
# Clear database lock
rm -f data/montana.db-*
npm run dev
```

#### WhatsApp messages not sending

**Check:**
1. Verify phone number is verified in Meta
2. Confirm access token hasn't expired
3. Check webhook is properly configured
4. Review server logs for errors

**Solution:**
```bash
# Regenerate access token from Meta
# Restart server
npm run dev
```

#### CRM sync failing

**Check:**
1. Verify API key in `.env`
2. Confirm network connectivity to CRM API
3. Check API key has correct permissions

**Solution:**
```bash
# Test API connection
curl -H "Authorization: Bearer $CRM_API_KEY" https://api.realgeeks.com/v1/leads

# Check server logs
npm run dev
```

#### High memory usage

**Check:**
```bash
# With PM2
pm2 monit
```

**Solutions:**
- Increase Node.js heap size: `NODE_OPTIONS=--max-old-space-size=2048`
- Implement caching layer
- Archive old leads to separate database

### Performance Optimization

**For high traffic:**

1. Add caching layer (Redis):
   ```bash
   npm install redis
   ```

2. Add load balancer (Nginx)

3. Add database indexes:
   ```sql
   CREATE INDEX idx_leads_email ON leads(email);
   CREATE INDEX idx_leads_status ON leads(status);
   CREATE INDEX idx_leads_created ON leads(created_at);
   ```

4. Implement API rate limiting

### Database Maintenance

**Weekly:**
```bash
# Backup database
cp data/montana.db data/montana.db.backup-$(date +%Y%m%d)
```

**Monthly:**
```bash
# Vacuum and optimize
sqlite3 data/montana.db "VACUUM; ANALYZE;"
```

### Monitoring Recommendations

For production, integrate:

- **Error tracking:** Sentry, New Relic
- **Uptime monitoring:** Pingdom, UptimeRobot
- **Performance monitoring:** DataDog, New Relic
- **Log aggregation:** ELK Stack, Splunk
- **Database monitoring:** Built-in tools for your hosting provider

---

## Backup Strategy

### Automated Backups

Create a cron job (Linux/Mac):

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/montana-realty/backup.sh
```

**backup.sh:**
```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DB_FILE="/path/to/data/montana.db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_FILE $BACKUP_DIR/montana_$DATE.db
gzip $BACKUP_DIR/montana_$DATE.db

# Keep only last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

### Cloud Backups

- Upload to S3: `aws s3 cp data/montana.db s3://mybucket/backups/`
- Use DigitalOcean Spaces
- Cloud provider native backups

---

## Support

For deployment issues:
1. Check `.env` configuration
2. Review server logs
3. Verify all prerequisites are installed
4. Test each component independently
5. Consult README.md for additional context
