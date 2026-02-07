const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        index: true  
    },
    endpoint: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true,
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']
    },
    statusCode: {
        type: Number,
        required: true
    },
    responseTime: {
        type: Number,  // milliseconds
        required: true
    },
    userAgent: {
        type: String,
        default: 'Unknown'
    },
    ip: {
        type: String,
        default: 'Unknown'
    },
    queryParams: {
        type: Object,
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true  
    }
});

auditLogSchema.index({ user: 1, timestamp: -1 });

auditLogSchema.index({ endpoint: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
