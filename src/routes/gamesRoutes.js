const express = require("express");
const router = express.Router();
const gamesService = require("../services/gamesService");

router.get("/games", async (req, res) => {
  try {

    let data = await gamesService.getNextGames();


    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
