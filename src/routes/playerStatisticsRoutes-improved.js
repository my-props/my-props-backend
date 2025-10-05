const express = require('express');
const router = express.Router();
const playerStatisticsService = require('../services/playerStatisticsService');
const { validate, playerStatsSchemas } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const { NotFoundError, ValidationError } = require('../shared/errors/CustomError');

/**
 * @swagger
 * /api/players/statistics:
 *   get:
 *     summary: Get player statistics with flexible parameters
 *     tags: [Players]
 *     parameters:
 *       - in: query
 *         name: playerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID
 *       - in: query
 *         name: queryType
 *         schema:
 *           type: string
 *           enum: [vs-team, vs-position, vs-all-teams, in-position-vs-team, in-position-vs-all-teams, vs-player]
 *         description: Type of statistics query
 *       - in: query
 *         name: enemyTeamId
 *         schema:
 *           type: integer
 *         description: Enemy team ID (required for vs-team queries)
 *       - in: query
 *         name: seasonId
 *         schema:
 *           type: integer
 *         description: Season ID filter
 *     responses:
 *       200:
 *         description: Player statistics retrieved successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.get('/statistics',
    validate(playerStatsSchemas.query, 'query'),
    asyncHandler(async (req, res) => {
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

        // Parse fields if provided
        const fieldsArray = fields ? fields.split(',').map(f => f.trim()) : [];

        // Build query parameters
        const params = {
            playerId,
            queryType,
            fields: fieldsArray,
            groupBy,
            orderBy,
            orderDirection,
            limit
        };

        // Add optional parameters if provided
        if (enemyTeamId) params.enemyTeamId = enemyTeamId;
        if (enemyPosition) params.enemyPosition = enemyPosition;
        if (playerPosition) params.playerPosition = playerPosition;
        if (playerId2) params.playerId2 = playerId2;
        if (seasonId) params.seasonId = seasonId;

        // Get data from service
        const data = await playerStatisticsService.getPlayerStatistics(params);

        // Check if data exists
        if (!data || data.length === 0) {
            throw new NotFoundError('Player statistics');
        }

        // Return response
        res.status(200).json({
            success: true,
            data: data,
            meta: {
                queryType,
                playerId,
                totalResults: data.length,
                fields: fieldsArray.length > 0 ? fieldsArray : 'all',
                groupBy: groupBy || 'team',
                orderBy: orderBy || 'AveragePoints',
                orderDirection: orderDirection || 'DESC',
                limit: limit || 'none'
            }
        });
    })
);

/**
 * @swagger
 * /api/players/statistics/query-types:
 *   get:
 *     summary: Get available query types and parameters
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: Query types retrieved successfully
 */
router.get('/statistics/query-types', asyncHandler(async (req, res) => {
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
}));

/**
 * @swagger
 * /api/players/statistics/fields:
 *   get:
 *     summary: Get field definitions and descriptions
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: Field definitions retrieved successfully
 */
router.get('/statistics/fields', asyncHandler(async (req, res) => {
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
}));

module.exports = router;
