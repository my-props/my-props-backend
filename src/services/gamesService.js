const gamesRepository = require("../repositories/gamesRepository");

async function getNextGames() {
  let rows = await gamesRepository.getNextGames();

  if (rows.length === 0) {
    throw new Error("No matchup data found for the provided IDs");
  }

  return rows;
}

module.exports.getNextGames = getNextGames;
