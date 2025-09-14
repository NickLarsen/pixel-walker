import { UIElements, GameConfig } from '../types.js';

export class UIManager {
  private ui: UIElements;
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.ui = this.createUI();
    // Initialize canvas size after UI is created
    this.resizeCanvas();
  }

  getUI(): UIElements {
    return this.ui;
  }

  private createUI(): UIElements {
    // Get the app container
    const app = document.getElementById('app') as HTMLElement;
    if (!app) {
      throw new Error('App container not found');
    }

    // Create single canvas for everything
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    app.appendChild(canvas);

    // Get canvas context
    const ctx = canvas.getContext('2d')!;
    
    // Create UI elements object (simplified for canvas-only)
    const uiElements = {
      app,
      gameContainer: app, // Use app as container
      startScreen: null, // Not needed for canvas
      gameScreen: null,  // Not needed for canvas
      canvas,
      ctx,
      startGameBtn: null, // Will be handled via canvas clicks
      endGameBtn: null,   // Will be handled via canvas clicks
      moveCounter: null,  // Will be rendered on canvas
      gameMenu: null      // Will be rendered on canvas
    };

    return uiElements;
  }

  resizeCanvas(): void {
    // Get available window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate optimal grid size to fill the window with overlap
    // Make cells large enough that they extend beyond the visible area
    const optimalGridSizeX = Math.ceil(windowWidth / this.config.worldWidth);
    const optimalGridSizeY = Math.ceil(windowHeight / this.config.worldHeight);
    const optimalGridSize = Math.max(optimalGridSizeX, optimalGridSizeY);
    
    // Ensure minimum size but allow cells to be larger than window
    this.config.gridSize = Math.max(this.config.minGridSize, optimalGridSize);
    
    // Set canvas size to fill the window
    this.ui.canvas.width = windowWidth;
    this.ui.canvas.height = windowHeight;
    
    // Set canvas style to fill container
    this.ui.canvas.style.width = '100vw';
    this.ui.canvas.style.height = '100vh';
    this.ui.canvas.style.display = 'block';
  }

  // Canvas-based UI methods
  renderStartScreen(): void {
    const ctx = this.ui.ctx;
    const width = this.ui.canvas.width;
    const height = this.ui.canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw title
    ctx.fillStyle = '#00ff00';
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Pixel Walker', width / 2, height / 2 - 60);
    
    // Draw start button
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = width / 2 - buttonWidth / 2;
    const buttonY = height / 2 + 20;
    
    // Button background
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    // Button border
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    // Button text
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px monospace';
    ctx.fillText('Start Game', width / 2, buttonY + buttonHeight / 2);
  }

  renderGameUI(moveCount: number, showMenu: boolean): void {
    const ctx = this.ui.ctx;
    const width = this.ui.canvas.width;
    const height = this.ui.canvas.height;
    
    // Draw move counter
    ctx.fillStyle = '#00ff00';
    ctx.font = '20px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Moves: ${moveCount}`, 20, 20);
    
    // Draw game menu if shown
    if (showMenu) {
      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, width, height);
      
      // Menu box
      const menuWidth = 300;
      const menuHeight = 200;
      const menuX = width / 2 - menuWidth / 2;
      const menuY = height / 2 - menuHeight / 2;
      
      // Menu background
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(menuX, menuY, menuWidth, menuHeight);
      
      // Menu border
      ctx.strokeStyle = '#4a4a4a';
      ctx.lineWidth = 2;
      ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);
      
      // Menu title
      ctx.fillStyle = '#00ff00';
      ctx.font = '24px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Game Menu', width / 2, menuY + 40);
      
      // End game button
      const buttonWidth = 150;
      const buttonHeight = 40;
      const buttonX = width / 2 - buttonWidth / 2;
      const buttonY = menuY + 100;
      
      // Button background
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
      
      // Button border
      ctx.strokeStyle = '#4a4a4a';
      ctx.lineWidth = 2;
      ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
      
      // Button text
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText('End Game', width / 2, buttonY + buttonHeight / 2);
    }
  }

  // Check if click is on start button
  isStartButtonClick(x: number, y: number): boolean {
    const width = this.ui.canvas.width;
    const height = this.ui.canvas.height;
    
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = width / 2 - buttonWidth / 2;
    const buttonY = height / 2 + 20;
    
    return x >= buttonX && x <= buttonX + buttonWidth && 
           y >= buttonY && y <= buttonY + buttonHeight;
  }

  // Check if click is on end game button
  isEndGameButtonClick(x: number, y: number): boolean {
    const width = this.ui.canvas.width;
    const height = this.ui.canvas.height;
    
    const buttonWidth = 150;
    const buttonHeight = 40;
    const buttonX = width / 2 - buttonWidth / 2;
    const buttonY = height / 2 - 100 + 100; // Menu center - menu height/2 + 100
    
    return x >= buttonX && x <= buttonX + buttonWidth && 
           y >= buttonY && y <= buttonY + buttonHeight;
  }
}