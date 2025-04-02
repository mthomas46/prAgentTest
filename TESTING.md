# Testing Documentation

## Test Setup

The project uses Jest as the testing framework with the following setup:

- **Test Environment**: Node.js with SQLite in-memory database
- **Test Types**:
  - Unit Tests: Testing individual components
  - Integration Tests: Testing API endpoints with a real database
- **Configuration**: `jest.config.js` and `test/jest.setup.ts`

## Test Structure

### Integration Tests (`test/integration/`)

1. **Task Controller Tests** (`task.integration.spec.ts`)
   - Tests all CRUD operations for tasks
   - Uses real SQLite database for data persistence
   - Includes validation and error handling tests

### Unit Tests

1. **Task Service Tests** (`test/tasks/task.service.spec.ts`)
   - Tests business logic for task management
   - Includes error handling and validation

2. **Task Controller Tests** (`test/tasks/task.controller.spec.ts`)
   - Tests controller methods in isolation
   - Uses mocked service layer

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
   - Issue: Not properly handling invalid input data
   - TODO: Improve validation pipe configuration

2. **Duplicate Task ID Handling** (POST /tasks)
   - Issue: Not properly handling duplicate IDs
   - TODO: Enhance error handling in service layer

3. **Task Update** (PATCH /tasks/:id)
   - Issue: Not properly updating task properties
   - TODO: Fix update logic in service layer

4. **Task Restore** (POST /tasks/:id/restore)
   - Issue: Not returning correct HTTP status code
   - TODO: Fix restore functionality

## Test Configuration

### Database Setup

```typescript
// test/jest.setup.ts
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
```

### Validation Setup

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: true,
    exceptionFactory: errors => {
      // Custom error messages for specific fields
    }
  })
);
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test/file.spec.ts

# Run tests with coverage
npm test -- --coverage
```

## Known Issues and TODOs

1. **Validation Issues**
   - Need to improve handling of invalid data formats
   - Add more specific error messages for each validation failure

2. **HTTP Status Codes**
   - Some endpoints return incorrect status codes
   - Need to align with REST API best practices

3. **Database Operations**
   - Improve error handling for database constraints
   - Add transaction support for complex operations

4. **Test Coverage**
   - Add more edge cases for error conditions
   - Improve coverage of validation scenarios

## Best Practices

1. **Test Isolation**
   - Each test should clean up its data
   - Use `beforeEach` to reset database state

2. **Assertions**
   - Use specific assertions for better error messages
   - Check both response and database state

3. **Error Handling**
   - Test both success and error cases
   - Verify error messages and status codes

4. **Database State**
   - Verify database state after operations
   - Use repositories to check data persistence 