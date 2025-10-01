const { getPool } = require("../config/database");

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
    throw error;
  }
}

module.exports.getTeamStatistics = getTeamStatistics;
