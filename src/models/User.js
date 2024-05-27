const pool = require('../db');
const bcrypt = require('bcryptjs');

class User {
    static async create(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const queryText = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at';
        const values = [email, hashedPassword];

        try {
            const result = await pool.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        const queryText = 'SELECT * FROM users WHERE email = $1';
        const values = [email];

        try {
            const result = await pool.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
