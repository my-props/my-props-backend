const teamStatsRepository = require("../repositories/teamStatsRepository");

async function getAllTeamStats() {
    try {
        const teamStats = await teamStatsRepository.getAllTeamStats();
        return teamStats;
    } catch (error) {
        console.error('Error in teamStatsService.getAllTeamStats:', error);
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
        throw error;
    }
}


module.exports = {
  getAllTeamStats,
  getTeamStatsById,
  getTeamStatsByTeamId,
  getTeamStatsBySeason,
  getTeamStatsByGameId
};
