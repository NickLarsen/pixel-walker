#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const commands = {
  'dev': () => {
    console.log('🚀 Starting Pixel Walker development server...');
    console.log('📝 TypeScript compilation will run in watch mode');
    console.log('🌐 Server will be available at http://localhost:3000');
    console.log('⏹️  Press Ctrl+C to stop\n');
    
    // Start TypeScript compiler in watch mode
    const tsc = spawn('npx', ['tsc', '--watch'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Start live server
    const server = spawn('npx', ['live-server', '--port=3000', '--open=/index.html'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Handle cleanup
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping development server...');
      tsc.kill();
      server.kill();
      process.exit(0);
    });
  },
  
  'build': () => {
    console.log('🔨 Building Pixel Walker...');
    const tsc = spawn('npx', ['tsc'], {
      stdio: 'inherit',
      shell: true
    });
    
    tsc.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build completed successfully!');
      } else {
        console.log('❌ Build failed');
        process.exit(1);
      }
    });
  },
  
  'start': () => {
    console.log('🎮 Starting Pixel Walker...');
    console.log('🌐 Server will be available at http://localhost:3000');
    console.log('⏹️  Press Ctrl+C to stop\n');
    
    const server = spawn('npx', ['live-server', '--port=3000', '--open=/index.html'], {
      stdio: 'inherit',
      shell: true
    });
    
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping server...');
      server.kill();
      process.exit(0);
    });
  },
  
  'serve': () => {
    console.log('🌐 Starting server without auto-open...');
    console.log('🌐 Server will be available at http://localhost:3000');
    console.log('⏹️  Press Ctrl+C to stop\n');
    
    const server = spawn('npx', ['live-server', '--port=3000'], {
      stdio: 'inherit',
      shell: true
    });
    
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping server...');
      server.kill();
      process.exit(0);
    });
  },
  
  'help': () => {
    console.log(`
🎮 Pixel Walker - Command Line Interface

Available commands:
  dev     Start development server with TypeScript watch mode
  build   Compile TypeScript to JavaScript
  start   Start production server (opens browser automatically)
  serve   Start server without opening browser
  help    Show this help message

Examples:
  npm run dev     # Start development mode
  npm run build   # Build the project
  npm run start   # Start and play the game
  npm run serve   # Start server only

For development, use 'npm run dev' to get:
- TypeScript compilation in watch mode
- Live server with auto-reload
- Automatic browser opening
`);
  }
};

const command = process.argv[2] || 'help';

if (commands[command]) {
  commands[command]();
} else {
  console.log(`❌ Unknown command: ${command}`);
  commands.help();
}
