const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/matchup-statistics/:teamId1/:teamId2', async (req, res) => {
  const teamId1 = parseInt(req.params.teamId1);
  const teamId2 = parseInt(req.params.teamId2);

  if (!teamId1 || !teamId2) {
    return res.status(400).json({ error: 'Invalid team IDs provided' });
  }

  const query = `
  WITH relevant_games AS (
    SELECT
        game_id,
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
    COUNT(DISTINCT rg.game_id) AS num_games,
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
    relevant_games rg ON ps.game_id = rg.game_id
JOIN
    games g ON g.game_id = rg.game_id
WHERE
    ps.team_id IN ($2, $1)
GROUP BY
    ps.team_id
  `;

  try {
    const { rows } = await db.query(query, [teamId1, teamId2]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No matchup data found for the provided team IDs' });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error querying matchup statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
