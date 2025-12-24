/**
 * MapInteraction - Handles pan and zoom functionality for the SVG map
 */
export class MapInteraction {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.svgElement = null;
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;

        // Zoom limits
        this.minZoom = 0.1;
        this.maxZoom = 5;
        this.zoomStep = 0.1;
    }

    /**
     * Initialize pan and zoom event listeners
     */
    init() {
        this.svgElement = this.container.querySelector('svg');
        if (!this.svgElement) {
            console.error('SVG element not found in container');
            return;
        }

        this.fitMapToContainer();
        this.setupZoom();
        this.setupPan();
        this.setupReset();
    }

    /**
     * Fit the map to the container based on aspect ratio
     */
    fitMapToContainer() {
        if (!this.svgElement) return;

        // Reset to default state - CSS will handle the contain behavior
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    /**
     * Setup mouse wheel zoom functionality
     */
    setupZoom() {
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? (1 - this.zoomStep) : (1 + this.zoomStep);
            this.scale *= delta;
            this.scale = Math.min(Math.max(this.minZoom, this.scale), this.maxZoom);
            this.updateTransform();
        }, { passive: false });
    }

    /**
     * Setup drag to pan functionality
     */
    setupPan() {
        this.container.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX - this.translateX;
            this.startY = e.clientY - this.translateY;
        });

        this.container.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.translateX = e.clientX - this.startX;
            this.translateY = e.clientY - this.startY;
            this.constrainPan();
            this.updateTransform();
        });

        this.container.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });
    }

    /**
     * Constrain panning to keep map visible
     */
    constrainPan() {
        if (!this.svgElement) return;

        const containerRect = this.container.getBoundingClientRect();
        const viewBox = this.svgElement.viewBox.baseVal;
        
        // Calculate the actual rendered size of the SVG at current scale
        const renderedWidth = viewBox.width * this.scale;
        const renderedHeight = viewBox.height * this.scale;

        // Allow panning but ensure at least some portion remains visible
        // When zoomed in, allow more freedom to explore all parts
        const minVisibleRatio = Math.min(0.3, 1 / this.scale); // Less constraint when zoomed in
        
        const maxTranslateX = renderedWidth * (1 - minVisibleRatio);
        const minTranslateX = containerRect.width - renderedWidth * minVisibleRatio;
        const maxTranslateY = renderedHeight * (1 - minVisibleRatio);
        const minTranslateY = containerRect.height - renderedHeight * minVisibleRatio;

        this.translateX = Math.max(minTranslateX, Math.min(maxTranslateX, this.translateX));
        this.translateY = Math.max(minTranslateY, Math.min(maxTranslateY, this.translateY));
    }    /**
     * Setup double-click to reset view
     */
    setupReset() {
        this.container.addEventListener('dblclick', () => {
            this.reset();
        });
    }

    /**
     * Update SVG transform based on current scale and translation
     */
    updateTransform() {
        if (!this.svgElement) return;
        this.svgElement.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        this.svgElement.style.transformOrigin = 'top left';
    }

    /**
     * Reset view to default state
     */
    reset() {
        this.fitMapToContainer();
    }

    /**
     * Center and zoom on a specific country element
     * @param {HTMLElement} element - The country element to center on
     */
    centerOnCountry(element) {
        if (!element || !this.svgElement) return;

        try {
            const bbox = element.getBBox();
            const containerRect = this.container.getBoundingClientRect();
            const svgViewBox = this.svgElement.viewBox.baseVal;
            
            // Get SVG dimensions
            const svgWidth = svgViewBox.width || 2000;
            const svgHeight = svgViewBox.height || 1000;
            
            // Calculate center of the country in SVG coordinates
            const countryCenterX = bbox.x + bbox.width / 2;
            const countryCenterY = bbox.y + bbox.height / 2;

            // Set appropriate zoom level based on country size
            const countrySize = Math.max(bbox.width, bbox.height);
            if (countrySize < 5) {
                this.scale = 6; // Very small countries
            } else if (countrySize < 15) {
                this.scale = 3.5; // Small countries
            } else if (countrySize < 50) {
                this.scale = 2; // Medium countries
            } else {
                this.scale = 1.5; // Large countries
            }

            // Calculate the current scale factor of the SVG relative to container
            const currentSvgWidth = this.svgElement.getBoundingClientRect().width / this.scale;
            const scaleRatio = currentSvgWidth / svgWidth;

            // Calculate where the country center should be in screen coordinates
            const countryScreenX = countryCenterX * scaleRatio;
            const countryScreenY = countryCenterY * scaleRatio;

            // Calculate translation needed to center it
            this.translateX = (containerRect.width / 2) - (countryScreenX * this.scale);
            this.translateY = (containerRect.height / 2) - (countryScreenY * this.scale);

            this.updateTransform();
        } catch (e) {
            console.error('Failed to center on country:', e);
        }
    }
}
