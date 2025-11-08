# Event-Driven Architecture Example

This example demonstrates how to build an Event-Driven Architecture (EDA) system using LegibleSync with a plugin-based modular architecture.

## Architecture Overview

The system is composed of independent plugins that communicate through events:

- **Users Plugin**: User management and authentication
- **Products Plugin**: Product catalog management
- **Orders Plugin**: Order processing and lifecycle
- **Inventory Plugin**: Stock management and alerts
- **Notifications Plugin**: Multi-channel notifications
- **Analytics Plugin**: Event tracking and reporting

## Event Flow

```
User Registration → Welcome Email → Analytics Track
    ↓
Product Added → Inventory Update → Low Stock Alert
    ↓
Order Created → Inventory Deduct → Payment Process → Order Confirmed
    ↓
Notification Sent → Analytics Update
```

## Plugin Structure

Each plugin follows the same structure:

```
plugin-name/
├── concepts/     # Business logic components
├── syncs/        # Event-driven rules
└── index.ts      # Plugin registration
```

## Key EDA Patterns Demonstrated

### 1. Event Sourcing
- All business events are captured as ActionRecords
- Complete audit trail of system activity

### 2. CQRS (Command Query Responsibility Segregation)
- Commands: Write operations (create, update, delete)
- Queries: Read operations with filtering

### 3. Event-Driven Orchestration
- Declarative sync rules define event flows
- Automatic execution of business processes

### 4. Plugin Isolation
- Each plugin is independently deployable
- Loose coupling through event contracts

## Running the Example

```bash
cd packages/example-eda
npm run dev
```

This will start the EDA system and demonstrate various event flows.