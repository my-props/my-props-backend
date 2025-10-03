const express = require("express");
const router = express.Router();
const gamesService = require("../services/gamesService");
const errorLogService = require("../services/errorLogService");

router.get("/games", async (req, res) => {
  try {

    let data = await gamesService.getNextGames();


    res.status(200).json(data);
  } catch (error) {
    await errorLogService.logRouteError(error, 'gamesRoutes.js', { route: '/games', method: 'GET' });
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
