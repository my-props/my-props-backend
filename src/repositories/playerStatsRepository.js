const { getPool } = require("../config/database");

async function getAllPlayerStats() {
  const query = `SELECT * FROM PlayerStats`;
  
  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all player stats:', error);
    throw error;
  }
}

async function getPlayerStatsById(id) {
  const query = `SELECT * FROM PlayerStats WHERE id = @id`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting player stats by id:', error);
    throw error;
  }
}

async function getPlayerStatsByPlayerId(playerId) {
  const query = `SELECT * FROM PlayerStats WHERE playerId = @playerId`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('playerId', playerId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting player stats by player id:', error);
    throw error;
  }
}

async function getPlayerStatsByGameId(gameId) {
  const query = `SELECT * FROM PlayerStats WHERE gameId = @gameId`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('gameId', gameId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting player stats by game id:', error);
    throw error;
  }
}

async function getPlayerStatsBySeason(seasonId) {
  const query = `SELECT * FROM PlayerStats WHERE seasonId = @seasonId`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('seasonId', seasonId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting player stats by season:', error);
    throw error;
  }
}


module.exports = {
  getAllPlayerStats,
  getPlayerStatsById,
  getPlayerStatsByPlayerId,
  getPlayerStatsByGameId,
  getPlayerStatsBySeason
};
