const { getPool } = require("../config/database");

async function getAllTeamStats() {
  const query = `SELECT * FROM TeamStats`;
  
  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all team stats:', error);
    throw error;
  }
}

async function getTeamStatsById(id) {
  const query = `SELECT * FROM TeamStats WHERE id = @id`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting team stats by id:', error);
    throw error;
  }
}

async function getTeamStatsByTeamId(teamId) {
  const query = `SELECT * FROM TeamStats WHERE teamId = @teamId`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('teamId', teamId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team stats by team id:', error);
    throw error;
  }
}

async function getTeamStatsBySeason(seasonId) {
  const query = `SELECT * FROM TeamStats WHERE seasonId = @seasonId`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('seasonId', seasonId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team stats by season:', error);
    throw error;
  }
}

async function getTeamStatsByGameId(gameId) {
  const query = `SELECT * FROM TeamStats WHERE gameId = @gameId`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('gameId', gameId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team stats by game id:', error);
    throw error;
  }
}


module.exports = {
  getAllTeamStats,
  getTeamStatsById,
  getTeamStatsByTeamId,
  getTeamStatsBySeason,
  getTeamStatsByGameId
};
