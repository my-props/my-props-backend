const teamStatisticsRepository = require("../repositories/teamStatisticsRepository");

async function getTeamStatistics(teamId1, teamId2) {
  let rows = await teamStatisticsRepository.getTeamStatistics(teamId1, teamId2);

  if (rows.length === 0) {
    throw new Error("No matchup data found for the provided team IDs");
  }
  return rows;
}

module.exports.getTeamStatistics = getTeamStatistics;
