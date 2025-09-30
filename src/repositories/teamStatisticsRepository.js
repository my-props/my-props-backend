const { getPool } = require("../config/database");

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
          (home_id = @teamId1 AND visitor_id = @teamId2) OR (home_id = @teamId2 AND visitor_id = @teamId1)
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
      ROUND(AVG(CAST(ps.points AS FLOAT)), 2) AS avg_points,
      ROUND(AVG(CAST(ps.field_goal_made AS FLOAT)), 2) AS avg_field_goal_made,
      ROUND(AVG(CAST(ps.field_goal_attempt AS FLOAT)), 2) AS avg_field_goal_attempt,
      ROUND(AVG(CAST(ps.three_points_made AS FLOAT)), 2) AS avg_three_points_made,
      ROUND(AVG(CAST(ps.three_points_attempt AS FLOAT)), 2) AS avg_three_points_attempt,
      ROUND(AVG(CAST(ps.offensive_rebound AS FLOAT)), 2) AS avg_offensive_rebound,
      ROUND(AVG(CAST(ps.defensive_rebound AS FLOAT)), 2) AS avg_defensive_rebound,
      ROUND(AVG(CAST(ps.total_rebound AS FLOAT)), 2) AS avg_total_rebound,
      ROUND(AVG(CAST(ps.assists AS FLOAT)), 2) AS avg_assists,
      ROUND(AVG(CAST(ps.personal_fouls AS FLOAT)), 2) AS avg_personal_fouls,
      ROUND(AVG(CAST(ps.steals AS FLOAT)), 2) AS avg_steals,
      ROUND(AVG(CAST(ps.turnovers AS FLOAT)), 2) AS avg_turnovers,
      ROUND(AVG(CAST(ps.blocks AS FLOAT)), 2) AS avg_blocks
    FROM
      player_statistics ps
    JOIN
      relevant_games rg ON ps.game_id = rg.id
    JOIN
      games g ON g.id = rg.id
    WHERE
      ps.team_id IN (@teamId2, @teamId1)
    GROUP BY
      ps.team_id
    `;

  try {
    const pool = await getPool();
    const request = pool.request();
    request.input('teamId1', teamId1);
    request.input('teamId2', teamId2);

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting team statistics:', error);
    throw error;
  }
}

module.exports.getTeamStatistics = getTeamStatistics;
