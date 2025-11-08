# @legible-sync/core

[![npm version](https://badge.fury.io/js/%40legible-sync%2Fcore.svg)](https://badge.fury.io/js/%40legible-sync%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

Core framework for WYSIWID Legible Software - implementing the "What You See Is What It Does" architectural pattern.

## Installation

```bash
npm install @legible-sync/core
```

## Quick Start

```typescript
import { LegibleEngine, Concept } from '@legible-sync/core';

// Define a concept
class UserConcept implements Concept {
  name = 'User';
  state = { users: new Map() };

  async execute(action: string, input: any) {
    if (action === 'register') {
      // Implementation
      return { userId: '123' };
    }
  }
}

// Create engine and register concept
const engine = new LegibleEngine();
engine.registerConcept(new UserConcept());

// Execute actions
const result = await engine.invoke('User', 'register', {
  username: 'alice',
  email: 'alice@example.com'
}, 'flow-1');

console.log(result); // { userId: '123' }
```

## Architecture

### Concepts
Independent modules that encapsulate state and behavior:

```typescript
interface Concept {
  name: string;
  state: Record<string, any>;
  execute(action: string, input: any): Promise<any>;
}
```

### Synchronizations
Declarative rules that define when concepts interact:

```typescript
interface SyncRule {
  name: string;
  when: Pattern[];
  where?: Query;
  then: Invocation[];
}
```

### Engine
Runtime that orchestrates concept execution and synchronization triggering.

## API Reference

### LegibleEngine

#### `registerConcept(concept: Concept)`
Register a concept with the engine.

#### `registerSync(sync: SyncRule)`
Register a synchronization rule.

#### `invoke(concept: string, action: string, input: any, flowId: string)`
Execute an action on a concept within a flow.

#### `getFlowActions(flowId: string)`
Get all actions executed in a flow for auditing.

## Research Foundation

This framework implements the research from:

> **"What You See Is What It Does: A Structural Pattern for Legible Software"**
>
> Eagon Meng, Daniel Jackson
>
> [arXiv:2508.14511](https://arxiv.org/html/2508.14511v2)

## License

MIT License - Copyright (c) 2025 Mauro Stepanoski

## Links

- [GitHub Repository](https://github.com/maurostepanoski/wysiwyg-legible-software)
- [Documentation](https://github.com/maurostepanoski/wysiwyg-legible-software/tree/main/docs)
- [Examples](https://github.com/maurostepanoski/wysiwyg-legible-software/tree/main/packages)