# WYSIWID Legible Software Documentation

WYSIWID Legible Software is a framework that implements the "What You See Is What It Does" architectural pattern for creating legible, modular software systems.

## Architecture

### Core Principles

1. **Direct Correspondence**: Code structure matches system behavior exactly
2. **Modularity**: Concepts are completely independent
3. **Incrementality**: Easy to add/modify without breaking existing functionality
4. **Transparency**: All interactions are explicit and traceable

### Components

- **Concepts**: Independent business logic modules
- **Synchronizations**: Declarative rules for concept interactions
- **Engine**: Runtime orchestration system
- **Flows**: Execution traces for auditing and debugging

## Getting Started

### Installation

```bash
# Install the core framework
npm install @legible-sync/core

# Or install examples
npm install @legible-sync/example-console
npm install @legible-sync/example-express
```

### Basic Usage

```typescript
import { LegibleEngine } from '@legible-sync/core';

// Create engine
const engine = new LegibleEngine();

// Register concepts and syncs
// ... (see examples)

// Execute actions
const result = await engine.invoke('ConceptName', 'actionName', input, flowId);
```

## Examples

### Console Example
Simple command-line application demonstrating user registration and auditing.

```bash
cd packages/example-console
npm install
npm start
```

### Express Example
REST API server with authentication, articles, and social features.

```bash
cd packages/example-express
npm install
npm start
```

## API Reference

### LegibleEngine

#### Constructor
```typescript
new LegibleEngine()
```

#### Methods

##### `registerConcept(concept: Concept)`
Register a concept with the engine.

##### `registerSync(sync: SyncRule)`
Register a synchronization rule.

##### `invoke(concept: string, action: string, input: any, flowId: string): Promise<any>`
Execute an action on a concept within a flow.

##### `getFlowActions(flowId: string): ActionRecord[]`
Get all actions executed in a specific flow.

##### `getAllConcepts(): string[]`
Get names of all registered concepts.

##### `getAllSyncs(): string[]`
Get names of all registered synchronizations.

### Concept Interface

```typescript
interface Concept {
  name: string;
  state: Record<string, any>;
  execute(action: string, input: any): Promise<any>;
}
```

### SyncRule Interface

```typescript
interface SyncRule {
  name: string;
  when: Pattern[];
  where?: Query;
  then: Invocation[];
}
```

## Advanced Topics

### Custom Concepts

```typescript
class MyConcept implements Concept {
  name = 'MyConcept';
  state = { data: new Map() };

  async execute(action: string, input: any) {
    switch (action) {
      case 'create':
        // Implementation
        return { id: '123' };
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
}
```

### Synchronization Rules

```typescript
const mySync: SyncRule = {
  name: 'MySync',
  when: [
    {
      concept: 'SourceConcept',
      action: 'someAction'
    }
  ],
  then: [
    {
      concept: 'TargetConcept',
      action: 'anotherAction',
      input: { param: '?outputValue' }
    }
  ]
};
```

### Flow Auditing

```typescript
// Get all actions in a flow
const actions = engine.getFlowActions('my-flow');

// Analyze execution
actions.forEach(action => {
  console.log(`${action.concept}.${action.action}:`, action.output);
});
```

## Research Foundation

This framework implements concepts from:

> **"What You See Is What It Does: A Structural Pattern for Legible Software"**
>
> Eagon Meng, Daniel Jackson
>
> [arXiv:2508.14511](https://arxiv.org/html/2508.14511v2)

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines.

## License

MIT License - Copyright (c) 2025 Mauro Stepanoski