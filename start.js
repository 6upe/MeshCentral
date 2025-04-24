const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'meshcentral-data', 'config.json');
const PORT = process.env.PORT || 10000;

function updateConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`❌ Config file not found at ${CONFIG_PATH}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  // Ensure settings object exists
  config.settings = config.settings || {};

  // Force bind to 0.0.0.0 and apply Render port
  config.settings.port = parseInt(PORT, 10);
  config.settings.bind = ["0.0.0.0"];
  config.settings.WANonly = true;
  config.settings.redirPort = 80;
  config.settings.minify = true;

  // Save updated config
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log(`✅ Updated config.json to use port ${PORT} and bind to 0.0.0.0`);
}

updateConfig();

// Start MeshCentral
require('./bin/meshcentral');

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('MeshCentral Fallback Alive');
});
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Fallback HTTP server listening on 0.0.0.0:${PORT}`);
});

