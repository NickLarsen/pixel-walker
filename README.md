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
- **Rendering**: HTML5 Canvas
- **Build System**: TypeScript Compiler
- **Development Server**: Live Server
- **Grid Size**: 20x20 pixels per cell
- **World Size**: 30x20 visible cells
- **Player**: Fixed center position with world scrolling

## Project Structure

```
pixel-walker/
├── src/
│   └── script.ts      # Main game logic (TypeScript)
├── dist/
│   └── script.js      # Compiled JavaScript
├── index.html         # Game HTML
├── style.css          # Game styles
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── cli.js            # Command line interface
└── README.md         # This file
```

## Development

The game is built with TypeScript for better type safety and development experience. The source code is in `src/script.ts` and gets compiled to `dist/script.js`.

Key classes:
- `PixelWalker`: Main game class
- `GameState`: Interface for game state management
- `GameConfig`: Interface for game configuration

## License

MIT
