const express = require('express');
const router = express.Router();
const playerStatisticsService = require('../services/playerStatisticsService');
const errorLogService = require('../services/errorLogService');
const { asyncHandler } = require('../middleware/errorHandler');
const { ValidationError } = require('../shared/errors/CustomError');

/**
 * @swagger
 * /api/teams/{teamId1}/vs/{teamId2}/players:
 *   get:
 *     summary: Get all players from both teams with their statistics against each other
 *     tags: [Teams, Players]
 *     parameters:
 *       - in: path
 *         name: teamId1
 *         required: true
 *         schema:
 *           type: integer
 *         description: First team ID (e.g., Lakers)
 *       - in: path
 *         name: teamId2
 *         required: true
 *         schema:
 *           type: integer
 *         description: Second team ID (e.g., Warriors)
 *       - in: query
 *         name: seasonId
 *         schema:
 *           type: integer
 *         description: Season ID filter
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *           enum: [PG, SG, SF, PF, C]
 *         description: Position filter
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Field to order by (default: AveragePoints)
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Order direction (default: DESC)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *     responses:
 *       200:
 *         description: Team vs team player statistics retrieved successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.get('/:teamId1/vs/:teamId2/players', asyncHandler(async (req, res) => {
    try {
        const { teamId1, teamId2 } = req.params;
        const {
            seasonId,
            position,
            orderBy,
            orderDirection,
            limit
        } = req.query;

        // Validate required parameters
        if (!teamId1 || !teamId2) {
            throw new ValidationError('Both team IDs are required');
        }

        // Build filters object
        const filters = {};
        if (seasonId) filters.seasonId = parseInt(seasonId);
        if (position) filters.position = position;
        if (orderBy) filters.orderBy = orderBy;
        if (orderDirection) filters.orderDirection = orderDirection;
        if (limit) filters.limit = parseInt(limit);

        // Get data from service
        const data = await playerStatisticsService.getTeamVsTeamPlayerStatistics(
            parseInt(teamId1),
            parseInt(teamId2),
            filters
        );

        // Separate players by team for better organization
        const team1Players = data.filter(player => player.TeamId === parseInt(teamId1));
        const team2Players = data.filter(player => player.TeamId === parseInt(teamId2));

        // Return response
        res.status(200).json({
            success: true,
            data: {
                team1: {
                    teamId: parseInt(teamId1),
                    teamName: team1Players.length > 0 ? team1Players[0].TeamName : 'Unknown',
                    teamNickName: team1Players.length > 0 ? team1Players[0].TeamNickName : 'Unknown',
                    players: team1Players
                },
                team2: {
                    teamId: parseInt(teamId2),
                    teamName: team2Players.length > 0 ? team2Players[0].TeamName : 'Unknown',
                    teamNickName: team2Players.length > 0 ? team2Players[0].TeamNickName : 'Unknown',
                    players: team2Players
                },
                totalPlayers: data.length,
                filters: filters
            }
        });

    } catch (error) {
        await errorLogService.logRouteError(error, 'teamVsTeamPlayerRoutes.js', {
            route: '/:teamId1/vs/:teamId2/players',
            method: 'GET',
            params: req.params,
            query: req.query
        });
        throw error;
    }
}));

/**
 * @swagger
 * /api/teams/{teamId1}/vs/{teamId2}/players/summary:
 *   get:
 *     summary: Get team vs team player statistics summary
 *     tags: [Teams, Players]
 *     parameters:
 *       - in: path
 *         name: teamId1
 *         required: true
 *         schema:
 *           type: integer
 *         description: First team ID
 *       - in: path
 *         name: teamId2
 *         required: true
 *         schema:
 *           type: integer
 *         description: Second team ID
 *       - in: query
 *         name: seasonId
 *         schema:
 *           type: integer
 *         description: Season ID filter
 *     responses:
 *       200:
 *         description: Team vs team summary retrieved successfully
 */
router.get('/:teamId1/vs/:teamId2/players/summary', asyncHandler(async (req, res) => {
    try {
        const { teamId1, teamId2 } = req.params;
        const { seasonId } = req.query;

        // Validate required parameters
        if (!teamId1 || !teamId2) {
            throw new ValidationError('Both team IDs are required');
        }

        // Build filters object
        const filters = {};
        if (seasonId) filters.seasonId = parseInt(seasonId);

        // Get data from service
        const data = await playerStatisticsService.getTeamVsTeamPlayerStatistics(
            parseInt(teamId1),
            parseInt(teamId2),
            filters
        );

        // Calculate summary statistics
        const team1Players = data.filter(player => player.TeamId === parseInt(teamId1));
        const team2Players = data.filter(player => player.TeamId === parseInt(teamId2));

        const calculateTeamSummary = (players) => {
            if (players.length === 0) return null;

            return {
                totalPlayers: players.length,
                averagePoints: players.reduce((sum, p) => sum + p.AveragePoints, 0) / players.length,
                averageRebounds: players.reduce((sum, p) => sum + p.AverageRebounds, 0) / players.length,
                averageAssists: players.reduce((sum, p) => sum + p.AverageRebounds, 0) / players.length,
                totalGamesPlayed: players.reduce((sum, p) => sum + p.GamesPlayed, 0),
                topScorer: players.reduce((top, p) => p.AveragePoints > top.AveragePoints ? p : top, players[0]),
                topRebounder: players.reduce((top, p) => p.AverageRebounds > top.AverageRebounds ? p : top, players[0]),
                topAssistMan: players.reduce((top, p) => p.AverageAssists > top.AverageAssists ? p : top, players[0])
            };
        };

        // Return response
        res.status(200).json({
            success: true,
            data: {
                team1: calculateTeamSummary(team1Players),
                team2: calculateTeamSummary(team2Players),
                totalPlayers: data.length,
                filters: filters
            }
        });

    } catch (error) {
        await errorLogService.logRouteError(error, 'teamVsTeamPlayerRoutes.js', {
            route: '/:teamId1/vs/:teamId2/players/summary',
            method: 'GET',
            params: req.params,
            query: req.query
        });
        throw error;
    }
}));

