const { getPool } = require("../config/database");

async function getLeagues() {
    const query = `SELECT * FROM League`;

    try {
        const pool = await getPool();
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting leagues:', error);
        throw error;
    }
}

module.exports = { getLeagues };
