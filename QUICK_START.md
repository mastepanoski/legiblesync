# Quick Start Guide

This guide will help you get started with LegibleSync quickly.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Installation

- Clone the repository:
```bash
git clone https://github.com/mastepanoski/legiblesync.git
cd legiblesync
```

- Install dependencies:
```bash
npm install
```

## Running Examples

### Console Example

The console example demonstrates the core concepts and synchronizations.

```bash
cd packages/example-console
npm run dev
```

This will start an interactive console where you can execute concepts and see synchronizations in action.

### Express.js Example

The Express example shows how to integrate LegibleSync with a web server.

```bash
cd packages/example-express
npm run dev
```

Then visit `http://localhost:3000` to interact with the API.

## Core Concepts

### Creating a Concept

Concepts are independent modules with state and actions:

```typescript
import { ConceptImpl } from '@legible-sync/core';

const myConcept: ConceptImpl = {
  state: { counter: 0 },
  execute: async (action: string, input: any) => {
    switch (action) {
      case 'increment':
        this.state.counter++;
        return { count: this.state.counter };
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
};
```

### Registering a Sync Rule

Sync rules define when and how concepts interact:

```typescript
import { SyncRule } from '@legible-sync/core';

const mySync: SyncRule = {
  name: 'counterSync',
  when: [{
    concept: 'counter',
    action: 'increment',
    output: { count: 5 }
  }],
  then: [{
    concept: 'notifier',
    action: 'notify',
    input: { message: 'Counter reached 5!' }
  }]
};
```

### Using the Engine

```typescript
import { LegibleEngine } from '@legible-sync/core';

const engine = new LegibleEngine();

engine.registerConcept('myConcept', myConcept);
engine.registerSync(mySync);

// Execute an action (async)
const result = await engine.invoke('myConcept', 'increment', {}, 'flow1');
console.log(result);
```

### Asynchronous Actions Example

Concepts can have asynchronous actions:

```typescript
const asyncConcept: ConceptImpl = {
  state: { data: null },
  async execute(action: string, input: any) {
    if (action === 'fetchData') {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.state.data = { fetched: true, ...input };
      return this.state.data;
    }
    throw new Error(`Unknown action: ${action}`);
  }
};
```

### Event-Driven Architecture Example

Sync rules create event-driven flows. When an action executes, matching syncs automatically trigger:

```typescript
// Concept A
const conceptA: ConceptImpl = {
  state: {},
  async execute(action: string, input: any) {
    if (action === 'startProcess') {
      console.log('Process started');
      return { processId: '123' };
    }
  }
};

// Concept B
const conceptB: ConceptImpl = {
  state: {},
  async execute(action: string, input: any) {
    if (action === 'processData') {
      console.log('Processing data:', input);
      return { processed: true };
    }
  }
};

// Sync rule: When A starts process, trigger B to process data
const eventDrivenSync: SyncRule = {
  name: 'processFlow',
  when: [{
    concept: 'A',
    action: 'startProcess',
    output: { processId: '*' } // Match any processId
  }],
  then: [{
    concept: 'B',
    action: 'processData',
    input: { data: '?processId' } // Pass processId as data
  }]
};

// Register and execute
engine.registerConcept('A', conceptA);
engine.registerConcept('B', conceptB);
engine.registerSync(eventDrivenSync);

// This will automatically trigger B's processData after A's startProcess
await engine.invoke('A', 'startProcess', {}, 'flow1');
```

## Next Steps

- Read the [full documentation](./README.md)
- Explore the [examples](./packages/)
- Check out the [contributing guide](./CONTRIBUTING.md)
- Learn about the research behind this pattern in [framework-design.md](./docs/framework-design.md)