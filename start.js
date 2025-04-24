const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const http = require('http');

// Get PORT from Render
const PORT = process.env.PORT || 10000;

// Path to config.json
const configPath = path.join(__dirname, 'meshcentral-data', 'config.json');

// Read or create config
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} else {
  config.settings = {};
}

// Force bind to 0.0.0.0 and correct port
config.settings = config.settings || {};
config.settings.port = parseInt(PORT);
config.settings.bind = ["0.0.0.0"];

// Save updated config
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`✅ Updated config.json to use port ${PORT} and bind to 0.0.0.0`);

// Start MeshCentral
const meshProcess = exec(`node bin/meshcentral`, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ MeshCentral error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ MeshCentral stderr: ${stderr}`);
  }
  console.log(`📦 MeshCentral output: ${stdout}`);
});

// OPTIONAL fallback HTTP server so Render detects the port is open
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('✅ MeshCentral fallback server alive');
});
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Fallback server listening on http://0.0.0.0:${PORT}`);
});
