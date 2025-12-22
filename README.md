# Weltkarte Länderspiel

Ein interaktives Lernspiel zum Lernen der Ländernamen und deren Positionen auf der Weltkarte.

## Features

- 🗺️ Alle 196 Länder der Welt
- 🔍 Zoom- und Pan-Funktionalität für kleine Länder
- 🎨 Visuelle Hervorhebung und Fortschrittsanzeige
- ⌨️ Tastatur-Navigation (Enter zum Bestätigen)
- 🎯 Zufällige Länderauswahl

## Projektstruktur

```
Desktop/
├── index.html              # Haupt-HTML-Datei
├── css/
│   └── styles.css         # Alle Styles
├── js/
│   ├── game.js            # Haupt-Game-Controller
│   ├── core/
│   │   ├── gameState.js   # Game-State-Management
│   │   └── ui.js          # UI-Komponenten
│   ├── data/
│   │   └── countries.js   # Länderdaten
│   └── utils/
│       └── mapInteraction.js  # Zoom/Pan-Funktionalität
└── game.html              # (Legacy - kann gelöscht werden)
```

## Verwendung

1. Öffne `index.html` in einem modernen Browser
2. Ein zufälliges Land wird gelb markiert
3. Gib den deutschen Namen des markierten Landes ein
4. Drücke Enter oder klicke auf "Prüfen"
5. Bei richtiger Antwort wird das Land grün markiert und das nächste erscheint

## Steuerung

- **Mausrad**: Zoomen
- **Ziehen**: Karte verschieben
- **Doppelklick**: Zoom zurücksetzen
- **Enter**: Antwort bestätigen

## Code-Architektur

### GameState (`js/core/gameState.js`)
- Verwaltet den Spielzustand
- Tracking von erratenen Ländern
- Zufallsauswahl der Länder

### UI (`js/core/ui.js`)
- Handhabt alle UI-Interaktionen
- Status-Updates und Nachrichten
- Karten-Highlighting

### MapInteraction (`js/utils/mapInteraction.js`)
- Pan- und Zoom-Funktionalität
- Event-Handling für Maus-Interaktionen
- Transform-Management

### Game (`js/game.js`)
- Haupt-Controller
- Koordiniert alle Module
- Spiel-Lifecycle-Management

## Technologien

- Vanilla JavaScript (ES6 Modules)
- CSS3
- SVG-Karte von [simple-world-map](https://github.com/flekschas/simple-world-map)

## Browser-Kompatibilität

- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Benötigt ES6-Module-Support
