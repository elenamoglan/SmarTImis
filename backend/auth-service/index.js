require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth.routes');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Export users for inter-service comms
const userRepository = require('./user.repository');
app.get('/api/users/admins', async (req, res) => {
    try {
        const admins = await userRepository.findAdmins();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await userRepository.findUserById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth Service on port ${PORT}`));
