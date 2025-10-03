const { getPool } = require('../config/database');
const bcrypt = require('bcryptjs');
const errorLogService = require('../services/errorLogService');

class User {
    static async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const queryText = `
            INSERT INTO users (email, password, first_name, last_name, phone_number, address_line1, address_line2, city, state, postal_code, country)
            OUTPUT INSERTED.id, INSERTED.email, INSERTED.first_name, INSERTED.last_name, INSERTED.phone_number, 
                   INSERTED.address_line1, INSERTED.address_line2, INSERTED.city, INSERTED.state, 
                   INSERTED.postal_code, INSERTED.country, INSERTED.created_at
            VALUES (@email, @password, @first_name, @last_name, @phone_number, @address_line1, @address_line2, @city, @state, @postal_code, @country)
        `;

        try {
            const pool = await getPool();
            const request = pool.request();

            // Add parameters
            request.input('email', userData.email);
            request.input('password', hashedPassword);
            request.input('first_name', userData.first_name);
            request.input('last_name', userData.last_name);
            request.input('phone_number', userData.phone_number);
            request.input('address_line1', userData.address_line1);
            request.input('address_line2', userData.address_line2);
            request.input('city', userData.city);
            request.input('state', userData.state);
            request.input('postal_code', userData.postal_code);
            request.input('country', userData.country);

            const result = await request.query(queryText);
            return result.recordset[0];
        } catch (error) {
            console.error('Error creating user:', error);
            await errorLogService.logDatabaseError(error, 'User.js', null, { function: 'create', userData });
            throw error;
        }
    }

    static async findByEmail(email) {
        const queryText = 'SELECT * FROM users WHERE email = @email';

        try {
            const pool = await getPool();
            const request = pool.request();
            request.input('email', email);

            const result = await request.query(queryText);
            return result.recordset[0];
        } catch (error) {
            console.error('Error finding user:', error);
            await errorLogService.logDatabaseError(error, 'User.js', null, { function: 'findByEmail', email });
            throw error;
        }
    }
}

module.exports = User;
