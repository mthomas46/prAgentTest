# Event System Documentation

## Overview
The event system is a robust, scalable, and performant implementation for handling events in a microservice architecture. It provides features for event publishing, subscribing, validation, compression, archiving, and monitoring.

## Core Components

### 1. Event Publishing
- **EventPublisherService**: Handles event publishing with RabbitMQ
- **EventBatchingService**: Implements batch processing for improved performance
- **RetryService**: Manages retry logic for failed event deliveries

### 2. Event Subscribing
- **EventSubscriberService**: Manages event subscriptions and processing
- **EventStoreService**: Handles event persistence and retrieval

### 3. Event Processing
- **EventValidatorService**: Validates event structure and content
- **EventCompressionService**: Handles compression of large event payloads
- **EventArchivingService**: Manages long-term event storage

### 4. Performance Optimization
- **CachingStrategyService**: Implements multiple caching strategies
- **DatabasePoolService**: Manages database connections efficiently
- **PerformanceMonitorService**: Tracks system performance metrics

## Event Patterns

### 1. Event Sourcing
- **Implementation**: Store all changes as a sequence of events
- **Benefits**: 
  - Complete audit trail
  - Time-travel debugging
  - Event replay capability
- **Use Cases**:
  - Financial transactions
  - User activity tracking
  - System state recovery

### 2. CQRS (Command Query Responsibility Segregation)
- **Implementation**: Separate read and write models
- **Benefits**:
  - Scalability
  - Performance optimization
  - Independent scaling
- **Use Cases**:
  - High-read applications
  - Complex reporting
  - Real-time analytics

### 3. Saga Pattern
- **Implementation**: Distributed transactions using events
- **Benefits**:
  - Eventual consistency
  - Fault tolerance
  - Scalability
- **Use Cases**:
  - Order processing
  - Payment systems
  - Multi-step workflows

## Caching Strategies

### Available Strategies
1. **LRU (Least Recently Used)**
   - Evicts least recently accessed items
   - Configurable TTL and maximum items
   - Implementation:
     ```typescript
     const cache = new LRUCache({
       max: 1000,
       ttl: 300000
     });
     ```

2. **LFU (Least Frequently Used)**
   - Evicts least frequently accessed items
   - Tracks access frequency
   - Implementation:
     ```typescript
     const cache = new LFUCache({
       max: 1000,
       ttl: 300000
     });
     ```

3. **FIFO (First In First Out)**
   - Evicts oldest items first
   - Simple queue-based implementation
   - Implementation:
     ```typescript
     const cache = new FIFOCache({
       max: 1000,
       ttl: 300000
     });
     ```

4. **TTL (Time To Live)**
   - Evicts items based on expiration time
   - Configurable per-item TTL
   - Implementation:
     ```typescript
     const cache = new TTLCache({
       max: 1000,
       ttl: 300000
     });
     ```

## Database Connection Pooling

### Features
- Configurable pool size and connection limits
- Connection health monitoring
- Automatic connection cleanup
- Connection statistics tracking
- Failover support

### Configuration
```typescript
{
  poolSize: number;      // Default: 10
  maxConnections: number; // Default: 100
  idleTimeout: number;   // Default: 30000ms
  connectionTimeout: number; // Default: 10000ms
}
```

## Performance Monitoring

### Metrics Collected
1. **Database Metrics**
   - Active connections
   - Idle connections
   - Waiting clients
   - Connection pool status

2. **Cache Metrics**
   - Hit/miss ratios
   - Cache size
   - Eviction rates
   - Access patterns

3. **System Metrics**
   - Memory usage
   - CPU utilization
   - Event processing rates
   - Error rates

### Monitoring Configuration
- Metrics collection interval: 60 seconds
- Maximum stored metrics: 1000
- Real-time event emission
- Historical data retention

## Event Batching

### Features
- Configurable batch size (default: 50)
- Timeout-based processing (default: 5 seconds)
- Event grouping by type
- Chunked processing for large batches
- Retry mechanism for failed batches

### Batch Processing Flow
1. Events are collected in a batch
2. Batch is processed when:
   - Batch size limit is reached
   - Timeout occurs
   - Manual flush is triggered
3. Events are grouped by type
4. Groups are processed in parallel
5. Failed events are retried

## Configuration

### Environment Variables
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=api

# Cache Configuration
CACHE_TTL=300
CACHE_MAX_ITEMS=100

# Event System Configuration
EVENT_BATCH_SIZE=50
EVENT_BATCH_TIMEOUT=5000
EVENT_ARCHIVE_THRESHOLD=90
```

## Usage Examples

### Publishing Events
```typescript
@Injectable()
export class TaskService {
  constructor(
    private readonly eventPublisher: EventPublisherService,
    private readonly eventBatching: EventBatchingService,
  ) {}

  async createTask(task: CreateTaskDto) {
    const event = {
      type: 'TASK_CREATED',
      data: task,
      source: 'task-service',
      correlationId: uuid(),
    };
    
    await this.eventBatching.addToBatch(event);
  }
}
```

### Subscribing to Events
```typescript
@Injectable()
export class NotificationService {
  constructor(private readonly eventSubscriber: EventSubscriberService) {
    this.eventSubscriber.subscribeToEvents();
  }

  @OnEvent('TASK_CREATED')
  async handleTaskCreated(event: IEvent) {
    // Handle task creation event
  }
}
```

## Error Handling

### Retry Mechanism
- Configurable retry attempts
- Exponential backoff
- Dead letter queue support
- Error logging and monitoring

### Error Types
1. **Validation Errors**
   - Invalid event structure
   - Missing required fields
   - Data type mismatches

2. **Processing Errors**
   - Database connection issues
   - Network timeouts
   - Resource exhaustion

3. **System Errors**
   - Memory pressure
   - CPU overload
   - Service unavailability

## Best Practices

1. **Event Design**
   - Keep events small and focused
   - Use clear, descriptive event types
   - Include correlation IDs for tracing
   - Version your events

2. **Performance**
   - Use appropriate batch sizes
   - Monitor cache hit rates
   - Implement proper error handling
   - Use compression for large payloads

3. **Monitoring**
   - Track event processing rates
   - Monitor error rates
   - Set up alerts for critical issues
   - Regular performance reviews

4. **Maintenance**
   - Regular cache cleanup
   - Database connection health checks
   - Performance metric analysis
   - Event archive management

## Security Considerations

1. **Event Validation**
   - Input sanitization
   - Schema validation
   - Size limits
   - Rate limiting

2. **Access Control**
   - Authentication
   - Authorization
   - Encryption
   - Audit logging

3. **Data Protection**
   - PII handling
   - Data encryption
   - Secure storage
   - Access logging

## Scaling Strategies

1. **Horizontal Scaling**
   - Multiple consumers
   - Partitioned topics
   - Load balancing
   - Service discovery

2. **Vertical Scaling**
   - Resource optimization
   - Connection pooling
   - Memory management
   - CPU utilization

3. **Hybrid Scaling**
   - Auto-scaling
   - Resource allocation
   - Performance monitoring
   - Cost optimization 