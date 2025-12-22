import { countryData } from './data/countries.js';
import { GameState } from './core/gameState.js';
import { UI } from './core/ui.js';
import { MapInteraction } from './utils/mapInteraction.js';
import { runValidation } from './utils/validateCountries.js';

/**
 * Game - Main game controller
 */
class Game {
    constructor() {
        this.gameState = new GameState(countryData);
        this.ui = new UI();
        this.mapInteraction = null;
        this.mapLoaded = false;
    }

    /**
     * Initialize the game
     */
    async init() {
        try {
            await this.loadMap();
            this.setupMapInteraction();
            this.setupUI();
            this.setupAccordion();
            this.startGame();
            
            // Run validation in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
                runValidation();
            }
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.ui.updateStatus('Fehler beim Laden der Karte. Bitte Seite neu laden.', 'error');
        }
    }

    /**
     * Load the SVG map
     */
    async loadMap() {
        const response = await fetch('world.svg');
        const svg = await response.text();
        document.getElementById('mapContainer').innerHTML = svg;
        this.mapLoaded = true;
    }

    /**
     * Setup map interaction (pan and zoom)
     */
    setupMapInteraction() {
        this.mapInteraction = new MapInteraction('mapContainer');
        this.mapInteraction.init();
    }

    /**
     * Setup UI event listeners
     */
    setupUI() {
        this.ui.setupInput(() => this.handleGuess());
    }

    /**
     * Start a new game
     */
    startGame() {
        this.gameState.init();
        this.nextCountry();
    }

    /**
     * Move to the next country
     */
    nextCountry() {
        // Remove previous highlight
        if (this.gameState.currentTargetElement) {
            this.ui.removeHighlight(this.gameState.currentTargetElement);
        }

        // Check if game is complete
        if (this.gameState.isComplete()) {
            this.ui.showCompletionMessage();
            return;
        }

        // Pick and highlight new country
        const country = this.gameState.pickRandomCountry();
        const countryCode = this.gameState.getCurrentTargetCode();
        this.gameState.currentTargetElement = this.ui.highlightCountry(countryCode);

        // Update UI
        const remaining = this.gameState.getRemainingCount();
        this.ui.updateStatus(`Noch ${remaining} Länder offen.`);
        this.ui.focusInput();
    }

    /**
     * Handle user's guess
     */
    handleGuess() {
        const input = this.ui.getInputValue();

        // Validate input
        if (!input) {
            this.ui.updateStatus('Bitte etwas eingeben.', 'error');
            return;
        }

        // Check guess
        if (this.gameState.checkGuess(input)) {
            this.handleCorrectGuess();
        } else {
            this.handleIncorrectGuess();
        }
    }

    /**
     * Handle correct guess
     */
    handleCorrectGuess() {
        // Mark as guessed
        this.gameState.markAsGuessed();
        this.ui.markAsGuessed(this.gameState.currentTargetElement);
        this.ui.removeHighlight(this.gameState.currentTargetElement);
        this.ui.clearInput();
        this.updateCountryList();

        // Show success message and move to next
        if (this.gameState.getRemainingCount() > 0) {
            this.ui.updateStatus('Richtig! ✓', 'success');
            setTimeout(() => this.nextCountry(), 1000);
        } else {
            this.nextCountry();
        }
    }

    /**
     * Handle incorrect guess
     */
    handleIncorrectGuess() {
        this.ui.clearInput();
        const remaining = this.gameState.getRemainingCount();
        this.ui.showTemporaryMessage(
            'Falsch! Versuche es nochmal.',
            'error',
            `Noch ${remaining} Länder offen.`
        );
    }

    /**
     * Reset the game
     */
    reset() {
        this.gameState.reset();
        this.startGame();
    }

    /**
     * Setup accordion for country list
     */
    setupAccordion() {
        const toggleButton = document.getElementById('countryListToggle');
        const content = document.getElementById('countryList');
        
        // Populate country list
        const sortedCountries = Object.keys(countryData).sort();
        const ul = document.createElement('ul');
        ul.className = 'country-list';
        
        sortedCountries.forEach(country => {
            const li = document.createElement('li');
            li.textContent = country;
            li.dataset.countryCode = countryData[country];
            ul.appendChild(li);
        });
        
        content.appendChild(ul);
        
        // Update button text with country count
        toggleButton.innerHTML = `Alle Ländernamen anzeigen (${sortedCountries.length}) <span class="accordion-icon">▼</span>`;
        
        // Toggle accordion
        toggleButton.addEventListener('click', () => {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            toggleButton.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('active');
        });
    }

    /**
     * Update country list to mark guessed countries
     */
    updateCountryList() {
        const countryListItems = document.querySelectorAll('.country-list li');
        countryListItems.forEach(li => {
            const countryCode = li.dataset.countryCode;
            if (this.gameState.guessed.has(countryCode)) {
                li.classList.add('guessed-country');
            } else {
                li.classList.remove('guessed-country');
            }
        });
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
