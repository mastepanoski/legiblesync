# LegibleSync: Framework for Legible Software

## Overview

LegibleSync is a framework that implements the "What You See Is What It Does" (WYSIWID) pattern proposed in the Meng and Jackson paper. Note: It is often confused with WYSIWYG (What You See Is What You Get), but this pattern is specifically WYSIWID. The framework facilitates the creation of legible, modular, and maintainable software by clearly separating **Concepts** (independent business logic) and **Synchronizations** (declarative orchestration rules).

## Core Architecture

### 1. Concept System
Each Concept is a self-contained module with:
- **State**: Persistent data of the concept
- **Actions**: Operations that modify the state
- **Specs**: Behavior declaration (LLM-friendly)

### 2. Synchronization Engine
- **Declarative DSL**: Language for defining "when/then" rules
- **Pattern Matching**: Event-based trigger system
- **Flow Management**: Complete execution traceability
- **Idempotency**: Safe execution guarantee

### 3. LLM Integration
- **Spec Generation**: Automatic concept generation from prompts
- **Sync Inference**: Rule creation from natural descriptions
- **Code Completion**: Intelligent development assistance

## Technical Implementation

### Core Engine (TypeScript)

```typescript
type Concept = {
  state: ConceptState;
  execute(action: ActionName, input: Record<string, any>): Promise<Record<string, any>>;
};

interface SyncRule {
  name: string;
  when: Pattern[];
  where?: Query;
  then: Invocation[];
}

class LegibleEngine {
  private concepts = new Map<string, Concept>();
  private syncs: SyncRule[] = [];
  private flows = new Map<string, ActionRecord[]>();

  async invoke(concept: string, action: string, input: any, flowId: string) {
    // Implementation with full traceability
  }
}
```

### DSL for Synchronizations

```yaml
# syncs/user-registration.yml
name: "HandleUserRegistration"
when:
  - concept: "Web"
    action: "request"
    input:
      method: "POST"
      path: "/users"
then:
  - concept: "Password"
    action: "validate"
    input:
      password: "?body.password"
  - concept: "User"
    action: "register"
    input:
      user: "uuid()"
      username: "?body.username"
      email: "?body.email"
```

## State and Concurrency Patterns

### 1. Stateless Pattern (Recommended for APIs)
- Each request is processed independently
- No shared state between invocations
- Perfect for HTTP APIs and serverless functions

### 2. Flow Control (The original problem, but in a new context)

   * The Problem: The mechanism that prevents infinite loops remembers which synchronizations have been triggered for an action within a flowId. If you use the same flowId for everything, a synchronization that fires once won't fire again for the same cause.
   * The Solution: Your application logic must be smarter about how it defines a "flow".
       * Example in a data processor: Each file or batch of records you process should have its own unique flowId.
       * Example in a WebSocket server: Each client message could start a new flowId, or perhaps each user "session" has its own flow.
       * Never use a generic eternal `flowId` like 'main-app-flow'.

### 3. Concurrency and Race Conditions

   * The Problem: What if two asynchronous events (e.g., two WebSocket messages arriving almost at the same time) try to invoke actions on the engine simultaneously? Since the engine modifies its internal state, you could have unpredictable results if one invocation interferes with another.
   * The Solution: You must ensure that invocations are processed in an orderly manner. A common pattern is to use a processing queue.
       1. When an event arrives, instead of calling engine.invoke() directly, you add it to a queue.
       2. A single "worker" (an async loop) processes the events from the queue one by one, in order.
       3. This ensures that each invoke completes before the next one begins, keeping the engine's state consistent and predictable.

### Comparative Table of Patterns

| Pattern | Use Cases | Key Considerations |
|---------|-----------|-------------------|
| **Stateless** | HTTP APIs, Serverless functions | - Advantage: Simple, safe, and no state management overhead |
| **Stateful** | Real-time applications, workflows | - Advantage: Shared state enables complex flows and interactions |

### Conclusion

The LegibleEngine is a powerful and flexible tool. Its "limitation" is not in its code, but in that it requires you, as a software architect, to make a conscious decision about the state pattern that best fits your application. For APIs, the stateless pattern is king. For everything else, you can use a stateful engine, as long as you take responsibility for managing it.

## Development Tools (Planned)

The following CLI tools and LLM integration features are planned for future development phases. Currently, development is done manually using the provided examples and core library.

### Planned CLI Commands

```bash
# Initialize new project
legiblesync init my-app

# Generate concept from spec
legiblesync generate concept User --from-spec user-spec.yml

# Scaffold synchronization
legiblesync generate sync user-registration

# Run with hot reload
legiblesync dev

# Build for production
legiblesync build
```

### Planned LLM Integration

```bash
# Generate concept from natural language
legiblesync ai generate-concept "A user management system with registration, login, and profile updates"

# Infer synchronizations
legiblesync ai infer-syncs --from-concept User --from-concept Auth
```

## Use Cases

### 1. Web Applications
- **Blog System**: Users, Articles, Comments with authentication
- **E-commerce**: Products, Cart, Orders with inventory management
- **Social Media**: Posts, Likes, Followers with real-time updates

### 2. Enterprise Systems
- **CRM**: Contacts, Deals, Activities with workflow automation
- **Inventory**: Products, Stock, Suppliers with reorder triggers
- **HR**: Employees, Departments, Payroll with compliance rules

### 3. IoT/Data Processing
- **Sensor Networks**: Devices, Readings, Alerts with threshold triggers
- **Data Pipelines**: Sources, Transformations, Sinks with quality checks

## Competitive Advantages

### vs. Traditional Frameworks
- **Legibility**: Explicit behavior vs. hidden imperative code
- **Modularity**: Independent concepts vs. coupled services
- **Maintainability**: Localized changes vs. global refactorings

### vs. Low-Code/No-Code
- **Total Control**: Complete source code vs. closed platforms
- **Extensibility**: Open-source framework vs. vendor lock-in
- **Performance**: Optimized for specific cases vs. one-size-fits-all

## Roadmap

### Phase 1 (MVP)
- [x] Core Engine
- [x] Basic Concepts (Web, Auth, Storage)
- [ ] YAML DSL
- [ ] CLI Tools

### Phase 2 (Enterprise)
- [ ] Distributed Execution
- [ ] Advanced Queries (SPARQL integration)
- [ ] Plugin System
- [ ] Monitoring/Dashboard

### Phase 3 (AI-First)
- [ ] LLM Code Generation
- [ ] Auto-optimization
- [ ] Visual Designer
- [ ] Multi-language Support

## Conclusion

LegibleSync represents an evolution in software development, making systems inherently legible and maintainable. By clearly separating business logic (Concepts) from orchestration (Synchronizations), the framework allows creating software that is "what you see is what it does", facilitating both human development and LLM integration.