// Game interfaces and types
export interface GameState {
  state: 'menu' | 'playing';
  moveCount: number;
  playerWorldX: number;
  playerWorldY: number;
  isAnimating: boolean;
  animationStartTime: number;
  cameraOffsetX: number;
  cameraOffsetY: number;
  animationTargetOffsetX: number;
  animationTargetOffsetY: number;
}

export interface GameConfig {
  gridSize: number;
  worldWidth: number;
  worldHeight: number;
  animationDuration: number;
  minGridSize: number;
}

export interface UIElements {
  app: HTMLElement;
  gameContainer: HTMLElement;
  startScreen: HTMLElement | null;
  gameScreen: HTMLElement | null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  startGameBtn: HTMLButtonElement | null;
  endGameBtn: HTMLButtonElement | null;
  moveCounter: HTMLElement | null;
  gameMenu: HTMLElement | null;
}

export interface MovementDelta {
  deltaX: number;
  deltaY: number;
}
