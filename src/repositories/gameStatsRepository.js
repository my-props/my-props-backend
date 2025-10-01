const { getPool } = require("../config/database");

async function getAllGameStats() {
  const query = `SELECT * FROM GameStats`;
  
  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all game stats:', error);
    throw error;
  }
}

async function getGameStatsById(id) {
  const query = `SELECT * FROM GameStats WHERE id = @id`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting game stats by id:', error);
    throw error;
  }
}

async function getGameStatsByGameId(gameId) {
  const query = `SELECT * FROM GameStats WHERE gameId = @gameId`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('gameId', gameId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting game stats by game id:', error);
    throw error;
  }
}


module.exports = {
  getAllGameStats,
  getGameStatsById,
  getGameStatsByGameId
};
