const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

async function getTeamStatistics(teamId1, teamId2) {
  const query = `
    
    `;

  try {
    const pool = await getPool();
    const request = pool.request();
    request.input('teamId1', teamId1);
    request.input('teamId2', teamId2);

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team statistics:', error);
    await errorLogService.logDatabaseError(error, 'teamStatisticsRepository.js', null, { function: 'getTeamStatistics', teamId1, teamId2 });
    throw error;
  }
}

module.exports.getTeamStatistics = getTeamStatistics;
