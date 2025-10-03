const { getPool } = require("../config/database");
const errorLogService = require("../services/errorLogService");

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
        await errorLogService.logDatabaseError(error, 'playerStatisticsRepository.js', null, { function: 'getPlayerVsTeamStatistics', playerId, teamId });
        throw error;
    }
}

module.exports.getPlayerVsTeamStatistics = getPlayerVsTeamStatistics;
