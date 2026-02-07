require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const auditLogger = require('./middleware/auditLogger');
const logsRoutes = require('./routes/logs');
const sampleRoutes = require('./routes/sample');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for frontend
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://audit-logging-client.onrender.com',
        'https://audit-logging-system-d4dhm14fp-chaithanya182s-projects.vercel.app'
    ],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.set('trust proxy', true);
app.use(auditLogger);

app.use('/api/logs', logsRoutes);
app.use('/api/sample', sampleRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

console.log('Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });
