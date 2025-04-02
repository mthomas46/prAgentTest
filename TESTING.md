# Testing Documentation

## Overview

This document provides comprehensive guidance for the testing infrastructure of the Task Management API. It covers test setup, execution, and maintenance procedures.

## Development Environment

### Prerequisites

- Node.js (v16+)
- npm (v7+)
- SQLite3
- Docker (for database viewer)

### Key Dependencies

- **Jest**: Primary testing framework
- **@nestjs/testing**: NestJS testing utilities
- **supertest**: HTTP assertions
- **sqlite3**: Database for testing
- **TypeORM**: ORM for database interactions
- **Adminer**: Database management tool (Dockerized)

## Test Setup

The project uses Jest as the testing framework with the following configuration:

### Environment Configuration

- **Test Environment**: Node.js with SQLite in-memory database
- **Environment Variables**: 
  - `NODE_ENV=test`
  - `DB_ENABLED=true`
  - `PORT=3002`

### Test Types

1. **Unit Tests**
   - Location: `src/**/*.spec.ts`
   - Focus: Individual component testing
   - Mocking: Heavy use of Jest mocks

2. **Integration Tests**
   - Location: `test/integration/*.spec.ts`
   - Focus: End-to-end API testing
   - Database: Real SQLite instance

### Configuration Files

1. **Jest Configuration** (`jest.config.js`)
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  }
};
```

2. **Test Setup** (`test/jest.setup.ts`)
```typescript
// Database configuration
if (process.env.DB_ENABLED === 'true') {
  dataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
  });
}

// Validation configuration
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      const messages = {};
      errors.forEach(err => {
        messages[err.property] = Object.values(err.constraints)[0];
      });
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: messages
      });
    }
  })
);
```

## Test Structure

### Integration Tests (`test/integration/`)

1. **Task Controller Tests** (`task.integration.spec.ts`)
   - Full CRUD operation testing
   - Database state verification
   - HTTP response validation
   - Error handling scenarios
   - Example:
   ```typescript
   describe('TaskController (Integration)', () => {
     it('should create a task', async () => {
       const response = await request(app.getHttpServer())
         .post('/tasks')
         .send(validTaskData)
         .expect(201);
       
       expect(response.body).toHaveProperty('id');
       // Verify database state
       const savedTask = await taskRepository.findOne(response.body.id);
       expect(savedTask).toBeDefined();
     });
   });
   ```

### Unit Tests

1. **Task Service Tests** (`src/tasks/task.service.spec.ts`)
   - Business logic validation
   - Error handling
   - Mock repository interactions
   - Example:
   ```typescript
   describe('TaskService', () => {
     it('should throw when task not found', async () => {
       jest.spyOn(repository, 'findOne').mockResolvedValue(null);
       await expect(service.findOne('non-existent'))
         .rejects
         .toThrow(NotFoundException);
     });
   });
   ```

2. **Task Controller Tests** (`src/tasks/task.controller.spec.ts`)
   - Route handler testing
   - Request/Response processing
   - Service layer mocking
   - Example:
   ```typescript
   describe('TaskController', () => {
     it('should return tasks list', async () => {
       const result = [mockTask];
       jest.spyOn(service, 'findAll').mockResolvedValue(result);
       expect(await controller.findAll()).toBe(result);
     });
   });
   ```

## Current Test Status

### Passing Tests

- Task creation with valid data
- Task listing (all tasks)
- Task retrieval by ID
- Task soft deletion
- Error handling for non-existent tasks
- Basic validation tests

### Skipped Tests (Need Fixing)

1. **Invalid Task Data Validation** (POST /tasks)
   - Issue: Validation pipe configuration needs improvement
   - Location: `test/integration/task.integration.spec.ts`
   - Fix: Update validation pipe configuration
   ```typescript
   // TODO: Update validation pipe to handle:
   // - Invalid data types
   // - Missing required fields
   // - Extra fields
   ```

2. **Duplicate Task ID Handling** (POST /tasks)
   - Issue: Duplicate ID error handling
   - Location: `src/tasks/task.service.ts`
   - Fix: Add unique constraint handling
   ```typescript
   // TODO: Implement:
   // - Unique constraint check
   // - Custom error message
   // - Proper status code (409 Conflict)
   ```

3. **Task Update** (PATCH /tasks/:id)
   - Issue: Update logic needs refinement
   - Location: `src/tasks/task.service.ts`
   - Fix: Improve update logic
   ```typescript
   // TODO: Implement:
   // - Partial updates
   // - Validation of updated fields
   // - Proper error handling
   ```

4. **Task Restore** (POST /tasks/:id/restore)
   - Issue: Incorrect HTTP status code
   - Location: `src/tasks/task.controller.ts`
   - Fix: Update response handling
   ```typescript
   // TODO: Implement:
   // - Correct status code (204)
   // - Proper error handling
   // - Validation of restore state
   ```

## Development Workflow

### Database Inspection

During testing, you can inspect the database state using the Dockerized Adminer instance:

1. Start the database viewer:
```bash
docker-compose up adminer
```

2. Access Adminer at http://localhost:8080
   - System: SQLite3
   - Database: /data/tasks.db
   - No credentials required

3. Useful for:
   - Verifying test data persistence
   - Debugging database state
   - Executing custom queries
   - Checking table structures

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test/file.spec.ts

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run tests with verbose output
npm test -- --verbose
```

### Debugging Tests

1. **VSCode Launch Configuration**
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

2. **Using Node.js Inspector**
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Code Coverage

Coverage reports are generated in the `coverage` directory:
- HTML report: `coverage/lcov-report/index.html`
- JSON report: `coverage/coverage-final.json`
- Console summary after test run

Target coverage metrics:
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## Best Practices

### 1. Test Isolation
- Reset database state between tests
- Use `beforeEach` and `afterEach` hooks
- Avoid test interdependencies
```typescript
beforeEach(async () => {
  await repository.clear();
});
```

### 2. Assertions
- Use specific assertions
- Check both response and database state
- Include error messages
```typescript
expect(response.status).toBe(201);
expect(response.body).toMatchObject({
  title: expect.any(String),
  description: expect.any(String)
});
```

### 3. Error Handling
- Test both success and error paths
- Verify error messages and codes
- Check error response structure
```typescript
try {
  await service.method();
  fail('Should throw error');
} catch (error) {
  expect(error).toBeInstanceOf(NotFoundException);
  expect(error.message).toBe('Expected error message');
}
```

### 4. Database State Verification
- Check data persistence
- Verify soft deletes
- Confirm data integrity
```typescript
const savedEntity = await repository.findOne(id);
expect(savedEntity).toBeDefined();
expect(savedEntity.deletedAt).toBeNull();
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
```

### Pre-commit Hooks

Using husky for pre-commit validation:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test"
    }
  }
}
```

## Known Issues and TODOs

### 1. Validation Issues
- Improve invalid data handling
- Add specific error messages
- Implement custom validators

### 2. HTTP Status Codes
- Align with REST standards
- Document response codes
- Add response examples

### 3. Database Operations
- Add transaction support
- Improve constraint handling
- Optimize queries

### 4. Test Coverage
- Add edge cases
- Improve error scenarios
- Add performance tests

## Contributing

1. Write tests for new features
2. Maintain or improve coverage
3. Follow naming conventions
4. Document test cases
5. Review test results

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [TypeORM Testing](https://typeorm.io/#/unit-testing)
- [Supertest Documentation](https://github.com/visionmedia/supertest#readme) 