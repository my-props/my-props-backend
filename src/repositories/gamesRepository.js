const { getPool } = require("../config/database");

async function getNextGames() {
  const query = `SELECT * FROM Game`;

  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting next games:', error);
    throw error;
  }
}

module.exports = { getNextGames };
