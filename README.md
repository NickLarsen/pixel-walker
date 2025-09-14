# Pixel Walker

A pixel art grid-based exploration game built with TypeScript.

## Features

- 🎮 Grid-based world exploration
- 🎨 Procedurally generated pixel art world
- ⌨️ WASD movement controls
- 📊 Move counter tracking
- 🎯 Fixed player position with world scrolling
- 🎪 Retro pixel art aesthetic

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
This will:
- Start TypeScript compilation in watch mode
- Launch a development server at http://localhost:3000
- Automatically open the game in your browser
- Auto-reload when you make changes

### Production Build
```bash
npm run build
npm run start
```

### Other Commands
```bash
npm run serve    # Start server without opening browser
node cli.js help # Show CLI help
```

## How to Play

1. **Start Screen**: Click "Start Game" to begin
2. **Movement**: Use WASD keys to explore the world
3. **Menu**: Press Escape to access the game menu
4. **End Game**: Click "End Game" to return to the main menu

## Game Controls

- **W** - Move up
- **A** - Move left  
- **S** - Move down
- **D** - Move right
- **Escape** - Toggle game menu

## Technical Details

- **Language**: TypeScript
- **Rendering**: Pure HTML5 Canvas (no DOM manipulation)
- **UI System**: Canvas-based text and button rendering
- **Build System**: TypeScript Compiler
- **Development Server**: Live Server
- **Grid Size**: Responsive (minimum 20px per cell)
- **World Size**: 30x20 visible cells
- **Player**: Fixed center position with camera-based world scrolling

## Project Structure

```
pixel-walker/
├── src/
│   ├── components/
│   │   ├── UIManager.ts      # UI creation and management
│   │   ├── GameStateManager.ts # Game state and animations
│   │   ├── Renderer.ts        # Rendering logic and camera
│   │   └── InputHandler.ts    # User input processing
│   ├── types.ts              # Type definitions
│   ├── main.ts               # Main game class
│   └── index.html            # Game HTML (minimal)
├── dist/
│   └── *.js                  # Compiled JavaScript
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── cli.js                   # Command line interface
└── README.md                # This file
```

## Development

The game is built with TypeScript for better type safety and development experience. The source code is organized in modular components within the `src/` directory and gets compiled to `dist/`.

Key classes:
- `PixelWalker`: Main game class that orchestrates all components
- `UIManager`: Handles all UI creation and management
- `GameStateManager`: Manages game state and animations
- `Renderer`: Handles rendering logic and camera system
- `InputHandler`: Manages user input and events

## License

MIT
