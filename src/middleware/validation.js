const Joi = require('joi');
const { POSITIONS } = require('../shared/constants/positions');

/**
 * Validation middleware factory
 */
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        });

        if (error) {
            const errorDetails = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));

            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                details: errorDetails,
                message: 'Please check your input and try again'
            });
        }

        // Replace the request property with validated and sanitized data
        req[property] = value;
        next();
    };
};

/**
 * Player Statistics Validation Schemas
 */
const playerStatsSchemas = {
    query: Joi.object({
        playerId: Joi.number().integer().positive().required()
            .messages({
                'number.base': 'Player ID must be a number',
                'number.integer': 'Player ID must be an integer',
                'number.positive': 'Player ID must be positive',
                'any.required': 'Player ID is required'
            }),

        queryType: Joi.string().valid(
            'vs-team',
            'vs-position',
            'vs-all-teams',
            'in-position-vs-team',
            'in-position-vs-all-teams',
            'vs-player'
        ).default('vs-all-teams')
            .messages({
                'any.only': 'Query type must be one of: vs-team, vs-position, vs-all-teams, in-position-vs-team, in-position-vs-all-teams, vs-player'
            }),

        enemyTeamId: Joi.when('queryType', {
            is: Joi.string().valid('vs-team', 'in-position-vs-team'),
            then: Joi.number().integer().positive().required(),
            otherwise: Joi.number().integer().positive().optional()
        }),

        enemyPosition: Joi.when('queryType', {
            is: 'vs-position',
            then: Joi.string().valid(...POSITIONS).required(),
            otherwise: Joi.string().optional()
        }),

        playerPosition: Joi.when('queryType', {
            is: Joi.string().valid('in-position-vs-team', 'in-position-vs-all-teams'),
            then: Joi.string().valid(...POSITIONS).required(),
            otherwise: Joi.string().optional()
        }),

        playerId2: Joi.when('queryType', {
            is: 'vs-player',
            then: Joi.number().integer().positive().required(),
            otherwise: Joi.number().integer().positive().optional()
        }),

        seasonId: Joi.number().integer().positive().optional(),

        fields: Joi.string().pattern(/^[a-zA-Z,]+$/).optional()
            .messages({
                'string.pattern.base': 'Fields must contain only letters and commas'
            }),

        groupBy: Joi.string().valid('team', 'position', 'game', 'season').optional(),

        orderBy: Joi.string().valid(
            'AveragePoints', 'AverageRebounds', 'AverageAssists',
            'GamesPlayed', 'LastUpdated'
        ).optional(),

        orderDirection: Joi.string().valid('ASC', 'DESC').optional(),

        limit: Joi.number().integer().min(1).max(1000).optional()
    })
};

/**
 * Team Statistics Validation Schemas
 */
const teamStatsSchemas = {
    query: Joi.object({
        teamId: Joi.number().integer().positive().required(),
        seasonId: Joi.number().integer().positive().optional(),
        limit: Joi.number().integer().min(1).max(1000).optional()
    })
};

/**
 * Game Statistics Validation Schemas
 */
const gameStatsSchemas = {
    query: Joi.object({
        gameId: Joi.number().integer().positive().required(),
        seasonId: Joi.number().integer().positive().optional()
    })
};

/**
 * View Management Validation Schemas
 */
const viewManagementSchemas = {
    refresh: Joi.object({
        viewName: Joi.string().valid(
            'playervsteamstats',
            'playerpositionstats',
            'playervspositionstats',
            'playervsplayerstats'
        ).optional()
    }),

    refreshSeason: Joi.object({
        seasonId: Joi.number().integer().positive().required()
    })
};

module.exports = {
    validate,
    playerStatsSchemas,
    teamStatsSchemas,
    gameStatsSchemas,
    viewManagementSchemas
};
