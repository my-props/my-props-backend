const gamesRepository = require("../repositories/gamesRepository")
const errorLogService = require("./errorLogService")

async function getNextGames() {
  try {
    let rows = await gamesRepository.getNextGames()

    if (rows.length === 0) {
      throw new Error("No matchup data found for the provided IDs")
    }

    return rows
  } catch (error) {
    console.error("Error in gamesService.getNextGames:", error)
    await errorLogService.logServiceError(error, "gamesService.js", null, {
      function: "getNextGames",
    })
    throw error
  }
}

async function getGamesFromLastDays(days) {
  try {
    let rows = await gamesRepository.getGamesFromLastDays(days)

    if (rows.length === 0) {
      throw new Error("No matchup data found for the provided dates")
    }
    console.log(rows)
    return rows
  } catch (error) {
    console.error("Error getting past games:", error)
    await errorLogService.logDatabaseError(error, "gamesService.js", null, {
      function: "getGamesFromLastDays",
    })
    throw error
  }
}

module.exports = {
  getNextGames,
  getGamesFromLastDays,
}
