const AuditLog = require('../models/AuditLog');

/**
 * Middleware that logs every API request to MongoDB
 * It captures request details before processing and adds response info after
 */
const auditLogger = (req, res, next) => {
    // Skip logging for the logs endpoint itself to avoid infinite loops
    if (req.path.startsWith('/api/logs')) {
        return next();
    }

    const startTime = Date.now();

    // Grab the user identifier - could be from auth or just use IP
    const user = req.user?.id || req.user?.email || req.ip || 'anonymous';

    // Hook into response finish to capture status code and timing
    res.on('finish', async () => {
        try {
            const logEntry = {
                user: user,
                endpoint: req.originalUrl.split('?')[0],  // Path without query string
                method: req.method,
                statusCode: res.statusCode,
                responseTime: Date.now() - startTime,
                userAgent: req.get('User-Agent') || 'Unknown',
                ip: req.ip,
                queryParams: req.query,
                timestamp: new Date()
            };

            // Save async - we don't want to slow down the response
            await AuditLog.create(logEntry);
        } catch (err) {
            // Log the error but don't crash the app
            console.error('Failed to save audit log:', err.message);
        }
    });

    next();
};

module.exports = auditLogger;
