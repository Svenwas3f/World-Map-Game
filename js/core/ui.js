/**
 * UI - Manages user interface interactions and updates
 */
export class UI {
    constructor() {
        this.elements = {
            question: document.getElementById('question'),
            status: document.getElementById('status'),
            input: document.getElementById('countryInput'),
            button: document.querySelector('button'),
            mapContainer: document.getElementById('mapContainer')
        };
        this.highlightCircle = null;
        this.smallCountryThreshold = 100; // Bounding box area threshold for really small countries
    }

    /**
     * Setup input event listeners
     * @param {Function} onSubmit - Callback for form submission
     */
    setupInput(onSubmit) {
        // Enter key listener
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                onSubmit();
            }
        });

        // Button click listener
        this.elements.button.addEventListener('click', onSubmit);
    }

    /**
     * Get the current input value
     * @returns {string} Trimmed input value
     */
    getInputValue() {
        return this.elements.input.value.trim();
    }

    /**
     * Clear the input field
     */
    clearInput() {
        this.elements.input.value = '';
    }

    /**
     * Focus the input field
     */
    focusInput() {
        this.elements.input.focus();
    }

    /**
     * Update status message
     * @param {string} message - Message to display
     * @param {string} type - Message type: 'success', 'error', or 'info'
     */
    updateStatus(message, type = 'info') {
        this.elements.status.textContent = message;
        this.elements.status.className = type;
    }

    /**
     * Update the question display
     * @param {string} question - Question to display
     */
    updateQuestion(question) {
        this.elements.question.textContent = question;
    }

    /**
     * Highlight a country on the map
     * @param {string} countryCode - ISO country code
     * @returns {HTMLElement|null} The highlighted element
     */
    highlightCountry(countryCode) {
        const element = document.getElementById(countryCode.toLowerCase());
        if (element) {
            element.classList.add('target');
            
            // Add circle for small countries
            if (this.isSmallCountry(element)) {
                this.addHighlightCircle(element);
            }
        }
        return element;
    }

    /**
     * Remove highlight from a country
     * @param {HTMLElement} element - The element to unhighlight
     */
    removeHighlight(element) {
        if (element) {
            element.classList.remove('target');
        }
        this.removeHighlightCircle();
    }

    /**
     * Mark a country as guessed
     * @param {HTMLElement} element - The element to mark
     */
    markAsGuessed(element) {
        if (element) {
            element.classList.add('guessed');
        }
    }

    /**
     * Show game completion message
     */
    showCompletionMessage() {
        this.updateQuestion('HERZLICHEN GLÜCKWUNSCH! Alle Länder erraten! 🎉');
        this.updateStatus('', 'success');
        this.elements.input.style.display = 'none';
        this.elements.button.style.display = 'none';
    }

    /**
     * Show temporary message and revert after delay
     * @param {string} message - Temporary message
     * @param {string} type - Message type
     * @param {string} revertMessage - Message to revert to
     * @param {number} delay - Delay in milliseconds
     */
    showTemporaryMessage(message, type, revertMessage, delay = 1500) {
        this.updateStatus(message, type);
        setTimeout(() => {
            this.updateStatus(revertMessage, 'info');
        }, delay);
    }

    /**
     * Check if a country element is small based on bounding box
     * @param {HTMLElement} element - The country element
     * @returns {boolean} True if country is small
     */
    isSmallCountry(element) {
        try {
            const bbox = element.getBBox();
            const area = bbox.width * bbox.height;
            return area < this.smallCountryThreshold;
        } catch (e) {
            return false;
        }
    }

    /**
     * Add a highlight circle around a small country
     * @param {HTMLElement} element - The country element
     */
    addHighlightCircle(element) {
        try {
            const bbox = element.getBBox();
            const svg = element.ownerSVGElement;
            
            if (!svg) return;

            // Remove existing circle if any
            this.removeHighlightCircle();

            // Calculate circle properties
            const centerX = bbox.x + bbox.width / 2;
            const centerY = bbox.y + bbox.height / 2;
            const radius = Math.max(bbox.width, bbox.height) * 1.5;

            // Create circle element
            this.highlightCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            this.highlightCircle.setAttribute('cx', centerX);
            this.highlightCircle.setAttribute('cy', centerY);
            this.highlightCircle.setAttribute('r', radius);
            this.highlightCircle.classList.add('country-highlight-circle');

            // Add to SVG
            svg.appendChild(this.highlightCircle);
        } catch (e) {
            console.error('Failed to add highlight circle:', e);
        }
    }

    /**
     * Remove the highlight circle
     */
    removeHighlightCircle() {
        if (this.highlightCircle) {
            this.highlightCircle.remove();
            this.highlightCircle = null;
        }
    }
}
