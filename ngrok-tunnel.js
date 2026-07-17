/**
 * NestHaven ngrok tunnel
 * Starts an ngrok tunnel for the Express backend (port 3004)
 * Run: node ngrok-tunnel.js
 */

const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 8081;
const ngrokBin = path.join(__dirname, 'ngrok-bin', 'ngrok.exe');

console.log('\n========================================');
console.log('  Starting NestHaven ngrok tunnel...');
console.log('========================================\n');

// If you have an authtoken, run: ngrok-bin/ngrok.exe config add-authtoken YOUR_TOKEN
const ngrok = spawn(ngrokBin, ['http', String(PORT), '--log', 'stdout'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

ngrok.stdout.on('data', (data) => {
  const line = data.toString();
  // Look for the public URL in the log output
  const match = line.match(/url=(https:\/\/[^\s]+)/);
  if (match) {
    console.log('\n========================================');
    console.log('  NestHaven is publicly accessible!');
    console.log('========================================');
    console.log(`  Public URL : ${match[1]}`);
    console.log(`  Local site : http://localhost:${PORT}`);
    console.log('========================================');
    console.log('\n  Share this URL with anyone to demo the site.');
    console.log('  Press Ctrl+C to stop the tunnel.\n');
  }
});

ngrok.stderr.on('data', (data) => {
  const msg = data.toString();
  if (!msg.includes('lvl=info') && !msg.includes('lvl=debug')) {
    console.error('ngrok:', msg.trim());
  }
});

ngrok.on('close', (code) => {
  if (code !== 0) {
    console.error(`\nngrok exited with code ${code}`);
    console.log('Tip: If you see an auth error, get a free authtoken at https://ngrok.com');
    console.log('     Then run: ngrok-bin\\ngrok.exe config add-authtoken YOUR_TOKEN');
  }
});

process.on('SIGINT', () => {
  console.log('\nClosing ngrok tunnel...');
  ngrok.kill();
  process.exit(0);
});
