require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notificationRoutes = require('./notification.routes');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Notification Service on port ${PORT}`));
