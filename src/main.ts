import { GameConfig, UIElements, GameState, MovementDelta } from './types.js';
import { UIManager } from './components/UIManager.js';
import { GameStateManager } from './components/GameStateManager.js';
import { Renderer } from './components/Renderer.js';
import { InputHandler } from './components/InputHandler.js';

export class PixelWalker {
  private config: GameConfig;
  private ui: UIManager;
  private gameState: GameStateManager;
  private renderer: Renderer;
  private inputHandler: InputHandler;
  private animationId: number | null = null;
  private showGameMenu: boolean = false;

  constructor() {
    // Game configuration
    this.config = {
      gridSize: 60, // Size of each grid cell in pixels (3x original 20)
      worldWidth: 30, // Visible world width in cells
      worldHeight: 20, // Visible world height in cells
      animationDuration: 250, // Animation duration in milliseconds
      minGridSize: 20 // Minimum grid size for very small windows
    };
    
    // Initialize components
    this.ui = new UIManager(this.config);
    this.gameState = new GameStateManager(this.config);
    this.renderer = new Renderer(this.config);
    
    // Initialize input handler with callbacks
    this.inputHandler = new InputHandler(
      () => this.startGame(),
      () => this.endGame(),
      (delta: MovementDelta) => this.handleMovement(delta),
      () => this.toggleGameMenu(),
      () => this.handleResize(),
      (x: number, y: number) => this.handleCanvasClick(x, y)
    );
    
    // Setup UI and event listeners
    this.setupUI();
    this.init();
  }

  private setupUI(): void {
    const uiElements = this.ui.getUI();
    this.inputHandler.setupEventListeners(uiElements.canvas);
  }

  private init(): void {
    this.renderStartScreen();
  }

  private renderStartScreen(): void {
    this.ui.renderStartScreen();
  }

  private startGame(): void {
    this.gameState.startGame();
    this.showGameMenu = false;
    this.gameLoop();
  }

  private endGame(): void {
    this.gameState.endGame();
    this.showGameMenu = false;
    this.renderStartScreen();
    
    // Cancel any ongoing animation
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private handleMovement(delta: MovementDelta): void {
    if (!this.gameState.canMove()) {
      return;
    }

    this.gameState.startMovementAnimation(delta);
  }

  private toggleGameMenu(): void {
    this.showGameMenu = !this.showGameMenu;
  }

  private handleCanvasClick(x: number, y: number): void {
    const state = this.gameState.getState();
    
    if (state.state === 'menu') {
      // Check if start button was clicked
      if (this.ui.isStartButtonClick(x, y)) {
        this.startGame();
      }
    } else if (state.state === 'playing') {
      // Check if end game button was clicked (when menu is shown)
      if (this.showGameMenu && this.ui.isEndGameButtonClick(x, y)) {
        this.endGame();
      } else if (!this.showGameMenu) {
        // Click anywhere to close menu if it's open
        this.showGameMenu = false;
      }
    }
  }

  private handleResize(): void {
    this.ui.resizeCanvas();
    if (this.gameState.getState().state === 'playing') {
      this.render();
    } else {
      this.renderStartScreen();
    }
  }

  private render(): void {
    const state = this.gameState.getState();
    
    if (state.state === 'menu') {
      this.renderStartScreen();
    } else {
      // Render game world
      this.renderer.render(state, this.ui.getUI());
      // Render UI overlay
      this.ui.renderGameUI(state.moveCount, this.showGameMenu);
    }
  }

  private gameLoop(): void {
    if (this.gameState.getState().state === 'playing') {
      this.gameState.updateAnimation();
      this.render();
      this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new PixelWalker();
});
