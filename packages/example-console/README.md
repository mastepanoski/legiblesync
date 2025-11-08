# @legible-sync/example-console

[![npm version](https://badge.fury.io/js/%40legible-sync%2Fexample-console.svg)](https://badge.fury.io/js/%40legible-sync%2Fexample-console)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Console-based example application demonstrating the WYSIWID Legible Software framework.

## Installation

```bash
npm install @legible-sync/example-console
```

## Running the Example

```bash
npm start
```

This will demonstrate:
- User registration with validation
- Synchronization rules execution
- Flow auditing and tracing
- State persistence

## What It Does

The console example shows a complete user registration flow:

1. **User Registration**: Creates a new user account
2. **Password Validation**: Ensures password meets requirements
3. **JWT Generation**: Creates authentication tokens
4. **State Persistence**: Saves data using RDF/SPARQL patterns
5. **Flow Auditing**: Shows complete execution trace

## Code Structure

```
src/
├── concepts/          # Business logic modules
│   ├── User.ts       # User management
│   ├── Password.ts   # Password handling
│   ├── JWT.ts        # Token generation
│   └── Persistence.ts # RDF storage
├── syncs/            # Synchronization rules
│   └── registration.sync.ts
├── utils/            # Utilities
│   └── audit.ts      # Flow auditing
└── index.ts          # Main application
```

## Learning Points

- How to define and register concepts
- Creating synchronization rules
- Flow management and auditing
- State persistence patterns
- Error handling and validation

## Related Packages

- [@legible-sync/core](https://www.npmjs.com/package/@legible-sync/core) - Framework core
- [@legible-sync/example-express](https://www.npmjs.com/package/@legible-sync/example-express) - REST API example

## License

MIT License - Copyright (c) 2025 Mauro Stepanoski

## Links

- [GitHub Repository](https://github.com/maurostepanoski/wysiwyg-legible-software)
- [Framework Documentation](https://github.com/maurostepanoski/wysiwyg-legible-software/tree/main/packages/legible-sync)