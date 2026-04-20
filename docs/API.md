# Montana Realty API Documentation

Complete API reference for the Montana Realty Lead Generation Platform.

## Base URL

```text
http://localhost:3000/api
```

For production, replace `http://localhost:3000` with your deployment URL.

## Authentication

Currently, API endpoints are open without authentication. For production deployments, implement API key-based authentication by adding the following header to all requests:

```
Authorization: Bearer YOUR_API_KEY
```

## Error Handling

All error responses follow a consistent JSON format:

```json
{
  "error": "Error message describing what went wrong",
  "timestamp": "2026-04-20T14:30:00.000Z"
}
```

### HTTP Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request (resource created)
- `400 Bad Request` - Invalid parameters or missing required fields
- `404 Not Found` - Resource does not exist
- `500 Internal Server Error` - Server error

## Rate Limiting

Not currently implemented. Production deployments should implement rate limiting (e.g., 100 requests per minute per IP).

## Endpoints

---

### 1. Health Check

Check server status and connectivity.

**Endpoint:**
```
GET /api/health
```

**Request:**
```bash
curl -X GET http://localhost:3000/api/health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-04-20T14:30:00.000Z"
}
```

**Use Case:** Monitoring, load balancer health checks, deployment verification.

---

### 2. Create Lead (Submit Form)

Submit a new lead from the progressive form. Automatically triggers lead scoring, CRM sync, and WhatsApp automation sequences.

**Endpoint:**
```
POST /api/leads
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+52 55 1234 5678",
  "properties": [1, 3],
  "budget": {
    "min": 5000000,
    "max": 15000000
  },
  "contactPreference": "whatsapp",
  "source": "form"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Lead's full name |
| `email` | string | Yes | Lead's email address |
| `phone` | string | No | Lead's phone number (format: +country code number) |
| `properties` | array[number] | No | Array of property IDs the lead is interested in |
| `budget.min` | number | No | Minimum budget in MXN |
| `budget.max` | number | No | Maximum budget in MXN |
| `contactPreference` | string | No | Preferred contact method (default: "whatsapp") |
| `source` | string | No | Source of lead (default: "form") |

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria.garcia@example.com",
    "phone": "+52 55 1234 5678",
    "properties": [1, 2],
    "budget": {
      "min": 8000000,
      "max": 12000000
    },
    "contactPreference": "whatsapp",
    "source": "form"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "leadId": 1,
  "leadScore": 28,
  "priority": "hot",
  "message": "Un agente te contactará en menos de 5 minutos"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates successful lead creation |
| `leadId` | number | Unique identifier for the created lead |
| `leadScore` | number | Lead quality score (0-~30) |
| `priority` | string | Lead priority level (cold/warm/hot) |
| `message` | string | Confirmation message for the user |

**Background Actions Triggered:**
1. **Lead Scoring** - Calculates priority score based on budget, properties, and source
2. **CRM Sync** - Syncs lead to Real Geeks CRM (or simulates if API key missing)
3. **WhatsApp Automations** - Initializes automated message sequences:
   - 0 minutes: Welcome message
   - 24 hours: Follow-up with property details
   - 48 hours: Investment tips
   - 72 hours: Available agents

**Error Response (400):**
```json
{
  "error": "Name and email required",
  "timestamp": "2026-04-20T14:30:00.000Z"
}
```

---

### 3. Get All Leads

Retrieve a list of leads with optional filtering and pagination.

**Endpoint:**
```
GET /api/leads
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | - | Filter by lead status (new/contacted/scheduled/closed) |
| `assignedAgent` | string | - | Filter by assigned agent ID |
| `limit` | number | 50 | Maximum number of leads to return |
| `offset` | number | 0 | Number of leads to skip (for pagination) |

