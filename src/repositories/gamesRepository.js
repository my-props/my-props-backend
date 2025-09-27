const db = require("../config/database");

async function getNextGames() {
  const query = `
    select * from Game
  `;

  const { rows } = await db.query(query);

  return rows;
}

module.exports.getNextGames = getNextGames;
