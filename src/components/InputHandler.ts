import { MovementDelta } from '../types.js';

export class InputHandler {
  private onStartGame: () => void;
  private onEndGame: () => void;
  private onMove: (delta: MovementDelta) => void;
  private onToggleMenu: () => void;
  private onResize: () => void;
  private onCanvasClick: (x: number, y: number) => void;

  constructor(
    onStartGame: () => void,
    onEndGame: () => void,
    onMove: (delta: MovementDelta) => void,
    onToggleMenu: () => void,
    onResize: () => void,
    onCanvasClick: (x: number, y: number) => void
  ) {
    this.onStartGame = onStartGame;
    this.onEndGame = onEndGame;
    this.onMove = onMove;
    this.onToggleMenu = onToggleMenu;
    this.onResize = onResize;
    this.onCanvasClick = onCanvasClick;
  }

  setupEventListeners(canvas: HTMLCanvasElement): void {
    // Keyboard controls
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this.handleKeyPress(e);
    });
    
    // Canvas click handling
    canvas.addEventListener('click', (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.onCanvasClick(x, y);
    });
    
    // Window resize handling
    window.addEventListener('resize', () => {
      this.onResize();
    });
  }

  private handleKeyPress(e: KeyboardEvent): void {
    let delta: MovementDelta | null = null;
    
    switch(e.key.toLowerCase()) {
      case 'w':
        delta = { deltaX: 0, deltaY: -1 };
        break;
      case 's':
        delta = { deltaX: 0, deltaY: 1 };
        break;
      case 'a':
        delta = { deltaX: -1, deltaY: 0 };
        break;
      case 'd':
        delta = { deltaX: 1, deltaY: 0 };
        break;
      case 'escape':
        this.onToggleMenu();
        break;
    }
    
    if (delta) {
      this.onMove(delta);
    }
    
    e.preventDefault();
  }
}