# Weltkarte Länderspiel

Ein interaktives Lernspiel zum Lernen der Ländernamen und deren Positionen auf der Weltkarte.

## Features

- 🗺️ **7 verschiedene Karten**: Weltkarte + 6 Kontinente (Europa, Afrika, Asien, Nord-/Südamerika, Ozeanien)
- 🌍 Mehrsprachige Unterstützung über SVG data-Attribute (aktuell: Deutsch, einfach erweiterbar)
- 🔍 Intelligente Zoom-Funktion mit vollständiger Kartenanzeige beim Start (CSS object-fit: contain)
- 🎯 Automatische Kreismarkierungen für kleine Länder und Inselstaaten
- 🎨 Farbige Hervorhebung: Orange für aktuelle Auswahl, Grün mit dunklerem Rand für geratene Länder
- ⌨️ Tastatur-Navigation mit Enter-Taste
- 💡 Lösungs-Button zum Anzeigen des aktuellen Landes
- 📝 Groß-/Kleinschreibung wird ignoriert bei der Eingabe
- 📋 Alphabetische Länderliste zum Nachschlagen
- 🚫 Pan-Beschränkungen: Mindestens 50% der Karte bleibt sichtbar
- 📱 Responsive Design für Mobile, Tablet und Desktop
- 🎮 Kartenauswahl-Menü mit Vorschau und Statistiken

## Projektstruktur

```
world-map-game/
├── index.html              # Startseite mit Kartenauswahl
├── game.html              # Spiel-Seite
├── maps/
│   ├── maps.json          # Karten-Konfiguration
│   ├── world.svg          # Weltkarte (alle 250 Länder/Territorien)
│   ├── europe.svg         # Europa (53 Länder)
│   ├── africa.svg         # Afrika (58 Länder)
│   ├── asia.svg           # Asien (51 Länder)
│   ├── north-america.svg  # Nordamerika inkl. Karibik (41 Länder)
│   ├── south-america.svg  # Südamerika (15 Länder)
│   └── oceania.svg        # Ozeanien (28 Länder)
├── css/
│   └── styles.css         # Alle Styles inkl. Karten-Highlighting
├── js/
│   ├── game.js            # Haupt-Game-Controller mit Sprachunterstützung
│   ├── index.js           # Startseiten-Controller
│   ├── core/
│   │   ├── gameState.js   # Game-State-Management
│   │   └── ui.js          # UI-Komponenten & Highlighting
│   └── utils/
│       └── mapInteraction.js  # Zoom/Pan mit Auto-Fit
├── fix_viewbox.py         # Python-Script zur ViewBox-Optimierung
└── README.md              # Diese Datei
```

## Mehrsprachigkeit

Das Spiel liest Ländernamen direkt aus den SVG data-Attributen. Jedes Land hat:
- `id="XX"` - ISO 3166-1 Alpha-2 Code (z.B. "DE", "FR")
- `data-name-de="Name"` - Deutscher Name
- Weitere Sprachen können einfach hinzugefügt werden: `data-name-en`, `data-name-fr`, etc.

**Sprache ändern:**
```javascript
// Im Browser-Console:
window.game.setLanguage('de'); // Deutsch (Standard)
window.game.setLanguage('en'); // Englisch (wenn data-name-en existiert)
```

**Neue Sprache hinzufügen:**

Beispiel für Englisch - füge in `world.svg` das Attribut `data-name-en` hinzu:
```xml
<!-- Vorher -->
<path id="DE" data-name-de="Deutschland" ... />

<!-- Nachher -->
<path id="DE" data-name-de="Deutschland" data-name-en="Germany" ... />
```

Dann im Browser: `window.game.setLanguage('en')`

Das Spiel lädt automatisch alle Länder neu mit den Namen aus dem gewählten Attribut.

## Verwendung

