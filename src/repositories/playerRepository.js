const { getPool } = require("../config/database");

async function getAllPlayers() {
  const query = `SELECT * FROM Player`;

  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all players:', error);
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
    throw error;
  }
}

async function getPlayersByTeamId(teamId) {
  const query = `SELECT * FROM Player WHERE teamId = @teamId`;

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('teamId', teamId)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting players by team id:', error);
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
    throw error;
  }
}


module.exports = {
  getAllPlayers,
  getPlayerById,
  getPlayersByTeamId,
  getPlayersByPosition
};
