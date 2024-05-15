const db = require("../config/database");

async function getTeamStatistics(teamId1, teamId2) {
  const query = `
    WITH relevant_games AS (
      SELECT
          id,
          home_id,
          visitor_id,
          home_total_points,
          visitor_total_points
      FROM
          games
      WHERE
          (home_id = $1 AND visitor_id = $2) OR (home_id = $2 AND visitor_id = $1)
      ORDER BY
          date_start DESC
    )
    SELECT
      ps.team_id,
      COUNT(DISTINCT rg.id) AS num_games,
      AVG(CASE
          WHEN g.home_id = ps.team_id THEN g.home_total_points
          ELSE g.visitor_total_points
      END) AS avg_team_points,
      ROUND(AVG(ps.points), 2) AS avg_points,
      ROUND(AVG(ps.field_goal_made), 2) AS avg_field_goal_made,
      ROUND(AVG(ps.field_goal_attempt), 2) AS avg_field_goal_attempt,
      ROUND(AVG(ps.three_points_made), 2) AS avg_three_points_made,
      ROUND(AVG(ps.three_points_attempt), 2) AS avg_three_points_attempt,
      ROUND(AVG(ps.offensive_rebound), 2) AS avg_offensive_rebound,
      ROUND(AVG(ps.defensive_rebound), 2) AS avg_defensive_rebound,
      ROUND(AVG(ps.total_rebound), 2) AS avg_total_rebound,
      ROUND(AVG(ps.assists), 2) AS avg_assists,
      ROUND(AVG(ps.personal_fouls), 2) AS avg_personal_fouls,
      ROUND(AVG(ps.steals), 2) AS avg_steals,
      ROUND(AVG(ps.turnovers), 2) AS avg_turnovers,
      ROUND(AVG(ps.blocks), 2) AS avg_blocks
    FROM
      player_statistics ps
    JOIN
      relevant_games rg ON ps.game_id = rg.id
    JOIN
      games g ON g.id = rg.id
    WHERE
      ps.team_id IN ($2, $1)
    GROUP BY
      ps.team_id
    `;
  const { rows } = await db.query(query, [teamId1, teamId2]);

  return rows;
}

module.exports.getTeamStatistics = getTeamStatistics;
