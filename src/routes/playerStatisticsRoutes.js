const express = require("express");
const router = express.Router();
const playerStatisticsService = require("../services/playerStatisticsService");
const errorLogService = require("../services/errorLogService");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * Unified Player Statistics Endpoint
 * GET /api/player-stats
 * 
 * Query Parameters:
 * @param {number} playerId - Player ID (required)
 * @param {string} queryType - Type of query (optional, default: 'vs-all-teams')
 *   - 'vs-team': Player vs specific team
 *   - 'vs-position': Player vs specific position
 *   - 'vs-all-teams': Player vs all teams
 *   - 'in-position-vs-team': Player in specific position vs team
 *   - 'in-position-vs-all-teams': Player in specific position vs all teams
 *   - 'vs-player': Player vs player head-to-head
 * @param {number} enemyTeamId - Enemy team ID (required for vs-team, in-position-vs-team)
 * @param {string} enemyPosition - Enemy position (required for vs-position)
 * @param {string} playerPosition - Player position (required for in-position queries)
 * @param {number} playerId2 - Second player ID (required for vs-player)
 * @param {number} seasonId - Season ID (optional)
 * @param {string} fields - Comma-separated fields to return (optional)
 * @param {string} groupBy - Group by: 'team', 'position', 'game', 'season' (optional)
 * @param {string} orderBy - Order by field (optional, default: 'AveragePoints')
 * @param {string} orderDirection - Order direction: 'ASC' or 'DESC' (optional, default: 'DESC')
 * @param {number} limit - Limit results (optional)
 */
router.get("/player-stats", asyncHandler(async (req, res) => {
  try {
    const {
      playerId,
      queryType = 'vs-all-teams',
      enemyTeamId,
      enemyPosition,
      playerPosition,
      playerId2,
      seasonId,
      fields,
      groupBy,
      orderBy,
      orderDirection,
      limit
    } = req.query;

    // Validate required parameters
    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: "Player ID is required"
      });
    }

    // Parse fields if provided
    const fieldsArray = fields ? fields.split(',').map(f => f.trim()) : [];

    // Parse limit if provided
    const limitNum = limit ? parseInt(limit) : undefined;
    if (limit && (isNaN(limitNum) || limitNum < 1)) {
      return res.status(400).json({
        success: false,
        error: "Limit must be a positive number"
      });
    }

    // Build query parameters
    const params = {
      playerId: parseInt(playerId),
      queryType,
      fields: fieldsArray,
      groupBy,
      orderBy,
      orderDirection,
      limit: limitNum
    };

    // Add optional parameters if provided
    if (enemyTeamId) params.enemyTeamId = parseInt(enemyTeamId);
    if (enemyPosition) params.enemyPosition = enemyPosition;
    if (playerPosition) params.playerPosition = playerPosition;
    if (playerId2) params.playerId2 = parseInt(playerId2);
    if (seasonId) params.seasonId = parseInt(seasonId);

    // Get data from service
    const data = await playerStatisticsService.getPlayerStatistics(params);

    // Return response
    res.status(200).json({
      success: true,
      data: data,
      meta: {
        queryType,
        playerId: params.playerId,
        totalResults: data.length,
        fields: fieldsArray.length > 0 ? fieldsArray : 'all',
        groupBy: groupBy || 'team',
        orderBy: orderBy || 'AveragePoints',
        orderDirection: orderDirection || 'DESC',
        limit: limitNum || 'none'
      }
    });

  } catch (error) {
    await errorLogService.logRouteError(
      error,
      'playerStatisticsRoutes.js',
      {
        route: '/player-stats',
        method: 'GET',
        query: req.query
      }
    );
    throw error; // Let the global error handler deal with it
  }
}));

/**
 * Get available query types and their required parameters
 * GET /api/player-stats/query-types
 */