/**
 * @swagger
 * /api/teams/{teamId}/vs-all/players:
 *   get:
 *     summary: Get all players from a team with their aggregated statistics against all teams
 *     tags: [Teams, Players]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team ID
 *       - in: query
 *         name: seasonId
 *         schema:
 *           type: integer
 *         description: Season ID filter
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *           enum: [PG, SG, SF, PF, C]
 *         description: Position filter
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Field to order by (default: AveragePoints)
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Order direction (default: DESC)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *     responses:
 *       200:
 *         description: Team vs all teams player statistics retrieved successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.get('/:teamId/vs-all/players', asyncHandler(async (req, res) => {
    try {
        const { teamId } = req.params;
        const {
            seasonId,
            position,
            orderBy,
            orderDirection,
            limit
        } = req.query;

        // Validate required parameters
        if (!teamId) {
            throw new ValidationError('Team ID is required');
        }

        // Build filters object
        const filters = {};
        if (seasonId) filters.seasonId = parseInt(seasonId);
        if (position) filters.position = position;
        if (orderBy) filters.orderBy = orderBy;
        if (orderDirection) filters.orderDirection = orderDirection;
        if (limit) filters.limit = parseInt(limit);

        // Get data from service
        const data = await playerStatisticsService.getTeamVsAllTeamsPlayerStatistics(
            parseInt(teamId),
            filters
        );

        // Get team info from first player record
        const teamName = data.length > 0 ? data[0].TeamName : 'Unknown';
        const teamNickName = data.length > 0 ? data[0].TeamNickName : 'Unknown';

        // Return response
        res.status(200).json({
            success: true,
            data: {
                teamId: parseInt(teamId),
                teamName: teamName,
                teamNickName: teamNickName,
                players: data,
                totalPlayers: data.length,
                filters: filters
            }
        });

    } catch (error) {
        await errorLogService.logRouteError(error, 'teamVsTeamPlayerRoutes.js', {
            route: '/:teamId/vs-all/players',
            method: 'GET',
            params: req.params,
            query: req.query
        });
        throw error;
    }
}));

/**
 * @swagger
 * /api/teams/{teamId1}/and/{teamId2}/vs-all/players:
 *   get:
 *     summary: Get both teams' players with their aggregated statistics against all teams
 *     tags: [Teams, Players]
 *     parameters:
 *       - in: path
 *         name: teamId1
 *         required: true
 *         schema:
 *           type: integer
 *         description: First team ID
 *       - in: path
 *         name: teamId2
 *         required: true
 *         schema:
 *           type: integer
 *         description: Second team ID
 *       - in: query
 *         name: seasonId
 *         schema:
 *           type: integer
 *         description: Season ID filter
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *           enum: [PG, SG, SF, PF, C]
 *         description: Position filter
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Field to order by (default: AveragePoints)
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Order direction (default: DESC)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *     responses:
 *       200:
 *         description: Both teams vs all teams player statistics retrieved successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.get('/:teamId1/and/:teamId2/vs-all/players', asyncHandler(async (req, res) => {
    try {
        const { teamId1, teamId2 } = req.params;
        const {
            seasonId,
            position,
            orderBy,
            orderDirection,
            limit
        } = req.query;

        // Validate required parameters
        if (!teamId1 || !teamId2) {
            throw new ValidationError('Both team IDs are required');
        }

        // Build filters object
        const filters = {};
        if (seasonId) filters.seasonId = parseInt(seasonId);
        if (position) filters.position = position;
        if (orderBy) filters.orderBy = orderBy;
        if (orderDirection) filters.orderDirection = orderDirection;
        if (limit) filters.limit = parseInt(limit);

        // Get data for both teams in parallel
        const [team1Data, team2Data] = await Promise.all([
            playerStatisticsService.getTeamVsAllTeamsPlayerStatistics(
                parseInt(teamId1),
                filters
            ),
            playerStatisticsService.getTeamVsAllTeamsPlayerStatistics(
                parseInt(teamId2),
                filters
            )
        ]);

        // Get team info from first player record
        const team1Name = team1Data.length > 0 ? team1Data[0].TeamName : 'Unknown';
        const team1NickName = team1Data.length > 0 ? team1Data[0].TeamNickName : 'Unknown';
        const team2Name = team2Data.length > 0 ? team2Data[0].TeamName : 'Unknown';
        const team2NickName = team2Data.length > 0 ? team2Data[0].TeamNickName : 'Unknown';

        // Return response
        res.status(200).json({
            success: true,
            data: {
                team1: {
                    teamId: parseInt(teamId1),
                    teamName: team1Name,
                    teamNickName: team1NickName,
                    players: team1Data,
                    totalPlayers: team1Data.length
                },
                team2: {
                    teamId: parseInt(teamId2),
                    teamName: team2Name,
                    teamNickName: team2NickName,
                    players: team2Data,
                    totalPlayers: team2Data.length
                },
                totalPlayers: team1Data.length + team2Data.length,
                filters: filters
            }
        });

    } catch (error) {
        await errorLogService.logRouteError(error, 'teamVsTeamPlayerRoutes.js', {
            route: '/:teamId1/and/:teamId2/vs-all/players',
            method: 'GET',
            params: req.params,
            query: req.query
        });
        throw error;
    }
}));

module.exports = router;
