# Node.js Version Requirements

## Overview
This project requires Node.js version 18.0.0 or higher for all services. This requirement is enforced through multiple mechanisms to ensure compatibility and prevent runtime issues.

## Implementation Details

### Version Checks
- A version check script (`scripts/check-node-version.js`) verifies Node.js version requirements
- Checks are integrated into all major npm scripts (build, start, dev, test)
- The script validates both the current Node.js version and service-specific requirements

### Service Requirements
- Each service's `package.json` includes an `engines` field specifying Node.js requirements
- The root `package.json` enforces Node.js >=18.0.0
- New services are automatically configured with the correct version requirement

### Enforcement Points
1. **Build Time**: Version check runs before TypeScript compilation
2. **Development**: Version check runs before starting the development server
3. **Testing**: Version check runs before executing tests
4. **Production**: Version check runs before starting the application

## Usage

### Manual Version Check
```bash
npm run check-node
```

### Common Commands
```bash
# Build with version check
npm run build

# Start with version check
npm start

# Development with version check
npm run dev

# Test with version check
npm test
```

## Error Handling
If version requirements are not met:
1. The process will exit with code 1
2. Detailed error messages will indicate which requirements failed
3. Service-specific version mismatches will be reported

## Adding New Services
New services should:
1. Include the `engines` field in their `package.json`
2. Specify Node.js >=18.0.0
3. Follow the template in `scripts/package.json.template`

## CI/CD Integration
The version check is automatically included in:
- Build pipelines
- Test pipelines
- Deployment pipelines

This ensures that incompatible Node.js versions are caught early in the development process. 