1. Öffne `index.html` in einem modernen Browser oder starte einen lokalen Server
2. Wähle eine Karte aus (Welt, Europa, Afrika, Asien, Nordamerika, Südamerika, Ozeanien)
3. Ein zufälliges Land wird orange markiert und hervorgehoben
4. Kleine Länder erhalten zusätzlich einen roten Kreis zur besseren Sichtbarkeit
5. Gib den deutschen Namen des markierten Landes ein (Groß-/Kleinschreibung egal)
6. Drücke Enter oder klicke auf "Prüfen"
7. Klicke auf 💡 "Lösung" um den Namen des aktuellen Landes anzuzeigen
8. Bei richtiger Antwort wird das Land grün mit dunklem Rand markiert
9. Das nächste zufällige Land wird ausgewählt
10. Nutze die Länderliste unten zum Nachschlagen aller Namen
11. Klicke auf "← Zurück" um zur Kartenauswahl zurückzukehren

## Steuerung

- **Mausrad / Pinch**: Zoomen (0.1x bis 5x)
- **Ziehen mit Maus / Touch**: Karte verschieben (mit Begrenzung)
- **Doppelklick / Double-Tap**: Zoom und Position zurücksetzen (zeigt volle Karte)
- **Enter**: Antwort bestätigen
- **💡 Button**: Lösung anzeigen
- **← Zurück**: Zur Kartenauswahl zurückkehren

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
- **Grün** (#4CAF50): Erfolgreich geratene Länder, Buttons und Zurück-Button
- **Grün-Dunkel** (#2E7D32 / #45a049): Ränder und Hover-Effekte
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
- Auto-Fit: Zeigt die komplette Karte beim Start (wie CSS background-size: contain)
- Zoom: 0.1x-5x (flexibel anpassbar)
- Pan mit Constraints: 50% der Karte bleibt immer sichtbar
- Event-Handling für Maus-Interaktionen
- Doppelklick zum Zurücksetzen auf volle Kartensicht
- Transform-Origin: top-left für präzises Zoomen

### Game (`js/game.js`)
- Haupt-Controller orchestriert alle Module
- Lädt SVG-Karte und Länderdaten aus data-Attributen
- Koordiniert GameState, UI und MapInteraction
- Mehrsprachige Unterstützung durch `setLanguage()` Methode
- Accordion für alphabetische Länderliste

## Technologien

- **Vanilla JavaScript** (ES6 Modules)
- **CSS3** (Transforms, Animations, Flexbox, Grid, Media Queries)
- **Responsive Design** (Mobile-First-Ansatz)
- **SVG-Karte**: world.svg mit allen 196 UN-Mitgliedern + Kosovo + Vatikan
- **Keine Frameworks/Libraries** - Pure Web Standards

## Länderabdeckung

Das Spiel enthält insgesamt **446 Länder und Territorien** über alle Karten verteilt:

### Weltkarte
- 250 Länder und Territorien weltweit
- Alle UN-Mitgliedsstaaten plus abhängige Gebiete

### Kontinentalkarten
- **Europa**: 53 Länder (inkl. Grönland, Türkei)
- **Afrika**: 58 Länder und Territorien
- **Asien**: 51 Länder
- **Nordamerika**: 41 Länder (inkl. USA mit Alaska, Kanada, Mexiko, Karibik)
- **Südamerika**: 15 Länder und Territorien
- **Ozeanien**: 28 Länder (inkl. Australien, Neuseeland, Pazifik-Inseln)

Jedes Land hat:
- ISO 3166-1 Alpha-2 Code als `id` Attribut
- Deutschen Namen als `data-name-de` Attribut
- Optimierte SVG-ViewBox für beste Darstellung
- SVG-Pfad oder -Element in der jeweiligen Karten-Datei
- Erweiterbar mit weiteren Sprachen über `data-name-XX` Attribute

### ViewBox-Optimierung

Alle Karten wurden mit optimierten ViewBox-Werten ausgestattet:
- **Nordamerika**: Zeigt vollständig Alaska (inkl. Aleutian Islands) und alle Karibik-Inseln
- **Afrika**: Alle 58 Länder von Norden (Tunesien) bis Süden (Südafrika) sichtbar
- **Weitere Karten**: Exakte Bounding-Box für beste Raumausnutzung

Das mitgelieferte Python-Script `fix_viewbox.py` kann ViewBox-Werte automatisch berechnen.

## Browser-Kompatibilität

- Chrome/Edge 90+ (empfohlen)
- Firefox 88+
- Safari 14+
- Benötigt ES6-Module-Support und SVG 1.1
- Vollständig responsive: Desktop, Tablet (768px+), Mobile (< 768px)
