const teamRepository = require("../repositories/teamRepository");
const errorLogService = require("./errorLogService");

async function getAllTeams() {
    try {
        const teams = await teamRepository.getAllTeams();
        return teams;
    } catch (error) {
        console.error('Error in teamService.getAllTeams:', error);
        await errorLogService.logServiceError(error, 'teamService.js', null, { function: 'getAllTeams' });
        throw error;
    }
}

async function getTeamById(id) {
    try {
        if (!id) {
            throw new Error("Team ID is required");
        }

        const team = await teamRepository.getTeamById(id);

        if (!team) {
            throw new Error("Team not found");
        }

        return team;
    } catch (error) {
        console.error('Error in teamService.getTeamById:', error);
        await errorLogService.logServiceError(error, 'teamService.js', null, { function: 'getTeamById', id });
        throw error;
    }
}

async function getTeamsByLeagueId(leagueId) {
    try {
        if (!leagueId) {
            throw new Error("League ID is required");
        }

        const teams = await teamRepository.getTeamsByLeagueId(leagueId);
        return teams;
    } catch (error) {
        console.error('Error in teamService.getTeamsByLeagueId:', error);
        await errorLogService.logServiceError(error, 'teamService.js', null, { function: 'getTeamsByLeagueId', leagueId });
        throw error;
    }
}

async function getTeamsByCity(city) {
    try {
        if (!city) {
            throw new Error("City is required");
        }

        const teams = await teamRepository.getTeamsByCity(city);
        return teams;
    } catch (error) {
        console.error('Error in teamService.getTeamsByCity:', error);
        await errorLogService.logServiceError(error, 'teamService.js', null, { function: 'getTeamsByCity', city });
        throw error;
    }
}


module.exports = {
  getAllTeams,
  getTeamById,
  getTeamsByLeagueId,
  getTeamsByCity
};
