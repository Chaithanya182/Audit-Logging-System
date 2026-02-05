const AuditLog = require('../models/AuditLog');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');


const getLogs = async (req, res) => {
    try {
        const {
            user,
            endpoint,
            method,
            startDate,
            endDate,
            page = 1,
            limit = 20
        } = req.query;

        const filter = {};

        if (user) {
            filter.user = { $regex: user, $options: 'i' };  // Case-insensitive search
        }

        if (endpoint) {
            filter.endpoint = { $regex: endpoint, $options: 'i' };
        }

        if (method) {
            filter.method = method.toUpperCase();
        }

        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) {
                filter.timestamp.$gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                filter.timestamp.$lte = end;
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const total = await AuditLog.countDocuments(filter);

        const logs = await AuditLog.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            data: logs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch logs',
            error: error.message
        });
    }
};

const exportLogs = async (req, res) => {
    try {
        const { user, endpoint, method, startDate, endDate } = req.query;

        const filter = {};

        if (user) {
            filter.user = { $regex: user, $options: 'i' };
        }
        if (endpoint) {
            filter.endpoint = { $regex: endpoint, $options: 'i' };
        }
        if (method) {
            filter.method = method.toUpperCase();
        }
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                filter.timestamp.$lte = end;
            }
        }

        const logs = await AuditLog.find(filter)
            .sort({ timestamp: -1 })
            .lean();

        if (logs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No logs found matching the criteria'
            });
        }

        // Create temp file path    
        const fileName = `audit_logs_${Date.now()}.csv`;
        const filePath = path.join(__dirname, '..', 'exports', fileName);

        // Ensure exports directory exists
        const exportsDir = path.join(__dirname, '..', 'exports');
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }

        // Set up CSV writer
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'timestamp', title: 'Timestamp' },
                { id: 'user', title: 'User' },
                { id: 'endpoint', title: 'Endpoint' },
                { id: 'method', title: 'Method' },
                { id: 'statusCode', title: 'Status Code' },
                { id: 'responseTime', title: 'Response Time (ms)' },
                { id: 'userAgent', title: 'User Agent' },
                { id: 'ip', title: 'IP Address' }
            ]
        });

        // Format the data for CSV
        const csvData = logs.map(log => ({
            timestamp: new Date(log.timestamp).toISOString(),
            user: log.user,
            endpoint: log.endpoint,
            method: log.method,
            statusCode: log.statusCode,
            responseTime: log.responseTime,
            userAgent: log.userAgent,
            ip: log.ip
        }));

        await csvWriter.writeRecords(csvData);

        // Send the file
        res.download(filePath, fileName, (err) => {
            // Clean up the temp file after sending
            fs.unlink(filePath, () => { });
            if (err) {
                console.error('Error sending file:', err);
            }
        });
    } catch (error) {
        console.error('Error exporting logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export logs',
            error: error.message
        });
    }
};


const getFilterOptions = async (req, res) => {
    try {
        const [users, endpoints, methods] = await Promise.all([
            AuditLog.distinct('user'),
            AuditLog.distinct('endpoint'),
            AuditLog.distinct('method')
        ]);

        res.json({
            success: true,
            data: {
                users: users.slice(0, 100),  // Limit to prevent huge lists
                endpoints: endpoints.slice(0, 100),
                methods
            }
        });
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch filter options',
            error: error.message
        });
    }
};

module.exports = {
    getLogs,
    exportLogs,
    getFilterOptions
};
