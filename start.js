const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const PORT = process.env.PORT || 10000;
const configPath = path.join(__dirname, 'meshcentral-data', 'config.json');

// Step 1: Update config.json
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} else {
  config.settings = {};
}

config.settings = config.settings || {};
config.settings.port = parseInt(PORT);
config.settings.bind = ['0.0.0.0'];

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`✅ Updated config.json to use port ${PORT} and bind to 0.0.0.0`);

// Step 2: Start fallback server
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('✅ MeshCentral fallback server alive');
});
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Fallback server listening on http://0.0.0.0:${PORT}`);
});

// Step 3: Start MeshCentral using spawn so we can see output
console.log('🚀 Starting MeshCentral...');

const mesh = spawn('node', ['meshcentral-deploy/node_modules/meshcentral'], { stdio: 'inherit' });

mesh.on('error', (err) => {
  console.error('❌ Failed to start MeshCentral:', err);
});

mesh.on('exit', (code, signal) => {
  console.log(`⚠️ MeshCentral exited with code ${code} and signal ${signal}`);
});
