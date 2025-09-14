interface GameState {
  state: 'menu' | 'playing';
  moveCount: number;
  playerWorldX: number;
  playerWorldY: number;
}

interface GameConfig {
  gridSize: number;
  worldWidth: number;
  worldHeight: number;
}

interface UIElements {
  app: HTMLElement;
  gameContainer: HTMLElement;
  startScreen: HTMLElement;
  gameScreen: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  startGameBtn: HTMLButtonElement;
  endGameBtn: HTMLButtonElement;
  moveCounter: HTMLElement;
  gameMenu: HTMLElement;
}

class PixelWalker {
  private gameState: GameState;
  private config: GameConfig;
  private animationId: number | null = null;
  private ui: UIElements;

  constructor() {
    // Game state
    this.gameState = {
      state: 'menu',
      moveCount: 0,
      playerWorldX: 0,
      playerWorldY: 0
    };
    
    // Game configuration
    this.config = {
      gridSize: 20, // Size of each grid cell in pixels
      worldWidth: 30, // Visible world width in cells
      worldHeight: 20 // Visible world height in cells
    };
    
    // Initialize UI
    this.ui = this.createUI();
    
    // Event listeners
    this.setupEventListeners();
    
    // Initialize the game
    this.init();
  }
  
  private createUI(): UIElements {
    // Get the app container
    const app = document.getElementById('app') as HTMLElement;
    if (!app) {
      throw new Error('App container not found');
    }

    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    app.appendChild(gameContainer);

    // Create start screen
    const startScreen = document.createElement('div');
    startScreen.id = 'start-screen';
    startScreen.className = 'screen active';
    
    const startMenuBox = document.createElement('div');
    startMenuBox.className = 'menu-box';
    
    const startTitle = document.createElement('h1');
    startTitle.textContent = 'Pixel Walker';
    
    const startGameBtn = document.createElement('button');
    startGameBtn.id = 'start-game-btn';
    startGameBtn.textContent = 'Start Game';
    
    startMenuBox.appendChild(startTitle);
    startMenuBox.appendChild(startGameBtn);
    startScreen.appendChild(startMenuBox);
    gameContainer.appendChild(startScreen);

    // Create game screen
    const gameScreen = document.createElement('div');
    gameScreen.id = 'game-screen';
    gameScreen.className = 'screen';
    
    // Create game UI
    const gameUI = document.createElement('div');
    gameUI.id = 'game-ui';
    
    const moveCounter = document.createElement('div');
    moveCounter.id = 'move-counter';
    moveCounter.textContent = 'Moves: 0';
    
    const gameMenu = document.createElement('div');
    gameMenu.id = 'game-menu';
    gameMenu.className = 'hidden';
    
    const gameMenuBox = document.createElement('div');
    gameMenuBox.className = 'menu-box';
    
    const gameMenuTitle = document.createElement('h2');
    gameMenuTitle.textContent = 'Game Menu';
    
    const endGameBtn = document.createElement('button');
    endGameBtn.id = 'end-game-btn';
    endGameBtn.textContent = 'End Game';
    
    gameMenuBox.appendChild(gameMenuTitle);
    gameMenuBox.appendChild(endGameBtn);
    gameMenu.appendChild(gameMenuBox);
    
    gameUI.appendChild(moveCounter);
    gameUI.appendChild(gameMenu);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    
    gameScreen.appendChild(gameUI);
    gameScreen.appendChild(canvas);
    gameContainer.appendChild(gameScreen);

    // Get canvas context
    const ctx = canvas.getContext('2d')!;
    
    // Setup canvas
    canvas.width = this.config.worldWidth * this.config.gridSize;
    canvas.height = this.config.worldHeight * this.config.gridSize;

    return {
      app,
      gameContainer,
      startScreen,
      gameScreen,
      canvas,
      ctx,
      startGameBtn,
      endGameBtn,
      moveCounter,
      gameMenu
    };
  }
  
