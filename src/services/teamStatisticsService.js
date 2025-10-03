const teamStatisticsRepository = require("../repositories/teamStatisticsRepository");
const errorLogService = require("./errorLogService");

async function getTeamStatistics(teamId1, teamId2) {
  try {
    let rows = await teamStatisticsRepository.getTeamStatistics(teamId1, teamId2);

    if (rows.length === 0) {
      throw new Error("No matchup data found for the provided team IDs");
    }
    return rows;
  } catch (error) {
    console.error('Error in teamStatisticsService.getTeamStatistics:', error);
    await errorLogService.logServiceError(error, 'teamStatisticsService.js', null, { function: 'getTeamStatistics', teamId1, teamId2 });
    throw error;
  }
}

module.exports.getTeamStatistics = getTeamStatistics;
