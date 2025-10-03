const gamesRepository = require("../repositories/gamesRepository");
const errorLogService = require("./errorLogService");

async function getNextGames() {
  try {
    let rows = await gamesRepository.getNextGames();

    if (rows.length === 0) {
      throw new Error("No matchup data found for the provided IDs");
    }

    return rows;
  } catch (error) {
    console.error('Error in gamesService.getNextGames:', error);
    await errorLogService.logServiceError(error, 'gamesService.js', null, { function: 'getNextGames' });
    throw error;
  }
}

module.exports.getNextGames = getNextGames;
