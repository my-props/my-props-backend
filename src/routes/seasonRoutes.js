const express = require("express");
const router = express.Router();
const seasonService = require("../services/seasonService");

// GET all seasons
router.get("/seasons", async (req, res) => {
  try {
    const data = await seasonService.getAllSeasons();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET season by ID
router.get("/seasons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await seasonService.getSeasonById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET current season
router.get("/seasons/current", async (req, res) => {
  try {
    const data = await seasonService.getCurrentSeason();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET seasons by year
router.get("/seasons/year/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const data = await seasonService.getSeasonsByYear(year);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
