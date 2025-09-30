const { getPool } = require("../config/database");

async function getPlayerVsTeamStatistics(playerId, teamId) {
    const query = `
  WITH relevant_games AS (
    SELECT *
    FROM games
    WHERE (
        (home_id = (SELECT team_id FROM players WHERE id = @playerId) AND visitor_id = @teamId) OR
        (home_id = @teamId AND visitor_id = (SELECT team_id FROM players WHERE id = @playerId))
    )
    AND date_start >= '2023-10-24' AND date_start <= GETDATE()
),
player_team_id AS (
    SELECT team_id
    FROM players
    WHERE id = @playerId
)

SELECT ROUND(AVG(CAST(points AS FLOAT)), 2) AS avg_10_points,
        ROUND(AVG(CAST(field_goal_made AS FLOAT)), 2) AS avg_10_field_goal_made,
        ROUND(AVG(CAST(field_goal_attempt AS FLOAT)), 2) AS avg_10_field_goal_attempt,
        ROUND(AVG(CAST(three_points_made AS FLOAT)), 2) AS avg_10_three_points_made,
        ROUND(AVG(CAST(three_points_attempt AS FLOAT)), 2) AS avg_10_three_points_attempt,
        ROUND(AVG(CAST(offensive_rebound AS FLOAT)), 2) AS avg_10_offensive_rebound,
        ROUND(AVG(CAST(defensive_rebound AS FLOAT)), 2) AS avg_10_defensive_rebound,
        ROUND(AVG(CAST(total_rebound AS FLOAT)), 2) AS avg_10_total_rebound,
        ROUND(AVG(CAST(assists AS FLOAT)), 2) AS avg_10_assists,
        ROUND(AVG(CAST(personal_fouls AS FLOAT)), 2) AS avg_10_personal_fouls,
        ROUND(AVG(CAST(steals AS FLOAT)), 2) AS avg_10_steals,
        ROUND(AVG(CAST(turnovers AS FLOAT)), 2) AS avg_10_turnovers,
        ROUND(AVG(CAST(blocks AS FLOAT)), 2) AS avg_10_blocks
FROM 
    player_statistics ps
JOIN 
    relevant_games rg ON ps.game_id = rg.id
JOIN
    player_team_id pti ON ps.team_id = pti.team_id
WHERE 
    ps.player_id = @playerId
    GROUP BY ps.player_id;
  `;

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('playerId', playerId);
        request.input('teamId', teamId);

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error getting player vs team statistics:', error);
        throw error;
    }
}

module.exports.getPlayerVsTeamStatistics = getPlayerVsTeamStatistics;
