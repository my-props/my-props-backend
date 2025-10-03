const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

async function getLeagues() {
    const query = `SELECT * FROM League`;

    try {
        const pool = await getPool();
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting leagues:', error);
        await errorLogService.logDatabaseError(error, 'leagueRepository.js', null, { function: 'getLeagues' });
        throw error;
    }
}

module.exports = { getLeagues };
