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

// Helper function to transform game data
function transformGame(game) {
  const baseGame = {
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
  }

  // Add score data if it exists (for previous games)
  if (game.HomeTeamTotalPoints !== null && game.HomeTeamTotalPoints !== undefined) {
    baseGame.homeTeam.score = {
      total: game.HomeTeamTotalPoints,
      q1: game.HomeTeamPointsQ1,
      q2: game.HomeTeamPointsQ2,
      q3: game.HomeTeamPointsQ3,
      q4: game.HomeTeamPointsQ4,
      win: game.HomeTeamWin,
      loss: game.HomeTeamLoss
    }
  }

  if (game.VisitorTeamTotalPoints !== null && game.VisitorTeamTotalPoints !== undefined) {
    baseGame.visitorTeam.score = {
      total: game.VisitorTeamTotalPoints,
      q1: game.VisitorTeamPointsQ1,
      q2: game.VisitorTeamPointsQ2,
      q3: game.VisitorTeamPointsQ3,
      q4: game.VisitorTeamPointsQ4,
      win: game.VisitorTeamWin,
      loss: game.VisitorTeamLoss
    }
  }

  return baseGame
}

async function getTodaysGames(filters = {}) {
  try {
    // Fetch today's games, next 8 games, and previous 8 games in parallel
    const [todaysGames, next8Games, previous8Games] = await Promise.all([
      gamesRepository.getTodaysGames(filters),
      gamesRepository.getNext8Games(filters),
      gamesRepository.getPrevious8Games(filters)
    ])

    // Transform all three datasets
    const transformedTodaysGames = todaysGames.map(transformGame)
    const transformedNext8Games = next8Games.map(transformGame)
    const transformedPrevious8Games = previous8Games.map(transformGame)

    return {
      todayGames: {
        games: transformedTodaysGames,
        totalCount: transformedTodaysGames.length
      },
      next8Games: {
        games: transformedNext8Games,
        totalCount: transformedNext8Games.length
      },
      previous8Games: {
        games: transformedPrevious8Games,
        totalCount: transformedPrevious8Games.length
      },
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
