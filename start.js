const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'meshcentral-data', 'config.json');
const PORT = process.env.PORT || 3000; // Fallback for local dev

// Load config file
const config = JSON.parse(fs.readFileSync(CONFIG_PATH));

// Inject dynamic Render port
config.settings = config.settings || {};
config.settings.port = parseInt(PORT, 10);

// Save updated config
fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

console.log(`✅ Updated config.json with port ${PORT}`);

// Start MeshCentral
require('./bin/meshcentral');
