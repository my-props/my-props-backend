const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

async function getAllGameStats() {
  const query = `SELECT * FROM GameStats`;
  
  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all game stats:', error);
    await errorLogService.logDatabaseError(error, 'gameStatsRepository.js', null, { function: 'getAllGameStats' });
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
    await errorLogService.logDatabaseError(error, 'gameStatsRepository.js', null, { function: 'getGameStatsById', id });
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
    await errorLogService.logDatabaseError(error, 'gameStatsRepository.js', null, { function: 'getGameStatsByGameId', gameId });
    throw error;
  }
}


module.exports = {
  getAllGameStats,
  getGameStatsById,
  getGameStatsByGameId
};
