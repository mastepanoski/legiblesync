# Project Overview

This project is a TypeScript monorepo implementing the "What You See Is What It Does" (WYSIWID) architectural pattern. The goal of this pattern is to create legible and maintainable software systems by separating business logic into independent "Concepts" and orchestrating their interactions through declarative "Synchronizations".

The project is structured as a Lerna monorepo with the following packages:

- `@legible-sync/core`: The core framework containing the `LegibleEngine`.
- `@legible-sync/example-console`: A command-line application demonstrating the usage of the framework.
- `@legible-sync/example-express`: An Express.js web server demonstrating the framework in a web context.

The core of the framework is the `LegibleEngine`, which manages the registration of concepts and synchronizations, and orchestrates the execution of actions and the triggering of synchronizations.

## Building and Running

The project uses `npm` and `lerna` for dependency management and running scripts.

### Key Commands

- **Install dependencies:**
    ```bash
    npm install
    ```
- **Build all packages:**
    ```bash
    npm run build
    ```
- **Run tests:**
    ```bash
    npm run test
    ```
- **Run the console example:**
    ```bash
    npm run dev:console
    ```
- **Run the Express.js example:**
    ```bash
    npm run dev:express
    ```
- **Lint the codebase:**
    ```bash
    npm run lint
    ```
- **Type-check the codebase:**
    ```bash
    npm run typecheck
    ```

## Development Conventions

### Concepts

Concepts are self-contained modules that encapsulate a piece of business logic and its state. They should implement the `ConceptImpl` interface from `@legible-sync/core`. Each concept has a `state` object and an `execute` function that handles actions.

### Synchronizations

Synchronizations are declarative rules that define how concepts interact. They are defined as an array of `SyncRule` objects. Each rule has a `when` clause that specifies a pattern to match against actions, and a `then` clause that specifies which actions to invoke when the pattern is matched.

### Adding New Features

To add a new feature, you would typically:

1. Create or modify a **Concept** to implement the core logic.
2. Create or modify a **Synchronization** to define how the new feature interacts with other concepts.
3. Register the new or modified concepts and synchronizations with the `LegibleEngine`.
