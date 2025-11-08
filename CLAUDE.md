# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LegibleSync is a TypeScript framework implementing the "What You See Is What It Does" (WYSIWID) architectural pattern from the research paper by Eagon Meng and Daniel Jackson. This is NOT a WYSIWYG editor - it's a software architecture pattern that separates business logic into independent **Concepts** and declarative **Synchronizations**.

## Monorepo Structure

This is a Lerna-managed monorepo with three packages:

- `packages/core` - The LegibleEngine and core framework types
- `packages/example-console` - Console-based demo showing the framework in action
- `packages/example-express` - Express.js web server implementation (planned/in progress)

## Essential Commands

### Development Workflow

```bash
# Root-level commands (run these from repository root)
npm run build              # Build all packages with Lerna
npm run test               # Run tests in all packages
npm run lint               # Lint all packages
npm run lint:md            # Lint markdown files
npm run typecheck          # Type-check all packages

# Run examples
npm run dev:console        # Run console example with ts-node
npm run dev:express        # Run Express example

# Package management
npm run bootstrap          # Bootstrap packages (install dependencies)
npm run clean              # Clean all packages

# Per-package commands (run from packages/core, packages/example-console, etc.)
npm run build              # Compile TypeScript to dist/
npm run dev                # Watch mode compilation
npm test                   # Run Jest tests
npm run lint               # Run ESLint
npm run typecheck          # Type check without emitting files
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific package
cd packages/core && npm test

# Run single test file
cd packages/core && npx jest __tests__/Engine.test.ts
```

## Core Architecture

### The LegibleEngine

The heart of the framework is `packages/core/src/engine/Engine.ts`. It orchestrates:

1. **Concept Registration** - Register independent business logic modules
2. **Sync Registration** - Register declarative synchronization rules
3. **Action Invocation** - Execute concept actions and track them as ActionRecords
4. **Sync Triggering** - Automatically fire sync rules when patterns match

Key methods:
- `registerConcept(name, impl)` - Register a concept
- `registerSync(sync)` - Register a sync rule
- `invoke(concept, action, input, flow)` - Execute an action (automatically triggers syncs)
- `getActionsByFlow(flow)` - Retrieve all actions for a given flow

### Concepts

Concepts are independent modules implementing the `ConceptImpl` interface:

```typescript
type ConceptImpl = {
  state: ConceptState;  // Internal state (Map, Set, or plain objects)
  execute(action: string, input: Record<string, any>): Promise<Record<string, any>>;
};
```

**Important**: Concepts should NOT call other concepts directly. All orchestration happens through Synchronizations.

Example: `packages/example-console/src/concepts/User.ts`

### Synchronizations

Sync rules are declarative patterns that define "when X happens, do Y":

```typescript
type SyncRule = {
  name: string;
  when: Pattern[];  // Conditions to match (all must match)
  then: {           // Actions to execute
    concept: string;
    action: string;
    input: Record<string, any>;  // Use ?variable for bindings
  }[];
};
```

**Variable Binding**: In sync rules, use `?variableName` to reference values from matched actions:
- `?user` - Extracts `user` from input or output
- `?body.password` - Extracts nested values
- `?user.profile.name` - Supports deep nesting

Example: `packages/example-console/src/syncs/registration.sync.ts`

### Infinite Loop Prevention

The engine prevents infinite loops through `syncTriggering` flag - actions triggered BY syncs don't trigger more syncs. This is critical to the architecture.

## TypeScript Configuration

- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Output: `dist/` directory
- Source maps and declarations generated

## Testing Practices

Tests use Jest with ts-jest preset:
- Test files: `__tests__/**/*.test.ts`
- Mock concepts using Jest mocks
- Test sync rules by verifying concept execution
- Always test infinite loop prevention when creating circular sync rules

Key testing pattern from `packages/core/__tests__/Engine.test.ts`:
```typescript
const mockConcept: ConceptImpl = {
  state: {},
  execute: jest.fn().mockResolvedValue({ result: 'success' })
};
engine.registerConcept('testConcept', mockConcept);
```

## Pre-commit Hooks

Husky is configured to run `lint-staged` on commit:
- TypeScript files: ESLint fix + typecheck
- Markdown files: markdownlint fix

## Creating New Concepts

1. Create file in `packages/example-*/src/concepts/YourConcept.ts`
2. Implement `ConceptImpl` interface
3. Define state structure (use Map/Set for uniqueness constraints)
4. Implement `execute()` with action handling
5. Register in main index file: `engine.registerConcept("YourConcept", YourConcept)`

**Critical**: Never invoke other concepts directly in execute() - use syncs instead.

## Creating New Sync Rules

1. Create file in `packages/example-*/src/syncs/yourfeature.sync.ts`
2. Export array of `SyncRule[]`
3. Define `when` patterns (all must match)
4. Define `then` actions with variable bindings
5. Register in main: `yourfeatureSyncs.forEach(s => engine.registerSync(s))`

**Pattern Matching**: Syncs match on:
- Concept name
- Action name
- Input values (partial match)
- Output values (partial match)

## Flow Tracking

Every action requires a `flow` UUID for tracking related actions. Flows enable:
- Auditing action sequences
- Debugging sync chains
- Understanding causality

Use `engine.getActionsByFlow(flowId)` to retrieve all actions in a flow.

## Dependencies

Core has minimal dependencies (only `uuid`). Peer dependencies:
- `bcrypt` - Password hashing (optional)
- `jsonwebtoken` - JWT handling (optional)
- `rdflib` - RDF/SPARQL persistence (optional)

These are optional because concepts can be implemented without them.

## Important Constraints

1. **No Direct Concept-to-Concept Calls** - Always use syncs
2. **Concepts Must Be Independent** - Should work in isolation
3. **Syncs Are Declarative** - No imperative orchestration logic
4. **Action Records Are Immutable** - Once created, they're historical facts
5. **One Sync Pass Per Invoke** - Prevents infinite triggering

## WYSIWID vs WYSIWYG

This is "What You See Is What It Does" (legibility through declarative rules), NOT "What You See Is What You Get" (visual editing). Don't confuse the acronyms.
