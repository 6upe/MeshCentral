const fs = require('fs');
const meshcentral = require('./bin/meshcentral');

// Dynamically modify config.json
const configPath = './meshcentral-data/config.json';
let config = require(configPath);

config.settings = config.settings || {};
config.settings.port = process.env.PORT || 443; // Fallback to 443 if not on Render

// Write updated config back
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

// Start MeshCentral
require('./meshcentral.js');
