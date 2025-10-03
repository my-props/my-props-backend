const playerStatisticsRepository = require("../repositories/playerStatisticsRepository")
const errorLogService = require("./errorLogService")

async function getPlayerVsTeamStatistics(playerId, teamId) {
  try {
    if (!playerId) {
      throw new Error("Player ID is required")
    }
    if (!teamId) {
      throw new Error("Team ID is required")
    }

    let rows = await playerStatisticsRepository.getPlayerVsTeamStatistics(
      playerId,
      teamId
    )

    if (rows.length === 0) {
      throw new Error("No matchup data found for the provided IDs")
    }

    return rows
  } catch (error) {
    console.error(
      "Error in playerStatisticsService.getPlayerVsTeamStatistics:",
      error
    )
    await errorLogService.logServiceError(
      error,
      "playerStatisticsService.js",
      null,
      { function: "getPlayerVsTeamStatistics", playerId, teamId }
    )
    throw error
  }
}

async function getPlayerVsPlayerStatistics(playerId1, playerId2) {
  try {
    let rows = await playerStatisticsRepository.getPlayerVsPlayerStatistics(
      playerId1,
      playerId2
    );

    if (rows.length === 0) {
      throw new Error("No matchup data found for the provided player IDs");
    }

    return rows;
  } catch (error) {
    console.error('Error in playerStatisticsService.getPlayerVsPlayerStatistics:', error);
    await errorLogService.logServiceError(error, 'playerStatisticsService.js', null, { function: 'getPlayerVsPlayerStatistics', playerId1, playerId2 });
    throw error;
  }
}

async function getPlayerVsAllTeamsStatistics(playerId, seasonId = null) {
  try {
    if (!playerId) {
      throw new Error("Player ID is required");
    }

    let rows = await playerStatisticsRepository.getPlayerVsAllTeamsStatistics(
      playerId,
      seasonId
    );

    if (rows.length === 0) {
      throw new Error("No statistics found for the provided player ID");
    }

    return rows;
  } catch (error) {
    console.error('Error in playerStatisticsService.getPlayerVsAllTeamsStatistics:', error);
    await errorLogService.logServiceError(error, 'playerStatisticsService.js', null, { function: 'getPlayerVsAllTeamsStatistics', playerId, seasonId });
    throw error;
  }
}

async function getPlayerVsTeamDetailedStatistics(playerId, enemyTeamId, seasonId = null) {
  try {
    if (!playerId) {
      throw new Error("Player ID is required");
    }
    if (!enemyTeamId) {
      throw new Error("Enemy team ID is required");
    }

    let result = await playerStatisticsRepository.getPlayerVsTeamDetailedStatistics(
      playerId,
      enemyTeamId,
      seasonId
    );

    if (!result) {
      throw new Error("No statistics found for the provided player and team combination");
    }

    return result;
  } catch (error) {
    console.error('Error in playerStatisticsService.getPlayerVsTeamDetailedStatistics:', error);
    await errorLogService.logServiceError(error, 'playerStatisticsService.js', null, { function: 'getPlayerVsTeamDetailedStatistics', playerId, enemyTeamId, seasonId });
    throw error;
  }
}

async function getPlayerVsPositionStatistics(playerId, enemyPosition, seasonId = null) {
  try {
    if (!playerId) {
      throw new Error("Player ID is required");
    }
    if (!enemyPosition) {
      throw new Error("Enemy position is required");
    }

    let result = await playerStatisticsRepository.getPlayerVsPositionStatistics(
      playerId,
      enemyPosition,
      seasonId
    );

    if (!result) {
      throw new Error("No statistics found for the provided player and position combination");
    }

    return result;
  } catch (error) {
    console.error('Error in playerStatisticsService.getPlayerVsPositionStatistics:', error);
    await errorLogService.logServiceError(error, 'playerStatisticsService.js', null, { function: 'getPlayerVsPositionStatistics', playerId, enemyPosition, seasonId });
    throw error;
  }
}

async function getPlayerInPositionVsTeamStatistics(playerId, enemyTeamId, position, seasonId = null) {
  try {
    if (!playerId) {
      throw new Error("Player ID is required");
    }
    if (!enemyTeamId) {
      throw new Error("Enemy team ID is required");
    }
    if (!position) {
      throw new Error("Position is required");
    }

    let result = await playerStatisticsRepository.getPlayerInPositionVsTeamStatistics(
      playerId,
      enemyTeamId,
      position,
      seasonId
    );

    if (!result) {
      throw new Error("No statistics found for the provided player, position, and team combination");
    }

    return result;
  } catch (error) {
    console.error('Error in playerStatisticsService.getPlayerInPositionVsTeamStatistics:', error);
    await errorLogService.logServiceError(error, 'playerStatisticsService.js', null, { function: 'getPlayerInPositionVsTeamStatistics', playerId, enemyTeamId, position, seasonId });
    throw error;
  }
}

async function getPlayerInPositionVsAllTeamsStatistics(playerId, position, seasonId = null) {
  try {
    if (!playerId) {
      throw new Error("Player ID is required");
    }
    if (!position) {
      throw new Error("Position is required");
    }

    let rows = await playerStatisticsRepository.getPlayerInPositionVsAllTeamsStatistics(
      playerId,
      position,
      seasonId
    );

    if (rows.length === 0) {
      throw new Error("No statistics found for the provided player and position");
    }

    return rows;
  } catch (error) {
    console.error('Error in playerStatisticsService.getPlayerInPositionVsAllTeamsStatistics:', error);
    await errorLogService.logServiceError(error, 'playerStatisticsService.js', null, { function: 'getPlayerInPositionVsAllTeamsStatistics', playerId, position, seasonId });
    throw error;
  }
}

module.exports.getPlayerVsTeamStatistics = getPlayerVsTeamStatistics;
module.exports.getPlayerVsPlayerStatistics = getPlayerVsPlayerStatistics;
module.exports.getPlayerVsAllTeamsStatistics = getPlayerVsAllTeamsStatistics;
module.exports.getPlayerVsTeamDetailedStatistics = getPlayerVsTeamDetailedStatistics;
module.exports.getPlayerVsPositionStatistics = getPlayerVsPositionStatistics;
module.exports.getPlayerInPositionVsTeamStatistics = getPlayerInPositionVsTeamStatistics;
module.exports.getPlayerInPositionVsAllTeamsStatistics = getPlayerInPositionVsAllTeamsStatistics;
