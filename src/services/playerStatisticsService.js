const playerStatisticsRepository = require("../repositories/playerStatisticsRepository");

async function getPlayerVsTeamStatistics(playerId, teamId) {
  let rows = await playerStatisticsRepository.getPlayerVsTeamStatistics(
    playerId,
    teamId
  );

  if (rows.length === 0) {
    throw new Error("No matchup data found for the provided IDs");
  }

  return rows;
}

module.exports.getPlayerVsTeamStatistics = getPlayerVsTeamStatistics;
