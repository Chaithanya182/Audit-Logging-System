# Audit Logging System

A MERN stack application that logs all API requests and provides a dashboard to view, filter, and export logs.

## Features

- Express.js middleware that automatically logs all API requests
- MongoDB storage with indexed fields for fast queries
- React dashboard with filtering by user, endpoint, date range
- Pagination support
- CSV export functionality

## Log Schema

```javascript
{
  user: String,           // User identifier (IP or auth user)
  endpoint: String,       // API endpoint path
  method: String,         // HTTP method
  statusCode: Number,     // Response status code
  responseTime: Number,   // Request duration in ms
  userAgent: String,      // Client user agent
  ip: String,             // Client IP address
  queryParams: Object,    // Query parameters
  timestamp: Date         // When request was made
}
```

**Indexes**: `user`, `timestamp`, `endpoint`, compound `[user, timestamp]`

## Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally or connection string

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## API Endpoints

### Log Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/logs` | GET | Fetch logs with filters and pagination |
| `/api/logs/export` | GET | Export filtered logs as CSV |
| `/api/logs/options` | GET | Get unique values for filter dropdowns |

### Query Parameters for `/api/logs`

- `user` - Filter by user (partial match)
- `endpoint` - Filter by endpoint (partial match)
- `method` - Filter by HTTP method
- `startDate` - Filter by start date (YYYY-MM-DD)
- `endDate` - Filter by end date (YYYY-MM-DD)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Sample Endpoints (for testing)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sample/users` | GET | Get all users |
| `/api/sample/users/:id` | GET | Get user by ID |
| `/api/sample/products` | GET | Get all products |
| `/api/sample/orders` | POST | Create an order |

## Usage

1. Start both backend and frontend
2. Open `http://localhost:5173` in your browser
3. Click "Generate Sample Logs" to create test data
4. Use filters to narrow down results
5. Click "Export CSV" to download filtered logs

## Environment Variables

Create `.env` in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/audit_logs
NODE_ENV=development
```
