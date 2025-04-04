#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SERVICES_DIR = path.join(__dirname, '..', 'services');
const MIN_NODE_VERSION = '18.0.0';

// Get current Node.js version
const currentVersion = process.version.replace('v', '');
console.log(`Current Node.js version: ${currentVersion}`);

// Check if current version meets minimum requirement
const [currentMajor] = currentVersion.split('.').map(Number);
const [minMajor] = MIN_NODE_VERSION.split('.').map(Number);

if (currentMajor < minMajor) {
    console.error(`❌ Error: Node.js version ${currentVersion} is below minimum required version ${MIN_NODE_VERSION}`);
    process.exit(1);
}

// Function to compare versions
function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
        if (parts1[i] > parts2[i]) return 1;
        if (parts1[i] < parts2[i]) return -1;
    }
    return 0;
}

// Check all services
console.log('\nChecking Node.js version requirements in all services...');
let hasErrors = false;

const services = fs.readdirSync(SERVICES_DIR).filter(file => {
    return fs.statSync(path.join(SERVICES_DIR, file)).isDirectory();
});

services.forEach(service => {
    const packageJsonPath = path.join(SERVICES_DIR, service, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const requiredVersion = packageJson.engines?.node;
            
            if (!requiredVersion) {
                console.error(`❌ ${service}: No Node.js version requirement specified`);
                hasErrors = true;
                return;
            }
            
            // Extract version number from requirement string (e.g., ">=18.0.0" -> "18.0.0")
            const versionMatch = requiredVersion.match(/\d+\.\d+\.\d+/);
            if (!versionMatch) {
                console.error(`❌ ${service}: Invalid version requirement format: ${requiredVersion}`);
                hasErrors = true;
                return;
            }
            
            const requiredVersionNum = versionMatch[0];
            if (compareVersions(currentVersion, requiredVersionNum) < 0) {
                console.error(`❌ ${service}: Current Node.js version ${currentVersion} does not meet requirement ${requiredVersion}`);
                hasErrors = true;
            } else {
                console.log(`✓ ${service}: Node.js version requirement ${requiredVersion} satisfied`);
            }
        } catch (error) {
            console.error(`❌ ${service}: Error reading package.json: ${error.message}`);
            hasErrors = true;
        }
    }
});

if (hasErrors) {
    console.error('\n❌ Node.js version check failed. Please update your Node.js version or adjust the requirements.');
    process.exit(1);
} else {
    console.log('\n✓ All Node.js version requirements satisfied!');
} 