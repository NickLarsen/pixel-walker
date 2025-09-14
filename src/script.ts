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

class PixelWalker {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameState: GameState;
  private config: GameConfig;
  private animationId: number | null = null;

  constructor() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
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
    
    // Canvas setup
    this.setupCanvas();
    
    // Event listeners
    this.setupEventListeners();
    
    // Initialize the game
    this.init();
  }
  
  private setupCanvas(): void {
    this.canvas.width = this.config.worldWidth * this.config.gridSize;
    this.canvas.height = this.config.worldHeight * this.config.gridSize;
  }
  
  private setupEventListeners(): void {
    // Start game button
    const startBtn = document.getElementById('start-game-btn') as HTMLButtonElement;
    startBtn.addEventListener('click', () => {
      this.startGame();
    });
    
    // End game button
    const endBtn = document.getElementById('end-game-btn') as HTMLButtonElement;
    endBtn.addEventListener('click', () => {
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
    const gameMenu = document.getElementById('game-menu');
    if (gameMenu) {
      gameMenu.classList.toggle('hidden');
    }
  }
  
  private hideGameMenu(): void {
    const gameMenu = document.getElementById('game-menu');
    if (gameMenu) {
      gameMenu.classList.add('hidden');
    }
  }
  
  private updateMoveCounter(): void {
    const moveCounter = document.getElementById('move-counter');
    if (moveCounter) {
      moveCounter.textContent = `Moves: ${this.gameState.moveCount}`;
    }
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
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Calculate the top-left corner of the visible world
    const startX = this.gameState.playerWorldX - Math.floor(this.config.worldWidth / 2);
    const startY = this.gameState.playerWorldY - Math.floor(this.config.worldHeight / 2);
    
    // Render the grid
    for (let y = 0; y < this.config.worldHeight; y++) {
      for (let x = 0; x < this.config.worldWidth; x++) {
        const worldX = startX + x;
        const worldY = startY + y;
        
        // Draw grid cell
        this.ctx.fillStyle = this.getCellColor(worldX, worldY);
        this.ctx.fillRect(
          x * this.config.gridSize,
          y * this.config.gridSize,
          this.config.gridSize,
          this.config.gridSize
        );
        
        // Draw grid lines
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
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
    
    this.ctx.fillStyle = '#ffff00'; // Bright yellow
    this.ctx.fillRect(
      centerX * this.config.gridSize + 2,
      centerY * this.config.gridSize + 2,
      this.config.gridSize - 4,
      this.config.gridSize - 4
    );
    
    // Add a subtle glow effect to the player
    this.ctx.shadowColor = '#ffff00';
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(
      centerX * this.config.gridSize + 2,
      centerY * this.config.gridSize + 2,
      this.config.gridSize - 4,
      this.config.gridSize - 4
    );
    this.ctx.shadowBlur = 0;
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
