const AuditLog = require('../models/AuditLog');


const auditLogger = (req, res, next) => {
    if (req.path.startsWith('/api/logs')) {
        return next();
    }

    const startTime = Date.now();

    const user = req.user?.id || req.user?.email || req.ip || 'anonymous';

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

            await AuditLog.create(logEntry);
        } catch (err) {
            console.error('Failed to save audit log:', err.message);
        }
    });

    next();
};

module.exports = auditLogger;
