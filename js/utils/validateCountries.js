/**
 * Country Validation Utility
 * Checks which countries from the JSON data exist in the SVG map
 */

import { countryData } from '../data/countries.js';

export class CountryValidator {
    constructor() {
        this.countryData = countryData;
        this.validationResults = {
            total: 0,
            found: 0,
            missing: 0,
            missingCountries: []
        };
    }

    /**
     * Validate all countries against the SVG map
     * @returns {Object} Validation results
     */
    validate() {
        const svg = document.querySelector('#mapContainer svg');
        if (!svg) {
            console.error('SVG map not found');
            return null;
        }

        this.validationResults.total = Object.keys(this.countryData).length;

        Object.entries(this.countryData).forEach(([countryName, countryCode]) => {
            const element = document.getElementById(countryCode.toUpperCase());
            
            if (element) {
                this.validationResults.found++;
            } else {
                this.validationResults.missing++;
                this.validationResults.missingCountries.push({
                    name: countryName,
                    code: countryCode
                });
            }
        });

        return this.validationResults;
    }

    /**
     * Print validation results to console
     */
    printResults() {
        const results = this.validationResults;
        
        console.log('=== Country Validation Results ===');
        console.log(`Total countries in JSON: ${results.total}`);
        console.log(`Found in SVG: ${results.found} (${(results.found / results.total * 100).toFixed(1)}%)`);
        console.log(`Missing from SVG: ${results.missing}`);
        
        if (results.missing > 0) {
            console.log('\nMissing countries:');
            console.table(results.missingCountries);
        } else {
            console.log('✓ All countries are available in the SVG map!');
        }
    }

    /**
     * Get list of available country codes in the SVG
     * @returns {Array} Array of country codes found in SVG
     */
    getAvailableSvgCountries() {
        const svg = document.querySelector('#mapContainer svg');
        if (!svg) return [];

        const paths = svg.querySelectorAll('path[id]');
        return Array.from(paths).map(path => path.id.toUpperCase());
    }

    /**
     * Print all SVG country codes for reference
     */
    printSvgCountries() {
        const codes = this.getAvailableSvgCountries();
        console.log('=== Available SVG Country Codes ===');
        console.log(`Total paths with IDs: ${codes.length}`);
        console.log(codes.sort().join(', '));
    }
}

// Auto-run validation when imported in dev mode
export function runValidation() {
    // Wait for map to load
    setTimeout(() => {
        const validator = new CountryValidator();
        validator.validate();
        validator.printResults();
        
        // Uncomment to see all SVG codes:
        // validator.printSvgCountries();
    }, 2000);
}
