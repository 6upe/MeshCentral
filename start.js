const fs = require('fs');
const path = require('path');

// Path to the MeshCentral config file
const configDir = path.join(__dirname, 'meshcentral-data');
const configPath = path.join(configDir, 'config.json');

// Ensure meshcentral-data folder exists
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir);
}

// Default config if not found
const defaultConfig = {
  settings: {
    port: parseInt(process.env.PORT || '443', 10),
    aliasPort: 443,
    redirPort: 80,
    minify: true,
    WANonly: true,
    sessionKey: "replace_this_with_a_secure_random_key"
  },
  domains: {
    "": {
      title: "MeshCentral",
      userMeshLocalNetworkName: true
    }
  }
};

// Write config if it doesn't exist
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log('Created default config.json');
} else {
  // Modify existing config to use Render's port
  const config = JSON.parse(fs.readFileSync(configPath));
  config.settings = config.settings || {};
  config.settings.port = parseInt(process.env.PORT || '443', 10);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('Updated config.json with PORT');
}

// Start MeshCentral
require('./meshcentral.js');
