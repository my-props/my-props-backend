const { getPool } = require("../config/database");

async function getPlayerVsTeamStatistics(playerId, teamId) {
    const query = `
  
  `;

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('playerId', playerId);
        request.input('teamId', teamId);

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting player vs team statistics:', error);
        throw error;
    }
}

module.exports.getPlayerVsTeamStatistics = getPlayerVsTeamStatistics;