**Example cURL:**
```bash
# Get first 50 leads
curl -X GET http://localhost:3000/api/leads

# Get leads with pagination
curl -X GET "http://localhost:3000/api/leads?limit=20&offset=20"

# Filter by status
curl -X GET "http://localhost:3000/api/leads?status=new&limit=50"

# Filter by assigned agent
curl -X GET "http://localhost:3000/api/leads?assignedAgent=agent123&limit=50"
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+52 55 1234 5678",
    "property_ids": "[1, 3]",
    "budget_min": 5000000,
    "budget_max": 15000000,
    "contact_preference": "whatsapp",
    "source": "form",
    "status": "new",
    "lead_score": 28,
    "assigned_agent_id": null,
    "created_at": "2026-04-20T14:30:00.000Z",
    "updated_at": "2026-04-20T14:30:00.000Z"
  },
  {
    "id": 2,
    "name": "María García",
    "email": "maria@example.com",
    "phone": "+52 55 9876 5432",
    "property_ids": "[2]",
    "budget_min": 8000000,
    "budget_max": 12000000,
    "contact_preference": "whatsapp",
    "source": "form",
    "status": "contacted",
    "lead_score": 30,
    "assigned_agent_id": "agent456",
    "created_at": "2026-04-19T10:00:00.000Z",
    "updated_at": "2026-04-20T09:00:00.000Z"
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique lead identifier |
| `name` | string | Lead's name |
| `email` | string | Lead's email |
| `phone` | string | Lead's phone number |
| `property_ids` | string | JSON array of property IDs (stored as string) |
| `budget_min` | number | Minimum budget in MXN |
| `budget_max` | number | Maximum budget in MXN |
| `contact_preference` | string | Preferred contact method |
| `source` | string | Source of the lead |
| `status` | string | Current status (new/contacted/scheduled/closed) |
| `lead_score` | number | Lead quality score (0-~30) |
| `assigned_agent_id` | string\|null | ID of assigned agent, or null if unassigned |
| `created_at` | string | ISO 8601 timestamp of creation |
| `updated_at` | string | ISO 8601 timestamp of last update |

---

### 4. Get Lead Details

Retrieve detailed information about a specific lead.

**Endpoint:**
```
GET /api/leads/:id
```

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Lead ID |

**Example cURL:**
```bash
curl -X GET http://localhost:3000/api/leads/1
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+52 55 1234 5678",
  "property_ids": "[1, 3]",
  "budget_min": 5000000,
  "budget_max": 15000000,
  "contact_preference": "whatsapp",
  "source": "form",
  "status": "new",
  "lead_score": 28,
  "assigned_agent_id": null,
  "created_at": "2026-04-20T14:30:00.000Z",
  "updated_at": "2026-04-20T14:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Lead not found",
  "timestamp": "2026-04-20T14:30:00.000Z"
}
```

**Use Case:** Admin dashboard lead details view, CRM integration, agent assignment.

---

### 5. Property Comparison

Get comparison data for multiple properties based on price, ROI, appreciation, and other factors.

**Endpoint:**
```
POST /api/comparison
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "propertyIds": [1, 2, 3]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `propertyIds` | array[number] | Yes | Array of property IDs to compare |

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/comparison \
  -H "Content-Type: application/json" \
  -d '{
    "propertyIds": [1, 2, 3]
  }'
