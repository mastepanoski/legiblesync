# LegibleSync

What You See Is What It Does - A framework for building legible software through concepts and synchronizations.

*Note: This is WYSIWID (What You See Is What It Does), not to be confused with WYSIWYG (What You See Is What You Get).*

## Overview

This repository implements the "What You See Is What It Does" (WYSIWID) architectural pattern. The goal is to create highly legible and maintainable software systems by separating business logic into independent **Concepts** and orchestrating their interactions through declarative **Synchronizations**.

The framework is built as a TypeScript monorepo and includes the core engine, a console example, and an Express.js example.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/maurostepanoski/legiblesync.git
    cd legiblesync
    ```

2. **Install dependencies:**
    This project uses npm workspaces to manage the monorepo. Install all dependencies:
    ```bash
    npm install
    ```

### Running the Examples

You can run the included examples from the root directory:

- **Console Example:**
    ```bash
    npm run dev:console
    ```
    This demonstrates a complete user registration flow, including validation, JWT generation, and state persistence, all logged to the console.

- **Express.js Example:**
    ```bash
    npm run dev:express
    ```
    This starts a REST API server on `http://localhost:3000` and demonstrates how to integrate LegibleSync in a web application context.

## Core Concepts

The WYSIWID pattern is built on three main components:

### 1. Concepts

A **Concept** is a self-contained module that encapsulates a piece of business logic and its state. It's like a small, independent service focused on a single responsibility.

- **State**: Each concept manages its own internal state.
- **Actions**: Concepts expose an `execute` function that takes an `action` object. This is the only way to interact with a concept and change its state.

Example concepts from the examples include `User`, `Article`, `Password`, and `JWT`.

### 2. Synchronizations

**Synchronizations** are declarative rules that define how concepts interact. They are the "glue" that connects the independent concepts into a functioning application.

A synchronization consists of one or more `SyncRule` objects, each with two parts:

- `when`: A pattern that matches against actions dispatched to the engine. It can match on `concept`, `action`, and `status`.
- `then`: A function that receives the matched action and can dispatch new actions to other concepts.

This declarative approach makes the system's behavior explicit and easy to follow. Instead of calling other services directly, a concept simply performs its action, and the synchronization rules determine what happens next.

### 3. The LegibleEngine

The `LegibleEngine` is the heart of the framework. Its responsibilities are:

- **Registering Concepts and Synchronizations**: You tell the engine which concepts and sync rules to use.
- **Dispatching Actions**: The engine receives an initial action and sends it to the target concept.
- **Triggering Synchronizations**: After a concept executes an action, the engine checks all registered `SyncRule`s. If a rule's `when` clause matches the completed action, its `then` clause is executed.
- **Managing State**: The engine holds the state of all registered concepts.

## Use Cases and Best Practices

LegibleSync is versatile for building maintainable systems. Here are key use cases and best practices:

### Core Business Logic with Syncs
- **Use Case**: Orchestrate primary business flows, such as user registration, order processing, or data validation.
- **Best Practice**: Use syncs for direct, synchronous interactions between concepts. For example, after `User.register`, trigger `Password.set` and `JWT.generate` to complete the registration flow.
- **Why?**: Syncs ensure explicit, traceable dependencies within the engine, making the system's behavior legible and testable.

### Side Effects and Decoupling with EventBus
- **Use Case**: Handle asynchronous side effects like notifications, analytics, logging, or integrations with external systems.
- **Best Practice**: Use the EventBus for decoupling. Publish events after key actions (e.g., `user.registered`), and let external subscribers handle them without affecting the main flow.
- **Why?**: Syncs can trigger side effects, but EventBus provides better decoupling, resilience, and scalability. Errors in event handlers don't break the core flow.
- **Example**: In [`example-eda`](./packages/example-eda), syncs handle business logic (e.g., inventory checks), while EventBus publishes events for analytics and notifications. This follows an event-driven architecture, allowing plugins to subscribe to events independently.

### General Guidelines
- **Separation of Concerns**: Keep syncs focused on business logic; use EventBus for cross-cutting concerns.
- **Testing**: Syncs are easier to unit-test due to their synchronous nature; EventBus requires integration tests for subscribers.
- **Scalability**: For high-volume systems, offload event processing to queues or microservices.
- **Avoid Overuse**: Don't use syncs for everything—reserve EventBus for truly decoupled effects to maintain legibility.

See [`example-eda`](./packages/example-eda) for a full event-driven implementation.

## How It Works

1. **Initialization**: The `LegibleEngine` is instantiated with a set of concepts and synchronization rules.
2. **Initial Action**: An external trigger (like an HTTP request or a CLI command) creates an initial `action` object and sends it to the engine using `engine.dispatch()`.
3. **Concept Execution**: The engine finds the concept targeted by the action (e.g., `User`) and calls its `execute` method with the action. The concept performs its logic and returns a result (e.g., `{ status: 'SUCCESS', data: newUser }`).
4. **Synchronization Matching**: The engine takes the result of the execution and checks it against all `SyncRule`s.
5. **Triggering New Actions**: For every matching rule, the engine executes the `then` function, which typically dispatches new actions. For example, a successful user registration might trigger actions to the `JWT` concept (to create a token) and the `Persistence` concept (to save the user).
6. **Completion**: The flow continues until no more actions are dispatched. The engine returns the result of the last executed action.

## Project Structure

The project is a Lerna monorepo with the following high-level structure:

```
.
├── packages/
│   ├── core/               # The core LegibleSync framework
│   ├── example-console/    # A command-line application example
│   └── example-express/    # An Express.js web server example
├── docs/                   # Project documentation
└── ...                     # Other configuration files and scripts
```

## Development

### Available Scripts

These commands should be run from the root of the monorepo:

- `npm run build`: Build all packages.
- `npm run test`: Run tests for all packages.
- `npm run lint`: Lint all packages.
- `npm run typecheck`: Run TypeScript type checking for all packages.

### Adding a New Feature

To add a new feature to one of the examples, you would typically:

1. **Create or Modify a Concept**:
    - Add a new file in the `packages/example-*/src/concepts/` directory.
    - Implement the `Concept` interface from `@legible-sync/core`.
    - Define the concept's state and the logic within its `execute` function.

2. **Create or Modify a Synchronization**:
    - Add a new file in the `packages/example-*/src/syncs/` directory.
    - Define an array of `SyncRule`s that describe how the new feature interacts with other concepts.

3. **Register with the Engine**:
    - In the main application file (e.g., `packages/example-*/src/index.ts`), import the new concept and synchronization.
    - Add them to the `LegibleEngine`'s configuration.

## Packages

- [`@legible-sync/core`](./packages/core): The core framework containing the `LegibleEngine`.
- [`@legible-sync/example-console`](./packages/example-console): A command-line application demonstrating the framework.
- [`@legible-sync/example-express`](./packages/example-express): An Express.js web server demonstrating the framework in a web context.

## Research Background

This implementation is based on the paper ["What You See Is What It Does: A Structural Pattern for Legible Software"](https://arxiv.org/html/2508.14511v2) by Eagon Meng and Daniel Jackson.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT - Copyright (c) 2025 Mauro Stepanoski