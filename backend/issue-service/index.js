require('dotenv').config();
const express = require('express');
const cors = require('cors');
const issueRoutes = require('./issue.routes');
const adminRoutes = require('./admin.routes');
const db = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serving uploads could be handled here or separately.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/issues', issueRoutes);
app.use('/api/admin/issues', adminRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Issue Service on port ${PORT}`));
