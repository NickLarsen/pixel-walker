import { GameState, GameConfig, MovementDelta } from '../types.js';

export class GameStateManager {
  private gameState: GameState;
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.gameState = this.createInitialState();
  }

  getState(): GameState {
    return this.gameState;
  }

  private createInitialState(): GameState {
    return {
      state: 'menu',
      moveCount: 0,
      playerWorldX: 0,
      playerWorldY: 0,
      isAnimating: false,
      animationStartTime: 0,
      cameraOffsetX: 0,
      cameraOffsetY: 0,
      animationTargetOffsetX: 0,
      animationTargetOffsetY: 0
    };
  }

  startGame(): void {
    this.gameState.state = 'playing';
    this.gameState.moveCount = 0;
    this.gameState.playerWorldX = 0;
    this.gameState.playerWorldY = 0;
    this.gameState.isAnimating = false;
    this.gameState.cameraOffsetX = 0;
    this.gameState.cameraOffsetY = 0;
  }

  endGame(): void {
    this.gameState.state = 'menu';
    this.gameState.isAnimating = false;
  }

  startMovementAnimation(delta: MovementDelta): void {
    this.gameState.isAnimating = true;
    this.gameState.animationStartTime = Date.now();
    this.gameState.animationTargetOffsetX = this.gameState.cameraOffsetX - delta.deltaX * this.config.gridSize;
    this.gameState.animationTargetOffsetY = this.gameState.cameraOffsetY - delta.deltaY * this.config.gridSize;
    
    // Update player world position immediately
    this.gameState.playerWorldX += delta.deltaX;
    this.gameState.playerWorldY += delta.deltaY;
    this.gameState.moveCount++;
  }

  updateAnimation(): boolean {
    if (!this.gameState.isAnimating) {
      return false;
    }

    const elapsed = Date.now() - this.gameState.animationStartTime;
    const progress = Math.min(elapsed / this.config.animationDuration, 1);
    
    // Use ease-out animation curve
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    
    this.gameState.cameraOffsetX = this.gameState.cameraOffsetX + 
      (this.gameState.animationTargetOffsetX - this.gameState.cameraOffsetX) * easedProgress;
    this.gameState.cameraOffsetY = this.gameState.cameraOffsetY + 
      (this.gameState.animationTargetOffsetY - this.gameState.cameraOffsetY) * easedProgress;
    
    // Check if animation is complete
    if (progress >= 1) {
      this.gameState.cameraOffsetX = this.gameState.animationTargetOffsetX;
      this.gameState.cameraOffsetY = this.gameState.animationTargetOffsetY;
      this.gameState.isAnimating = false;
    }

    return true;
  }

  canMove(): boolean {
    return this.gameState.state === 'playing' && !this.gameState.isAnimating;
  }
}
