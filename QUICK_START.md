# Quick Start Guide

This guide will help you get started with LegibleSync quickly.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mastepanoski/legiblesync.git
cd legiblesync
```

2. Install dependencies:
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

// Execute an action
const result = await engine.invoke('myConcept', 'increment', {}, 'flow1');
console.log(result);
```

## Next Steps

- Read the [full documentation](./README.md)
- Explore the [examples](./packages/)
- Check out the [contributing guide](./CONTRIBUTING.md)
- Learn about the research behind this pattern in [framework-design.md](./docs/framework-design.md)