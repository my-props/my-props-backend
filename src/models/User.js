const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const queryText = `
            INSERT INTO users (email, password, first_name, last_name, phone_number, address_line1, address_line2, city, state, postal_code, country)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, email, first_name, last_name, phone_number, address_line1, address_line2, city, state, postal_code, country, created_at
        `;
        const values = [
            userData.email,
            hashedPassword,
            userData.first_name,
            userData.last_name,
            userData.phone_number,
            userData.address_line1,
            userData.address_line2,
            userData.city,
            userData.state,
            userData.postal_code,
            userData.country
        ];

        try {
            const result = await pool.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
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
            console.error('Error finding user:', error);
            throw error;
        }
    }
}

module.exports = User;
