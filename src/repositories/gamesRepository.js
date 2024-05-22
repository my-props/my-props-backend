const db = require("../config/database");

async function getNextGames() {
  const query = `
    select
        id,
        status,
        visitor_name,
        visitor_id,
        home_id,
        home_name
    from
        games
    where status != 'Finished'
    order by
        date_start desc
        limit 10
  `;

  const { rows } = await db.query(query);

  return rows;
}

module.exports.getNextGames = getNextGames;
