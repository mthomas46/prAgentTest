import semver from 'semver';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
const { engines } = packageJson;
const version = engines.node;

if (!semver.satisfies(process.version, version)) {
  console.error(
    `Required node version ${version} not satisfied with current version ${process.version}.`
  );
  process.exit(1);
} 