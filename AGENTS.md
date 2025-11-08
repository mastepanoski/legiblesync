# Agent Guidelines for WYSIWID Legible Software

## Build/Lint/Test Commands

### Core Package (@legible-sync/core)
- **Build**: `cd packages/core && npm run build` - Compiles TypeScript to JavaScript
- **Development**: `cd packages/core && npm run dev` - Runs with file watching using ts-node
- **Type Check**: `cd packages/core && npm run typecheck` - TypeScript type checking without emission
- **Lint**: `cd packages/core && npm run lint` - ESLint code quality checks
- **Test**: `cd packages/core && npm test` - Run all Jest tests
- **Single Test**: `cd packages/core && npm test -- --testNamePattern="test name"` - Run specific test

### Console Example
- **Build**: `cd packages/example-console && npm run build`
- **Development**: `cd packages/example-console && npm run dev`
- **Type Check**: `cd packages/example-console && npm run typecheck`
- **Lint**: `cd packages/example-console && npm run lint`
- **Test**: `cd packages/example-console && npm test`

### Express.js Example
- **Build**: `cd packages/example-express && npm run build`
- **Development**: `cd packages/example-express && npm run dev`
- **Production**: `cd packages/example-express && npm start`
- **Type Check**: `cd packages/example-express && npm run typecheck`
- **Lint**: `cd packages/example-express && npm run lint`
- **Test**: `cd packages/example-express && npm test`

### Project-wide
- **Generate Changelog**: `npx conventional-changelog -p angular -i CHANGELOG.md -s` - Updates CHANGELOG.md from conventional commits

## Code Style Guidelines

### TypeScript Configuration
- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Source maps and declarations enabled

### Imports
- Use ES6 imports with named imports
- Group imports: external libraries first, then internal modules
- Sort imports alphabetically within groups

### Naming Conventions
- **Files**: PascalCase for concepts (User.ts), camelCase for utilities
- **Classes**: PascalCase (SyncEngine)
- **Functions/Methods**: camelCase (execute, registerConcept)
- **Variables**: camelCase (userId, articleTitle)
- **Constants**: UPPER_SNAKE_CASE (JWT_SECRET)
- **Types/Interfaces**: PascalCase (ActionRecord, ConceptImpl)

### Error Handling
- Use async/await with try/catch blocks
- Throw descriptive Error objects with clear messages
- Handle errors at appropriate abstraction levels
- Log errors with context information

### Code Structure
- Concepts: Independent modules with state and execute methods
- Engine: Central orchestration with invoke and triggerSyncs
- Syncs: Declarative rules defining when/then relationships
- Keep functions small and focused on single responsibilities

### Testing
- Use Jest for unit and integration tests with TypeScript support (ts-jest)
- Configure Jest with `jest.config.js` in each package
- Test concepts independently
- Mock external dependencies
- Test sync rule triggering scenarios, including loop prevention

### Security
- Hash passwords with bcrypt (10 rounds minimum)
- Use JWT with proper secret keys and expiration
- Validate all inputs and sanitize outputs
- Never log sensitive information

## Release Process

- Follow [Semantic Versioning (SemVer)](https://semver.org/) for version numbers
- Use [Conventional Commits](https://conventionalcommits.org/) for commit messages
- Generate changelog automatically using `conventional-changelog`
- Update version in package.json files
- Create git tags for releases