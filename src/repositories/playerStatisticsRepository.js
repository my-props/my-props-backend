const db = require("../config/database");

async function getPlayerVsTeamStatistics(playerId, teamId) {
  const query = `
  WITH relevant_games AS (
    SELECT *
    FROM games
    WHERE (
        (home_id = (SELECT team_id FROM players WHERE id = $1) AND visitor_id = $2) OR
        (home_id = $2 AND visitor_id = (SELECT team_id FROM players WHERE id = $1))
    )
    AND date_start >= '2023-10-24'::date AND date_start <= CURRENT_DATE
),
player_team_id AS (
    SELECT team_id
    FROM players
    WHERE id = $1
)

SELECT ROUND(AVG(points), 2) AS avg_10_points,
        ROUND(AVG(field_goal_made), 2) AS avg_10_field_goal_made,
        ROUND(AVG(field_goal_attempt), 2) AS avg_10_field_goal_attempt,
        ROUND(AVG(three_points_made), 2) AS avg_10_three_points_made,
        ROUND(AVG(three_points_attempt), 2) AS avg_10_three_points_attempt,
        ROUND(AVG(offensive_rebound), 2) AS avg_10_offensive_rebound,
        ROUND(AVG(defensive_rebound), 2) AS avg_10_defensive_rebound,
        ROUND(AVG(total_rebound), 2) AS avg_10_total_rebound,
        ROUND(AVG(assists), 2) AS avg_10_assists,
        ROUND(AVG(personal_fouls), 2) AS avg_10_personal_fouls,
        ROUND(AVG(steals), 2) AS avg_10_steals,
        ROUND(AVG(turnovers), 2) AS avg_10_turnovers,
        ROUND(AVG(blocks), 2) AS avg_10_blocks
FROM 
    player_statistics ps
JOIN 
    relevant_games rg ON ps.game_id = rg.id
JOIN
    player_team_id pti ON ps.team_id = pti.team_id
WHERE 
    ps.player_id = $1
    group by ps.player_id;
  `;

  const { rows } = await db.query(query, [playerId, teamId]);

  return rows;
}

module.exports.getPlayerVsTeamStatistics = getPlayerVsTeamStatistics;
