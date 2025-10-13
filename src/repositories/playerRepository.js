const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

async function getAllPlayers() {
  const query = `SELECT * FROM Player`;

  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all players:', error);
    await errorLogService.logDatabaseError(error, 'playerRepository.js', null, { function: 'getAllPlayers' });
    throw error;
  }
}

async function getPlayerById(id) {
  const query = `SELECT * FROM Player WHERE id = @id`;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting player by id:', error);
    await errorLogService.logDatabaseError(error, 'playerRepository.js', null, { function: 'getPlayerById', id });
    throw error;
  }
}

async function getPlayersByTeamId(teamId) {
  const query = `SELECT PLAYER_ID AS Id, FirstName, LastName, PLAYER_PHOTO as PlayerPhoto FROM VW_PLAYER_CURRENT_TEAM WHERE TEAM_ID = @TEAM_ID`;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('TEAM_ID', teamId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting players by team id:', error);
    await errorLogService.logDatabaseError(error, 'playerRepository.js', null, { function: 'getPlayersByTeamId', teamId });
    throw error;
  }
}

async function getPlayersByPosition(position) {
  const query = `SELECT * FROM Player WHERE position = @position`;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('position', position)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting players by position:', error);
    await errorLogService.logDatabaseError(error, 'playerRepository.js', null, { function: 'getPlayersByPosition', position });
    throw error;
  }
}


module.exports = {
  getAllPlayers,
  getPlayerById,
  getPlayersByTeamId,
  getPlayersByPosition
};
