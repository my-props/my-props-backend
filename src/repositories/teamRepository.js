const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

async function getAllTeams() {
  const query = `SELECT Id, Name from Team where Active = 1`;

  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all teams:', error);
    await errorLogService.logDatabaseError(error, 'teamRepository.js', null, { function: 'getAllTeams' });
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
    await errorLogService.logDatabaseError(error, 'teamRepository.js', null, { function: 'getTeamById', id });
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
    await errorLogService.logDatabaseError(error, 'teamRepository.js', null, { function: 'getTeamsByLeagueId', leagueId });
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
    await errorLogService.logDatabaseError(error, 'teamRepository.js', null, { function: 'getTeamsByCity', city });
    throw error;
  }
}


module.exports = {
  getAllTeams,
  getTeamById,
  getTeamsByLeagueId,
  getTeamsByCity
};
