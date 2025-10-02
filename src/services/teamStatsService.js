const teamStatsRepository = require("../repositories/teamStatsRepository");
const errorLogService = require("./errorLogService");

async function getAllTeamStats() {
    try {
        const teamStats = await teamStatsRepository.getAllTeamStats();
        return teamStats;
    } catch (error) {
        console.error('Error in teamStatsService.getAllTeamStats:', error);
        await errorLogService.logServiceError(error, 'teamStatsService.js', null, { function: 'getAllTeamStats' });
        throw error;
    }
}

async function getTeamStatsById(id) {
    try {
        if (!id) {
            throw new Error("Team stats ID is required");
        }

        const teamStats = await teamStatsRepository.getTeamStatsById(id);

        if (!teamStats) {
            throw new Error("Team stats not found");
        }

        return teamStats;
    } catch (error) {
        console.error('Error in teamStatsService.getTeamStatsById:', error);
        await errorLogService.logServiceError(error, 'teamStatsService.js', null, { function: 'getTeamStatsById', id });
        throw error;
    }
}

async function getTeamStatsByTeamId(teamId) {
    try {
        if (!teamId) {
            throw new Error("Team ID is required");
        }

        const teamStats = await teamStatsRepository.getTeamStatsByTeamId(teamId);
        return teamStats;
    } catch (error) {
        console.error('Error in teamStatsService.getTeamStatsByTeamId:', error);
        await errorLogService.logServiceError(error, 'teamStatsService.js', null, { function: 'getTeamStatsByTeamId', teamId });
        throw error;
    }
}

async function getTeamStatsBySeason(seasonId) {
    try {
        if (!seasonId) {
            throw new Error("Season ID is required");
        }

        const teamStats = await teamStatsRepository.getTeamStatsBySeason(seasonId);
        return teamStats;
    } catch (error) {
        console.error('Error in teamStatsService.getTeamStatsBySeason:', error);
        await errorLogService.logServiceError(error, 'teamStatsService.js', null, { function: 'getTeamStatsBySeason', seasonId });
        throw error;
    }
}

async function getTeamStatsByGameId(gameId) {
    try {
        if (!gameId) {
            throw new Error("Game ID is required");
        }

        const teamStats = await teamStatsRepository.getTeamStatsByGameId(gameId);
        return teamStats;
    } catch (error) {
        console.error('Error in teamStatsService.getTeamStatsByGameId:', error);
        await errorLogService.logServiceError(error, 'teamStatsService.js', null, { function: 'getTeamStatsByGameId', gameId });
        throw error;
    }
}

async function getTeamStatsSumByTeamId(teamId) {
    try {
        if (!teamId) {
            throw new Error("Team ID is required");
        }

        const teamStatsSum = await teamStatsRepository.getTeamStatsSumByTeamId(teamId);
        
        if (!teamStatsSum) {
            throw new Error("No statistics found for this team");
        }

        return teamStatsSum;
    } catch (error) {
        console.error('Error in teamStatsService.getTeamStatsSumByTeamId:', error);
        await errorLogService.logServiceError(error, 'teamStatsService.js', null, { function: 'getTeamStatsSumByTeamId', teamId });
        throw error;
    }
}

async function getTeamStatsSumByTeamIds(teamIds) {
    try {
        if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
            throw new Error("Team IDs array is required and must not be empty");
        }

        if (teamIds.length > 10) {
            throw new Error("Maximum 10 team IDs allowed per request");
        }

        // Validate that all teamIds are numbers
        const invalidIds = teamIds.filter(id => isNaN(parseInt(id)));
        if (invalidIds.length > 0) {
            throw new Error(`Invalid team IDs: ${invalidIds.join(', ')}`);
        }

        const teamStatsSum = await teamStatsRepository.getTeamStatsSumByTeamIds(teamIds);
        
        if (!teamStatsSum || teamStatsSum.length === 0) {
            throw new Error("No statistics found for the provided teams");
        }

        return teamStatsSum;
    } catch (error) {
        console.error('Error in teamStatsService.getTeamStatsSumByTeamIds:', error);
        await errorLogService.logServiceError(error, 'teamStatsService.js', null, { function: 'getTeamStatsSumByTeamIds', teamIds });
        throw error;
    }
}

async function getGameStatsByTeamIdsAndGameId(teamIds, gameId) {
    try {
        if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
            throw new Error("Team IDs array is required and must not be empty");
        }

        if (!gameId) {
            throw new Error("Game ID is required");
        }

        if (teamIds.length > 10) {
            throw new Error("Maximum 10 team IDs allowed per request");
        }

        // Validate that all teamIds are numbers
        const invalidIds = teamIds.filter(id => isNaN(parseInt(id)));
        if (invalidIds.length > 0) {
            throw new Error(`Invalid team IDs: ${invalidIds.join(', ')}`);
        }

        // Validate gameId is a number
        if (isNaN(parseInt(gameId))) {
            throw new Error("Game ID must be a valid number");
        }

        const gameStats = await teamStatsRepository.getGameStatsByTeamIdsAndGameId(teamIds, parseInt(gameId));
        
        if (!gameStats || gameStats.length === 0) {
            throw new Error("No game statistics found for the provided teams and game");
        }

        return gameStats;
    } catch (error) {
        console.error('Error in teamStatsService.getGameStatsByTeamIdsAndGameId:', error);
        await errorLogService.logServiceError(error, 'teamStatsService.js', null, { function: 'getGameStatsByTeamIdsAndGameId', teamIds, gameId });
        throw error;
    }
}

async function getTeamStatsAgainstAllOpponents(teamId) {
    try {
        if (!teamId) {
            throw new Error("Team ID is required");
        }

        // Validate teamId is a number
        if (isNaN(parseInt(teamId))) {
            throw new Error("Team ID must be a valid number");
        }

        const teamStats = await teamStatsRepository.getTeamStatsAgainstAllOpponents(parseInt(teamId));
        
        if (!teamStats || teamStats.length === 0) {
            throw new Error("No game statistics found for this team");
        }

        return teamStats;
    } catch (error) {
        console.error('Error in teamStatsService.getTeamStatsAgainstAllOpponents:', error);
        await errorLogService.logServiceError(error, 'teamStatsService.js', null, { function: 'getTeamStatsAgainstAllOpponents', teamId });
        throw error;
    }
}


module.exports = {
  getAllTeamStats,
  getTeamStatsById,
  getTeamStatsByTeamId,
  getTeamStatsBySeason,
  getTeamStatsByGameId,
  getTeamStatsSumByTeamId,
  getTeamStatsSumByTeamIds,
  getGameStatsByTeamIdsAndGameId,
  getTeamStatsAgainstAllOpponents
};
