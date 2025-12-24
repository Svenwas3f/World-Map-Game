/**
 * Home Screen - Map Selection
 */

async function loadMaps() {
    try {
        const response = await fetch('maps/maps.json');
        const maps = await response.json();
        
        const grid = document.getElementById('mapGrid');
        grid.innerHTML = '';
        
        // Load all map cards
        for (const map of maps) {
            const card = await createMapCard(map);
            grid.appendChild(card);
        }
    } catch (error) {
        console.error('Failed to load maps:', error);
        document.getElementById('mapGrid').innerHTML = '<p style="color: #666; text-align: center;">Fehler beim Laden der Karten.</p>';
    }
}

async function createMapCard(map) {
    const card = document.createElement('a');
    card.className = 'map-card';
    card.href = `game.html?map=${map.id}`;
    
    // Load SVG and convert to background image
    let previewHtml = '';
    try {
        const svgResponse = await fetch(`maps/${map.file}`);
        const svgText = await svgResponse.text();
        
        // Create a modified SVG with green colors
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        
        // Apply green styling to all paths and circles
        svgElement.querySelectorAll('path, circle').forEach(element => {
            element.setAttribute('fill', '#4CAF50');
            element.setAttribute('stroke', '#2E7D32');
            element.setAttribute('stroke-width', '0.5');
        });
        
        // Convert to data URL for background image
        const serializer = new XMLSerializer();
        const styledSvg = serializer.serializeToString(svgElement);
        const encodedSvg = encodeURIComponent(styledSvg)
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');
        const dataUrl = `data:image/svg+xml,${encodedSvg}`;
        
        previewHtml = `<div class="map-card-preview" style="background-image: url('${dataUrl}');"></div>`;
    } catch (error) {
        console.error(`Failed to load preview for ${map.id}:`, error);
        previewHtml = '<div class="map-card-preview" style="background: #e0e0e0;"></div>';
    }
    
    card.innerHTML = `
        ${previewHtml}
        <div class="map-card-content">
            <h2>${map.name}</h2>
            <p class="description">${map.description}</p>
            <div class="stat">
                <span class="stat-label">Länder:</span>
                <span class="stat-value">${map.countryCount}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Load maps when page loads
document.addEventListener('DOMContentLoaded', loadMaps);
