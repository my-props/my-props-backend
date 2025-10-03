const playerStatisticsRepository = require("../repositories/playerStatisticsRepository");
const errorLogService = require("./errorLogService");

async function getPlayerVsTeamStatistics(playerId, teamId) {
  try {
    let rows = await playerStatisticsRepository.getPlayerVsTeamStatistics(
      playerId,
      teamId
    );

    if (rows.length === 0) {
      throw new Error("No matchup data found for the provided IDs");
    }

    return rows;
  } catch (error) {
    console.error('Error in playerStatisticsService.getPlayerVsTeamStatistics:', error);
    await errorLogService.logServiceError(error, 'playerStatisticsService.js', null, { function: 'getPlayerVsTeamStatistics', playerId, teamId });
    throw error;
  }
}

module.exports.getPlayerVsTeamStatistics = getPlayerVsTeamStatistics;
