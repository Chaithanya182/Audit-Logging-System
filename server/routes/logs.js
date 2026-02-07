const express = require('express');
const router = express.Router();
const { getLogs, exportLogs, getFilterOptions } = require('../controllers/logController');

// GET /api/logs 
router.get('/', getLogs);

// GET /api/logs/export 
router.get('/export', exportLogs);

// GET /api/logs/options
router.get('/options', getFilterOptions);

module.exports = router;
