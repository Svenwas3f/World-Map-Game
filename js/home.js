/**
 * Home Screen - Map Selection
 */

async function loadMaps() {
    try {
        const response = await fetch('maps/maps.json');
        const maps = await response.json();
        
        const grid = document.getElementById('mapGrid');
        grid.innerHTML = '';
        
        maps.forEach(map => {
            const card = createMapCard(map);
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load maps:', error);
        document.getElementById('mapGrid').innerHTML = '<p style="color: white; text-align: center;">Fehler beim Laden der Karten.</p>';
    }
}

function createMapCard(map) {
    const card = document.createElement('a');
    card.className = 'map-card';
    card.href = `game.html?map=${map.id}`;
    
    card.innerHTML = `
        <h2>${map.name}</h2>
        <p class="description">${map.description}</p>
        <div class="stats">
            <div class="stat">
                <span class="stat-label">Länder</span>
                <span class="stat-value">${map.countryCount}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Schwierigkeit</span>
                <span class="difficulty ${map.difficulty}">${map.difficulty}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Load maps when page loads
document.addEventListener('DOMContentLoaded', loadMaps);
