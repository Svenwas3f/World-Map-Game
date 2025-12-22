/**
 * GameState - Manages the game state and logic
 */
export class GameState {
    constructor(countryData) {
        this.countryData = countryData;
        this.guessed = new Set();
        this.currentTarget = null;
        this.currentTargetElement = null;
        this.remainingCountries = [];
    }

    /**
     * Initialize the game state
     */
    init() {
        this.remainingCountries = Object.keys(this.countryData)
            .filter(name => !this.guessed.has(this.countryData[name]));
    }

    /**
     * Update country data (e.g., when language changes)
     * @param {Object} newCountryData - New country data object
     */
    updateCountryData(newCountryData) {
        this.countryData = newCountryData;
        this.guessed.clear();
        this.currentTarget = null;
        this.currentTargetElement = null;
        this.init();
    }

    /**
     * Pick a random country from remaining countries
     * @returns {string|null} Country name or null if no countries remain
     */
    pickRandomCountry() {
        if (this.remainingCountries.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * this.remainingCountries.length);
        this.currentTarget = this.remainingCountries[randomIndex];
        return this.currentTarget;
    }

    /**
     * Check if the guess is correct
     * @param {string} guess - The user's guess
     * @returns {boolean} True if correct, false otherwise
     */
    checkGuess(guess) {
        return guess.trim().toLowerCase() === this.currentTarget.toLowerCase();
    }

    /**
     * Mark the current country as guessed
     */
    markAsGuessed() {
        const targetCode = this.countryData[this.currentTarget];
        this.guessed.add(targetCode);
        this.remainingCountries = this.remainingCountries
            .filter(name => name !== this.currentTarget);
    }

    /**
     * Get the ISO code for the current target country
     * @returns {string} ISO country code
     */
    getCurrentTargetCode() {
        return this.countryData[this.currentTarget];
    }

    /**
     * Get the number of remaining countries
     * @returns {number} Number of countries left to guess
     */
    getRemainingCount() {
        return this.remainingCountries.length;
    }

    /**
     * Check if the game is complete
     * @returns {boolean} True if all countries have been guessed
     */
    isComplete() {
        return this.remainingCountries.length === 0;
    }

    /**
     * Reset the game state
     */
    reset() {
        this.guessed.clear();
        this.currentTarget = null;
        this.currentTargetElement = null;
        this.init();
    }
}
