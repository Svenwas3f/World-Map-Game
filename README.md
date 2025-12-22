# Weltkarte Länderspiel

Ein interaktives Lernspiel zum Lernen der Ländernamen und deren Positionen auf der Weltkarte.

## Features

- 🗺️ Alle 196 Länder der Welt mit vollständiger Kartendarstellung
- 🔍 Zoom- und Pan-Funktionalität mit Begrenzungen (1x-5x Zoom)
- 🎯 Automatische Kreismarkierungen für kleine Länder und Inselstaaten
- 🎨 Farbige Hervorhebung: Orange für aktuelle Auswahl, Grün mit dunklerem Rand für geratene Länder
- ⌨️ Tastatur-Navigation mit Enter-Taste
- 📝 Groß-/Kleinschreibung wird ignoriert bei der Eingabe
- 📋 Alphabetische Länderliste zum Nachschlagen
- 🚫 Pan-Beschränkungen: Mindestens 50% der Karte bleibt sichtbar

## Projektstruktur

```
world-map-game/
├── index.html              # Haupt-HTML-Datei
├── world.svg              # SVG-Weltkarte mit allen 196 Ländern
├── css/
│   └── styles.css         # Alle Styles inkl. Karten-Highlighting
├── js/
│   ├── game.js            # Haupt-Game-Controller
│   ├── core/
│   │   ├── gameState.js   # Game-State-Management
│   │   └── ui.js          # UI-Komponenten & Highlighting
│   ├── data/
│   │   └── countries.js   # 196 Länder: Deutsche Namen → ISO-Codes
│   └── utils/
│       ├── mapInteraction.js  # Zoom/Pan mit Constraints
│       └── validateCountries.js  # Entwicklungs-Validierung
└── README.md              # Diese Datei
```

## Verwendung

1. Öffne `index.html` in einem modernen Browser oder starte einen lokalen Server
2. Ein zufälliges Land wird orange markiert und hervorgehoben
3. Kleine Länder erhalten zusätzlich einen roten Kreis zur besseren Sichtbarkeit
4. Gib den deutschen Namen des markierten Landes ein (Groß-/Kleinschreibung egal)
5. Drücke Enter oder klicke auf "Prüfen"
6. Bei richtiger Antwort wird das Land grün mit dunklem Rand markiert
7. Das nächste zufällige Land wird ausgewählt
8. Nutze die Länderliste unten zum Nachschlagen aller Namen

## Steuerung

- **Mausrad**: Zoomen (1x bis 5x)
- **Ziehen mit Maus**: Karte verschieben (mit Begrenzung)
- **Doppelklick**: Zoom und Position zurücksetzen
- **Enter**: Antwort bestätigen

## Besondere Features

### Kleine Länder
Folgende Länder erhalten automatisch einen roten Markierungskreis (Radius min. 15 Einheiten):
- **Europa**: Liechtenstein, Monaco, San Marino, Vatikanstadt, Andorra, Malta
- **Pazifik**: Kiribati, Nauru, Tuvalu, Marshallinseln, Palau, Mikronesien, Samoa, Tonga
- **Karibik**: St. Kitts und Nevis, Grenada, Antigua und Barbuda, Barbados, St. Lucia, St. Vincent und die Grenadinen, Dominica
- **Andere**: Singapur, Malediven, Komoren, Seychellen, Mauritius, São Tomé und Príncipe, Kap Verde

### Farbschema
- **Grau** (#d3d3d3): Nicht geratene Länder
- **Orange** (#FF8C00): Aktuell zu ratendes Land
- **Orange-Dunkel** (#CC6600): Rand des aktuellen Landes
- **Grün** (#4CAF50): Erfolgreich geratene Länder
- **Grün-Dunkel** (#2E7D32): Rand geratener Länder
- **Rot**: Markierungskreis für kleine Länder (ohne Füllung)

## Code-Architektur

### GameState (`js/core/gameState.js`)
- Verwaltet den Spielzustand und verbleibende Länder
- Tracking von erratenen Ländern (Set)
- Zufallsauswahl ohne Wiederholung
- Case-insensitive Eingabevalidierung

### UI (`js/core/ui.js`)
- UI-Updates und Status-Nachrichten
- Karten-Highlighting mit Klassenmanagement
- Automatische Kreismarkierung für kleine Länder
- Eingabefokus-Verwaltung

### MapInteraction (`js/utils/mapInteraction.js`)
- Zoom: 1x-5x (verhindert zu weites Heraus-/Hineinzoomen)
- Pan mit Constraints: 50% der Karte bleibt immer sichtbar
- Event-Handling für Maus-Interaktionen
- Doppelklick zum Zurücksetzen

### Game (`js/game.js`)
- Haupt-Controller orchestriert alle Module
- Lädt SVG-Karte und initialisiert Interaktionen
- Koordiniert GameState, UI und MapInteraction
- Accordion für alphabetische Länderliste

## Technologien

- **Vanilla JavaScript** (ES6 Modules)
- **CSS3** (Transforms, Animations, Flexbox)
- **SVG-Karte**: world.svg mit allen 196 UN-Mitgliedern + Kosovo + Vatikan
- **Keine Frameworks/Libraries** - Pure Web Standards

## Länderabdeckung

Das Spiel enthält alle 196 international anerkannten Länder:
- 193 UN-Mitgliedsstaaten
- Kosovo (XK)
- Vatikanstadt (VA)
- Taiwan wird als eigenständig behandelt

Jedes Land hat:
- Deutschen Namen in `countries.js`
- ISO 3166-1 Alpha-2 Code
- SVG-Pfad oder -Element in `world.svg`

## Browser-Kompatibilität

- Chrome/Edge 90+ (empfohlen)
- Firefox 88+
- Safari 14+
- Benötigt ES6-Module-Support und SVG 1.1

## Entwicklung

Validierung (nur in Development-Umgebung):
- Automatische Prüfung ob alle Länder aus `countries.js` in der SVG-Karte vorhanden sind
- Console-Log zeigt fehlende Länder an
