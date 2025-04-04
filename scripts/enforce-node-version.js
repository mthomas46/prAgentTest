const fs = require('fs');
const path = require('path');

const SERVICES_DIR = path.join(__dirname, '..', 'services');
const TEMPLATE_PATH = path.join(__dirname, 'package.json.template');
const NODE_VERSION = ">=18.0.0";

// Read template
const template = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));

// Get all service directories
const services = fs.readdirSync(SERVICES_DIR).filter(file => {
    return fs.statSync(path.join(SERVICES_DIR, file)).isDirectory();
});

console.log('Updating Node.js version requirement for all services...');

services.forEach(service => {
    const packageJsonPath = path.join(SERVICES_DIR, service, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
        console.log(`Processing ${service}...`);
        
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            
            // Add or update engines field
            packageJson.engines = {
                ...packageJson.engines,
                node: NODE_VERSION
            };
            
            // Write back to file with proper formatting
            fs.writeFileSync(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2) + '\n'
            );
            
            console.log(`✓ Updated ${service}`);
        } catch (error) {
            console.error(`✗ Error processing ${service}: ${error.message}`);
        }
    } else {
        console.log(`Creating package.json for ${service}...`);
        
        try {
            // Create new package.json from template
            const newPackageJson = {
                ...template,
                name: service,
                description: `${service} microservice`
            };
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(path.dirname(packageJsonPath))) {
                fs.mkdirSync(path.dirname(packageJsonPath), { recursive: true });
            }
            
            // Write the new package.json
            fs.writeFileSync(
                packageJsonPath,
                JSON.stringify(newPackageJson, null, 2) + '\n'
            );
            
            console.log(`✓ Created package.json for ${service}`);
        } catch (error) {
            console.error(`✗ Error creating package.json for ${service}: ${error.message}`);
        }
    }
});

console.log('\nDone! Node.js version requirement has been set to', NODE_VERSION);
console.log('\nTo verify the changes, you can run:');
console.log('find services -name package.json -exec grep -l \\"node\\":\\ \\">=18.0.0\\" {} \\;'); 