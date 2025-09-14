import { GameState, GameConfig, UIElements } from '../types.js';

export class Renderer {
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
  }

  render(gameState: GameState, ui: UIElements): void {
    // Clear canvas
    ui.ctx.fillStyle = '#000000';
    ui.ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height);
    
    // Calculate current camera offset (with animation interpolation)
    let currentCameraOffsetX = gameState.cameraOffsetX;
    let currentCameraOffsetY = gameState.cameraOffsetY;
    
    if (gameState.isAnimating) {
      const elapsed = Date.now() - gameState.animationStartTime;
      const progress = Math.min(elapsed / this.config.animationDuration, 1);
      
      // Use ease-out animation curve
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      currentCameraOffsetX = gameState.cameraOffsetX + 
        (gameState.animationTargetOffsetX - gameState.cameraOffsetX) * easedProgress;
      currentCameraOffsetY = gameState.cameraOffsetY + 
        (gameState.animationTargetOffsetY - gameState.cameraOffsetY) * easedProgress;
    }
    
    // Calculate grid dimensions
    const gridWidth = this.config.worldWidth * this.config.gridSize;
    const gridHeight = this.config.worldHeight * this.config.gridSize;
    
    // Calculate offset to center the grid on screen
    const centerOffsetX = (ui.canvas.width - gridWidth) / 2;
    const centerOffsetY = (ui.canvas.height - gridHeight) / 2;
    
    // Calculate the top-left corner of the visible world
    const startX = gameState.playerWorldX - Math.floor(this.config.worldWidth / 2);
    const startY = gameState.playerWorldY - Math.floor(this.config.worldHeight / 2);
    
    // Render the grid with camera offset
    for (let y = 0; y < this.config.worldHeight; y++) {
      for (let x = 0; x < this.config.worldWidth; x++) {
        const worldX = startX + x;
        const worldY = startY + y;
        
        // Calculate screen position with camera offset
        const screenX = centerOffsetX + x * this.config.gridSize + currentCameraOffsetX;
        const screenY = centerOffsetY + y * this.config.gridSize + currentCameraOffsetY;
        
        // Draw grid cell
        ui.ctx.fillStyle = this.getCellColor(worldX, worldY);
        ui.ctx.fillRect(
          screenX,
          screenY,
          this.config.gridSize,
          this.config.gridSize
        );
        
        // Draw grid lines
        ui.ctx.strokeStyle = '#333333';
        ui.ctx.lineWidth = 1;
        ui.ctx.strokeRect(
          screenX,
          screenY,
          this.config.gridSize,
          this.config.gridSize
        );
      }
    }
    
    // Draw player (always in center of screen - no camera offset)
    const centerX = centerOffsetX + Math.floor(this.config.worldWidth / 2) * this.config.gridSize;
    const centerY = centerOffsetY + Math.floor(this.config.worldHeight / 2) * this.config.gridSize;
    
    ui.ctx.fillStyle = '#ffff00'; // Bright yellow
    ui.ctx.fillRect(
      centerX + 6,
      centerY + 6,
      this.config.gridSize - 12,
      this.config.gridSize - 12
    );
    
    // Add a subtle glow effect to the player
    ui.ctx.shadowColor = '#ffff00';
    ui.ctx.shadowBlur = 15;
    ui.ctx.fillRect(
      centerX + 6,
      centerY + 6,
      this.config.gridSize - 12,
      this.config.gridSize - 12
    );
    ui.ctx.shadowBlur = 0;
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
    
    // Add subtle variation based on hash (reduced from 0.3 to 0.1)
    const variation = (hash - 50) * 0.1;
    
    const r = Math.max(0, Math.min(255, baseR + variation));
    const g = Math.max(0, Math.min(255, baseG + variation));
    const b = Math.max(0, Math.min(255, baseB + variation));
    
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  }
}