  private setupEventListeners(): void {
    // Start game button
    this.ui.startGameBtn.addEventListener('click', () => {
      this.startGame();
    });
    
    // End game button
    this.ui.endGameBtn.addEventListener('click', () => {
      this.endGame();
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.gameState.state === 'playing') {
        this.handleKeyPress(e);
      }
    });
  }
  
  private init(): void {
    this.showScreen('start-screen');
  }
  
  private showScreen(screenId: string): void {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }
  }
  
  private startGame(): void {
    this.gameState.state = 'playing';
    this.gameState.moveCount = 0;
    this.gameState.playerWorldX = 0;
    this.gameState.playerWorldY = 0;
    this.updateMoveCounter();
    this.showScreen('game-screen');
    this.gameLoop();
  }
  
  private endGame(): void {
    this.gameState.state = 'menu';
    this.hideGameMenu();
    this.showScreen('start-screen');
    
    // Cancel any ongoing animation
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  private handleKeyPress(e: KeyboardEvent): void {
    let moved = false;
    
    switch(e.key.toLowerCase()) {
      case 'w':
        this.gameState.playerWorldY -= 1;
        moved = true;
        break;
      case 's':
        this.gameState.playerWorldY += 1;
        moved = true;
        break;
      case 'a':
        this.gameState.playerWorldX -= 1;
        moved = true;
        break;
      case 'd':
        this.gameState.playerWorldX += 1;
        moved = true;
        break;
      case 'escape':
        this.toggleGameMenu();
        break;
    }
    
    if (moved) {
      this.gameState.moveCount++;
      this.updateMoveCounter();
      this.render();
    }
    
    e.preventDefault();
  }
  
  private toggleGameMenu(): void {
    this.ui.gameMenu.classList.toggle('hidden');
  }
  
  private hideGameMenu(): void {
    this.ui.gameMenu.classList.add('hidden');
  }
  
  private updateMoveCounter(): void {
    this.ui.moveCounter.textContent = `Moves: ${this.gameState.moveCount}`;
  }
  
  // Generate a pseudo-random color variation for each cell
  private getCellColor(x: number, y: number): string {
    // Create a simple hash from coordinates for consistent colors
    const hash = (x * 31 + y * 17) % 100;
    
    // Base colors - alternating pattern
    const isEven = (x + y) % 2 === 0;
    const baseR = isEven ? 40 : 60;
    const baseG = isEven ? 80 : 100;
    const baseB = isEven ? 40 : 60;
    
    // Add variation based on hash
    const variation = (hash - 50) * 0.3;
    
    const r = Math.max(0, Math.min(255, baseR + variation));
    const g = Math.max(0, Math.min(255, baseG + variation));
    const b = Math.max(0, Math.min(255, baseB + variation));
    
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  }
  
  private render(): void {
    // Clear canvas
    this.ui.ctx.fillStyle = '#000000';
    this.ui.ctx.fillRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
    
    // Calculate the top-left corner of the visible world
    const startX = this.gameState.playerWorldX - Math.floor(this.config.worldWidth / 2);
    const startY = this.gameState.playerWorldY - Math.floor(this.config.worldHeight / 2);
    
    // Render the grid
    for (let y = 0; y < this.config.worldHeight; y++) {
      for (let x = 0; x < this.config.worldWidth; x++) {
        const worldX = startX + x;
        const worldY = startY + y;
        
        // Draw grid cell
        this.ui.ctx.fillStyle = this.getCellColor(worldX, worldY);
        this.ui.ctx.fillRect(
          x * this.config.gridSize,
          y * this.config.gridSize,
          this.config.gridSize,
          this.config.gridSize
        );
        
        // Draw grid lines
        this.ui.ctx.strokeStyle = '#333333';
        this.ui.ctx.lineWidth = 1;
        this.ui.ctx.strokeRect(
          x * this.config.gridSize,
          y * this.config.gridSize,
          this.config.gridSize,
          this.config.gridSize
        );
      }
    }
    
    // Draw player (always in center)
    const centerX = Math.floor(this.config.worldWidth / 2);
    const centerY = Math.floor(this.config.worldHeight / 2);
    
    this.ui.ctx.fillStyle = '#ffff00'; // Bright yellow
    this.ui.ctx.fillRect(
      centerX * this.config.gridSize + 2,
      centerY * this.config.gridSize + 2,
      this.config.gridSize - 4,
      this.config.gridSize - 4
    );
    
    // Add a subtle glow effect to the player
    this.ui.ctx.shadowColor = '#ffff00';
    this.ui.ctx.shadowBlur = 10;
    this.ui.ctx.fillRect(
      centerX * this.config.gridSize + 2,
      centerY * this.config.gridSize + 2,
      this.config.gridSize - 4,
      this.config.gridSize - 4
    );
    this.ui.ctx.shadowBlur = 0;
  }
  
  private gameLoop(): void {
    if (this.gameState.state === 'playing') {
      this.render();
      this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new PixelWalker();
});
