const currentVersion = process.version;
const requiredVersion = '18.0.0';

console.log(`Current Node.js version: ${currentVersion}`);

if (currentVersion.startsWith('v')) {
  const version = currentVersion.slice(1);
  const [major] = version.split('.');
  if (parseInt(major) < 18) {
    console.error(`❌ Error: Node.js version ${version} is below minimum required version ${requiredVersion}`);
    process.exit(1);
  }
} else {
  console.error('❌ Error: Unable to determine Node.js version');
  process.exit(1);
}

console.log('✅ Node.js version check passed'); 