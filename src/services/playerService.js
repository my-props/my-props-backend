const playerRepository = require("../repositories/playerRepository");
const errorLogService = require("./errorLogService");

async function getAllPlayers() {
  try {
    const players = await playerRepository.getAllPlayers();
    return players;
  } catch (error) {
    console.error('Error in playerService.getAllPlayers:', error);
    await errorLogService.logServiceError(error, 'playerService.js', null, { function: 'getAllPlayers' });
    throw error;
  }
}

async function getPlayerById(id) {
  try {
    if (!id) {
      throw new Error("Player ID is required");
    }

    const player = await playerRepository.getPlayerById(id);

    if (!player) {
      throw new Error("Player not found");
    }

    return player;
  } catch (error) {
    console.error('Error in playerService.getPlayerById:', error);
    await errorLogService.logServiceError(error, 'playerService.js', null, { function: 'getPlayerById', id });
    throw error;
  }
}

async function getPlayersByTeamId(teamId) {
  try {
    if (!teamId) {
      throw new Error("Team ID is required");
    }

    const players = await playerRepository.getPlayersByTeamId(teamId);
    return players;
  } catch (error) {
    console.error('Error in playerService.getPlayersByTeamId:', error);
    await errorLogService.logServiceError(error, 'playerService.js', null, { function: 'getPlayersByTeamId', teamId });
    throw error;
  }
}

async function getPlayersByPosition(position) {
  try {
    if (!position) {
      throw new Error("Position is required");
    }

    const players = await playerRepository.getPlayersByPosition(position);
    return players;
  } catch (error) {
    console.error('Error in playerService.getPlayersByPosition:', error);
    await errorLogService.logServiceError(error, 'playerService.js', null, { function: 'getPlayersByPosition', position });
    throw error;
  }
}


module.exports = {
  getAllPlayers,
  getPlayerById,
  getPlayersByTeamId,
  getPlayersByPosition
};
