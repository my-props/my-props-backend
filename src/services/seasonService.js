const seasonRepository = require("../repositories/seasonRepository");
const errorLogService = require("./errorLogService");

async function getAllSeasons() {
  try {
    const seasons = await seasonRepository.getAllSeasons();
    return seasons;
  } catch (error) {
    console.error('Error in seasonService.getAllSeasons:', error);
    await errorLogService.logServiceError(error, 'seasonService.js', null, { function: 'getAllSeasons' });
    throw error;
  }
}

async function getSeasonById(id) {
  try {
    if (!id) {
      throw new Error("Season ID is required");
    }
    
    const season = await seasonRepository.getSeasonById(id);
    
    if (!season) {
      throw new Error("Season not found");
    }
    
    return season;
  } catch (error) {
    console.error('Error in seasonService.getSeasonById:', error);
    await errorLogService.logServiceError(error, 'seasonService.js', null, { function: 'getSeasonById', id });
    throw error;
  }
}

async function getCurrentSeason() {
  try {
    const season = await seasonRepository.getCurrentSeason();
    
    if (!season) {
      throw new Error("No current season found");
    }
    
    return season;
  } catch (error) {
    console.error('Error in seasonService.getCurrentSeason:', error);
    await errorLogService.logServiceError(error, 'seasonService.js', null, { function: 'getCurrentSeason' });
    throw error;
  }
}

async function getSeasonsByYear(year) {
  try {
    if (!year) {
      throw new Error("Year is required");
    }
    
    const seasons = await seasonRepository.getSeasonsByYear(year);
    return seasons;
  } catch (error) {
    console.error('Error in seasonService.getSeasonsByYear:', error);
    await errorLogService.logServiceError(error, 'seasonService.js', null, { function: 'getSeasonsByYear', year });
    throw error;
  }
}


module.exports = {
  getAllSeasons,
  getSeasonById,
  getCurrentSeason,
  getSeasonsByYear
};
