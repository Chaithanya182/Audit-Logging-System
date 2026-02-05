const express = require('express');
const router = express.Router();
const { getLogs, exportLogs, getFilterOptions } = require('../controllers/logController');

// GET /api/logs - Fetch logs with filters and pagination
router.get('/', getLogs);

// GET /api/logs/export - Export filtered logs as CSV
router.get('/export', exportLogs);

// GET /api/logs/options - Get unique values for filter dropdowns
router.get('/options', getFilterOptions);

module.exports = router;
