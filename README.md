# LegibleSync

What You See Is What It Does - A framework for building legible software through concepts and synchronizations.

## Overview

This repository implements the "What You See Is What It Does" architectural pattern for creating legible software systems. The pattern separates business logic into independent **Concepts** and declarative **Synchronizations** that orchestrate interactions between concepts.

## Architecture Overview

The "What You See Is What It Does" pattern consists of:

- **Concepts**: Independent modules that encapsulate state and behavior
- **Synchronizations**: Declarative rules that trigger actions when certain conditions are met
- **Engine**: The runtime that executes concepts and manages synchronizations

## Project Structure

```
packages/
├── core/                    # Core framework
│   ├── src/
│   │   ├── engine/         # Central synchronization engine
│   │   │   ├── Engine.ts   # Main synchronization engine
│   │   │   └── types.ts    # TypeScript type definitions
│   │   └── index.ts        # Main exports
│   └── __tests__/          # Unit tests
├── example-console/        # Console-based example
│   └── src/
│       ├── concepts/       # Business logic modules
│       └── syncs/          # Declarative synchronization rules
└── example-express/        # Express.js web server example
    └── src/
        ├── concepts/
        └── syncs/
```

## Quick Start

See [QUICK_START.md](./QUICK_START.md) for a quick introduction.

## Packages

- [`@legible-sync/core`](./packages/core) - Core framework
- [`@legible-sync/example-console`](./packages/example-console) - Console example
- [`@legible-sync/example-express`](./packages/example-express) - Express.js example

## Concepts

Each concept is an independent module with its own state and actions:

### Core Concepts (Examples)

- **User**: Handles user registration and management
- **Article**: Manages blog posts/articles with automatic slug generation
- **Favorite**: Manages user favorites for articles
- **Password**: Validates and stores passwords
- **JWT**: Handles JWT token generation and verification
- **Web**: Simulates HTTP request/response handling

## Synchronizations

Synchronizations are declarative rules that define when and how concepts interact:

### Example Sync Rules

- **Registration Sync**: Orchestrates user registration process
- **Article Sync**: Handles article creation with authentication

## Development

### Available Scripts

- `npm run build` - Compile TypeScript
- `npm run dev` - Run with file watching
- `npm run test` - Run tests
- `npm run lint` - Code linting
- `npm run typecheck` - Type checking

### Adding New Concepts

1. Create a new file in `src/concepts/`
2. Implement the `ConceptImpl` interface
3. Register the concept with the engine

### Adding New Sync Rules

1. Create a new file in `src/syncs/`
2. Define synchronization rules using the `SyncRule` type
3. Register the sync with the engine

## Research Background

This implementation is based on the paper ["What You See Is What It Does: A Structural Pattern for Legible Software"](https://arxiv.org/html/2508.14511v2) by Eagon Meng and Daniel Jackson.

The "What You See Is What It Does" pattern aims to make software systems more legible by:
- Separating concerns into independent concepts
- Using declarative synchronizations instead of imperative orchestration
- Making system behavior visible through explicit rules

## AI Assessment Scale

This project was developed through **co-creation with AI agents**, following the [AI Assessment Scale](https://aiassessmentscale.com/) framework.

### AI Participation Level: **4 - AI as Leader**

**How AI Contributed:**
- **Research Analysis**: AI agents analyzed the academic paper and extracted key concepts
- **Architecture Design**: Complete framework design and implementation strategy
- **Code Generation**: All TypeScript code, documentation, and examples
- **Documentation**: Complete bilingual documentation and guides
- **Quality Control**: Code review, testing strategies, and optimization

**Human Role:**
- **Strategic Direction**: Mauro Stepanoski provided project vision and requirements
- **Domain Expertise**: Validation of technical decisions and research accuracy
- **Ethical Oversight**: Ensuring responsible implementation of concepts

**Why Level 4:**
- AI led the technical implementation and creative process
- Human provided essential oversight and domain knowledge
- Result: Accelerated development with human-aligned outcomes

## Versioning

This project follows [Semantic Versioning (SemVer)](https://semver.org/).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## Author and Attribution

**Implementation by:** [Mauro Stepanoski](https://maurostepanoski.ar) with AI co-creation

**Original Research:** Eagon Meng and Daniel Jackson - ["What You See Is What It Does: A Structural Pattern for Legible Software"](https://arxiv.org/html/2508.14511v2)

## Security

See [SECURITY.md](./SECURITY.md) for security policy and best practices.

## License

MIT - Copyright (c) 2025 Mauro Stepanoski