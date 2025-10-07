/**
 * Basketball Position Constants
 * Valid position values used throughout the application
 */
const POSITIONS = [
    'C',      // Center
    'C-F',    // Center-Forward
    'F',      // Forward
    'F-C',    // Forward-Center
    'F-G',    // Forward-Guard
    'G',      // Guard
    'G-F',    // Guard-Forward
    'NA',     // Not Available/Unknown
    'PF',     // Power Forward
    'SF',     // Small Forward
    'SG'      // Shooting Guard
];

/**
 * Position validation helper
 * @param {string} position - Position to validate
 * @returns {boolean} - True if valid position
 */
const isValidPosition = (position) => {
    return POSITIONS.includes(position);
};

/**
 * Get all valid positions
 * @returns {string[]} - Array of valid positions
 */
const getAllPositions = () => {
    return [...POSITIONS];
};

/**
 * Get position display name
 * @param {string} position - Position code
 * @returns {string} - Human readable position name
 */
const getPositionDisplayName = (position) => {
    const displayNames = {
        'C': 'Center',
        'C-F': 'Center-Forward',
        'F': 'Forward',
        'F-C': 'Forward-Center',
        'F-G': 'Forward-Guard',
        'G': 'Guard',
        'G-F': 'Guard-Forward',
        'NA': 'Not Available',
        'PF': 'Power Forward',
        'SF': 'Small Forward',
        'SG': 'Shooting Guard'
    };

    return displayNames[position] || position;
};

module.exports = {
    POSITIONS,
    isValidPosition,
    getAllPositions,
    getPositionDisplayName
};