router.get("/player-stats/query-types", asyncHandler(async (req, res) => {
  try {
    const queryTypes = {
      'vs-team': {
        description: 'Player vs specific team statistics',
        required: ['playerId', 'enemyTeamId'],
        optional: ['seasonId', 'fields', 'groupBy', 'orderBy', 'orderDirection', 'limit']
      },
      'vs-position': {
        description: 'Player vs specific position statistics',
        required: ['playerId', 'enemyPosition'],
        optional: ['seasonId', 'fields', 'groupBy', 'orderBy', 'orderDirection', 'limit']
      },
      'vs-all-teams': {
        description: 'Player vs all teams statistics',
        required: ['playerId'],
        optional: ['seasonId', 'fields', 'groupBy', 'orderBy', 'orderDirection', 'limit']
      },
      'in-position-vs-team': {
        description: 'Player in specific position vs team statistics',
        required: ['playerId', 'enemyTeamId', 'playerPosition'],
        optional: ['seasonId', 'fields', 'groupBy', 'orderBy', 'orderDirection', 'limit']
      },
      'in-position-vs-all-teams': {
        description: 'Player in specific position vs all teams statistics',
        required: ['playerId', 'playerPosition'],
        optional: ['seasonId', 'fields', 'groupBy', 'orderBy', 'orderDirection', 'limit']
      },
      'vs-player': {
        description: 'Player vs player head-to-head statistics',
        required: ['playerId', 'playerId2'],
        optional: ['seasonId', 'fields', 'orderBy', 'orderDirection', 'limit']
      }
    };

    const availableFields = [
      'PlayerId', 'PlayerFirstName', 'PlayerLastName', 'PlayerPosition',
      'EnemyTeamId', 'EnemyTeamName', 'EnemyTeamNickName',
      'SeasonId', 'SeasonYear', 'AveragePoints', 'AverageRebounds',
      'AverageAssists', 'AverageSteals', 'AverageBlocks', 'AverageTurnovers',
      'AverageFieldGoalsMade', 'AverageFieldGoalsAttempted',
      'AverageThreePointShotsMade', 'AverageThreePointShotsAttempted',
      'AverageFreeThrowsMade', 'AverageFreeThrowsAttempted',
      'MaxPoints', 'MinPoints', 'GamesPlayed', 'GamesOver20Points',
      'GamesOver30Points', 'GamesOver40Points', 'LastUpdated'
    ];

    const groupByOptions = ['team', 'position', 'game', 'season'];
    const orderByOptions = ['AveragePoints', 'AverageRebounds', 'AverageAssists', 'GamesPlayed', 'LastUpdated'];
    const orderDirectionOptions = ['ASC', 'DESC'];

    res.status(200).json({
      success: true,
      data: {
        queryTypes,
        availableFields,
        groupByOptions,
        orderByOptions,
        orderDirectionOptions
      }
    });

  } catch (error) {
    await errorLogService.logRouteError(
      error,
      'playerStatisticsRoutes.js',
      {
        route: '/player-stats/query-types',
        method: 'GET'
      }
    );
    throw error; // Let the global error handler deal with it
  }
}));

/**
 * Get field definitions and descriptions
 * GET /api/player-stats/fields
 */
router.get("/player-stats/fields", asyncHandler(async (req, res) => {
  try {
    const fieldDefinitions = {
      'PlayerId': 'Unique identifier for the player',
      'PlayerFirstName': 'Player first name',
      'PlayerLastName': 'Player last name',
      'PlayerPosition': 'Player position (G, F, C, etc.)',
      'EnemyTeamId': 'Unique identifier for the enemy team',
      'EnemyTeamName': 'Enemy team name',
      'EnemyTeamNickName': 'Enemy team nickname/abbreviation',
      'SeasonId': 'Unique identifier for the season',
      'SeasonYear': 'Season year (e.g., 2024)',
      'AveragePoints': 'Average points per game',
      'AverageRebounds': 'Average rebounds per game',
      'AverageAssists': 'Average assists per game',
      'AverageSteals': 'Average steals per game',
      'AverageBlocks': 'Average blocks per game',
      'AverageTurnovers': 'Average turnovers per game',
      'AverageFieldGoalsMade': 'Average field goals made per game',
      'AverageFieldGoalsAttempted': 'Average field goals attempted per game',
      'AverageThreePointShotsMade': 'Average three-point shots made per game',
      'AverageThreePointShotsAttempted': 'Average three-point shots attempted per game',
      'AverageFreeThrowsMade': 'Average free throws made per game',
      'AverageFreeThrowsAttempted': 'Average free throws attempted per game',
      'MaxPoints': 'Maximum points in a single game',
      'MinPoints': 'Minimum points in a single game',
      'GamesPlayed': 'Total number of games played',
      'GamesOver20Points': 'Number of games with 20+ points',
      'GamesOver30Points': 'Number of games with 30+ points',
      'GamesOver40Points': 'Number of games with 40+ points',
      'LastUpdated': 'Last time the data was updated'
    };

    res.status(200).json({
      success: true,
      data: fieldDefinitions
    });

  } catch (error) {
    await errorLogService.logRouteError(
      error,
      'playerStatisticsRoutes.js',
      {
        route: '/player-stats/fields',
        method: 'GET'
      }
    );
    throw error; // Let the global error handler deal with it
  }
}));

module.exports = router;