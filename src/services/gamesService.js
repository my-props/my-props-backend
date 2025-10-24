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

async function getTodaysGames(filters = {}) {
  try {
    let rows = await gamesRepository.getTodaysGames(filters)

    if (rows.length === 0) {
      throw new Error("No games found for today")
    }

    // Transform the data to a more user-friendly format
    const transformedGames = rows.map(game => ({
      gameId: game.Id,
      seasonId: game.SeasonId,
      leagueId: game.LeagueId,
      leagueName: game.LeagueName,
      startDate: game.StartDate,
      endDate: game.EndDate,
      duration: game.Duration,
      clock: game.Clock,
      isHalftime: game.IsHalftime,
      short: game.Short,
      status: game.Status,
      currentPeriod: game.CurrentPeriod,
      totalPeriod: game.TotalPeriod,
      endOfPeriod: game.EndOfPeriod,
      homeTeam: {
        id: game.HomeTeamId,
        name: game.HomeTeamName,
        nickName: game.HomeTeamNickName,
        code: game.HomeTeamCode,
        city: game.HomeTeamCity
      },
      visitorTeam: {
        id: game.VisitorTeamId,
        name: game.VisitorTeamName,
        nickName: game.VisitorTeamNickName,
        code: game.VisitorTeamCode,
        city: game.VisitorTeamCity
      }
    }))

    return {
      games: transformedGames,
      totalCount: transformedGames.length,
      filters: filters
    }
  } catch (error) {
    console.error("Error getting today's games:", error)
    await errorLogService.logServiceError(error, "gamesService.js", null, {
      function: "getTodaysGames",
    })
    throw error
  }
}

module.exports = {
  getNextGames,
  getGamesFromLastDays,
  getTodaysGames,
}
