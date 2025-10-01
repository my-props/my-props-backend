const { getPool } = require("../config/database");

async function getAllTeams() {
  const query = `SELECT * FROM Team`;
  
  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all teams:', error);
    throw error;
  }
}

async function getTeamById(id) {
  const query = `SELECT * FROM Team WHERE id = @id`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting team by id:', error);
    throw error;
  }
}

async function getTeamsByLeagueId(leagueId) {
  const query = `SELECT * FROM Team WHERE leagueId = @leagueId`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('leagueId', leagueId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting teams by league id:', error);
    throw error;
  }
}

async function getTeamsByCity(city) {
  const query = `SELECT * FROM Team WHERE city = @city`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('city', city)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting teams by city:', error);
    throw error;
  }
}


module.exports = {
  getAllTeams,
  getTeamById,
  getTeamsByLeagueId,
  getTeamsByCity
};
