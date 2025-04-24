const fs = require('fs');
const path = require('path');
const meshcentral = require('./bin/meshcentral');

const configPath = path.join(__dirname, 'meshcentral-data', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath));

// Use Render’s dynamic port
config.settings = config.settings || {};
config.settings.port = parseInt(process.env.PORT, 10);

// Overwrite the config file with the new port
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

// Now start MeshCentral
require('./bin/meshcentral');
