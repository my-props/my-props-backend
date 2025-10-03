const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

async function getNextGames() {
  const query = `SELECT * FROM Game`;

  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting next games:', error);
    await errorLogService.logDatabaseError(error, 'gamesRepository.js', null, { function: 'getNextGames' });
    throw error;
  }
}

module.exports = { getNextGames };