```

**Response (200):**
```json
{
  "properties": [
    {
      "id": 1,
      "name": "Casa Montaña del Valle",
      "price": 12500000,
      "area": 620,
      "location": "Valle Oriente",
      "roi": 4.2,
      "appreciation": "Alto"
    },
    {
      "id": 2,
      "name": "Penthouse Vistas",
      "price": 8900000,
      "area": 280,
      "location": "Del Valle",
      "roi": 5.1,
      "appreciation": "Muy Alto"
    },
    {
      "id": 3,
      "name": "Residencia Bosques",
      "price": 15200000,
      "area": 750,
      "location": "Bosques de las Lomas",
      "roi": 3.8,
      "appreciation": "Alto"
    }
  ],
  "analysis": {
    "bestValue": 1,
    "bestROI": 2,
    "summary": "Comparison analysis"
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `properties` | array | Array of property objects with details |
| `properties[].id` | number | Property ID |
| `properties[].name` | string | Property name |
| `properties[].price` | number | Price in MXN |
| `properties[].area` | number | Area in square meters |
| `properties[].location` | string | Property location |
| `properties[].roi` | number | Return on investment percentage |
| `properties[].appreciation` | string | Expected appreciation level |
| `analysis.bestValue` | number | Property ID with best value (currently returns first property - full implementation pending) |
| `analysis.bestROI` | number | Property ID with best ROI (currently returns first property - full implementation pending) |
| `analysis.summary` | string | Summary of comparison |

**Note:** The `bestValue` and `bestROI` fields currently return the first property in the list and are not yet fully implemented.

**Error Response (400):**
```json
{
  "error": "propertyIds required",
  "timestamp": "2026-04-20T14:30:00.000Z"
}
```

**Use Case:** Property comparison tool on frontend, lead decision support.

---

## Response Schemas

### Lead Object

```typescript
interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  property_ids: string; // JSON array stored as string
  budget_min?: number;
  budget_max?: number;
  contact_preference: string;
  source: string;
  status: string;
  lead_score: number;
  assigned_agent_id?: string;
  created_at: string;
  updated_at: string;
}
```

### Property Object

```typescript
interface Property {
  id: number;
  name: string;
  price: number;
  area: number;
  location: string;
  roi: number;
  appreciation: string;
}
```

## Common Response Patterns

### Success Response
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error message",
  "timestamp": "2026-04-20T14:30:00.000Z"
}
```

### Paginated Response
When using `limit` and `offset`, the response is a plain JSON array of leads without additional headers.

## Testing Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Create a lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'

# Get all leads
curl http://localhost:3000/api/leads

# Get specific lead
curl http://localhost:3000/api/leads/1

# Compare properties
curl -X POST http://localhost:3000/api/comparison \
  -H "Content-Type: application/json" \
  -d '{"propertyIds":[1,2]}'
```

### Using Postman

1. Import the endpoints as a Postman collection
2. Set base URL: `http://localhost:3000`
3. Create requests for each endpoint
4. Use test scripts to validate responses

### Using Jest Tests

Run the integration tests:
```bash
npm test
```

Tests cover all major endpoints with various scenarios and edge cases.

## Webhook Integration (WhatsApp)

While not a traditional REST endpoint, WhatsApp webhook integration should be configured:

```
POST /webhook/whatsapp
```

**Webhook Verification:**
- WhatsApp sends a GET request with `hub.verify_token`
- Respond with `hub.challenge` if token matches `WEBHOOK_VERIFY_TOKEN`

**Message Handling:**
- Incoming WhatsApp messages trigger lead conversation logging
- Automated responses follow the configured automation sequence

## Rate Limiting Recommendations

For production deployment, implement:

- **Default:** 100 requests per minute per IP
- **Leads endpoint:** 10 requests per minute per IP
- **Comparison endpoint:** 50 requests per minute per IP

## CORS Configuration

Currently allows requests from any origin. For production:

```javascript
cors({
  origin: ['https://yourdomain.com'],
  credentials: true
})
```

## API Versioning

Current API version: v1 (implicit, no version prefix)

For future versions, use: `/api/v2/leads`

## Monitoring & Analytics

Track these metrics in production:
- Average response time per endpoint
- Error rate by status code
- Lead conversion rate
- CRM sync success rate
- WhatsApp message delivery rate

## Security Considerations

- Implement API key authentication
- Use HTTPS in production
- Validate all input parameters
- Sanitize error messages to prevent information disclosure
- Implement rate limiting
- Add request logging for audit trails
- Use CORS to restrict cross-origin access

## Support & Troubleshooting

For issues:
1. Check server health: `GET /api/health`
2. Review error message and status code
3. Check logs: `tail -f server.log`
4. Verify environment variables are set correctly
5. Database initializes automatically on first server start: `npm run dev`
