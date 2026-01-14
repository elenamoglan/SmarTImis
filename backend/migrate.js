const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const runMigrations = async () => {
    try {
        const client = await pool.connect();
        
        // 002 Notification
        try {
            const sql002 = fs.readFileSync(path.join(__dirname, 'migrations', '002_create_notifications.sql'), 'utf8');
            await client.query(sql002);
            console.log('Migration 002 executed.');
        } catch (e) {
            console.log('Migration 002 skipped/error (might already exist):', e.message);
        }

        // 003 Likes
        try {
            const sql003 = fs.readFileSync(path.join(__dirname, 'migrations', '003_add_likes.sql'), 'utf8');
            await client.query(sql003);
            console.log('Migration 003 executed.');
        } catch (e) {
             console.log('Migration 003 skipped/error:', e.message);
        }

        client.release();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runMigrations();
