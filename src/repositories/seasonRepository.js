const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

async function getAllSeasons() {
  const query = `SELECT * FROM Season`;
  
  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting all seasons:', error);
    await errorLogService.logDatabaseError(error, 'seasonRepository.js', null, { function: 'getAllSeasons' });
    throw error;
  }
}

async function getSeasonById(id) {
  const query = `SELECT * FROM Season WHERE id = @id`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting season by id:', error);
    await errorLogService.logDatabaseError(error, 'seasonRepository.js', null, { function: 'getSeasonById', id });
    throw error;
  }
}

async function getCurrentSeason() {
  const query = `SELECT * FROM Season WHERE isCurrent = 1`;
  
  try {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting current season:', error);
    await errorLogService.logDatabaseError(error, 'seasonRepository.js', null, { function: 'getCurrentSeason' });
    throw error;
  }
}

async function getSeasonsByYear(year) {
  const query = `SELECT * FROM Season WHERE year = @year`;
  
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('year', year)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting seasons by year:', error);
    await errorLogService.logDatabaseError(error, 'seasonRepository.js', null, { function: 'getSeasonsByYear', year });
    throw error;
  }
}


module.exports = {
  getAllSeasons,
  getSeasonById,
  getCurrentSeason,
  getSeasonsByYear
};
