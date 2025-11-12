# LegibleSync Roadmap

## Overview

This document consolidates the LegibleSync framework roadmap, including pending tasks, DSL improvements, and future development phases.

## Immediate Pending Tasks

### 1. Rollback Capability
- Add rollback capability in flows when a sync fails
- Discern whether it's possible to continue when part of the sync chain fails
- Implement complete rollback if all syncs should fail

### 2. DSL Improvements
- Improve the DSL based on existing examples
- Implement complete TypeScript parser for `.sync` files
- Create CLI for validation: `legiblesync sync validate file.sync`
- Generate automatic documentation from `.sync` files

### 3. Engine Enhancements
- Add capability in the engine to transpile or interpret sync files in DSL
- Support for using syncs in both DSL and JavaScript formats

## Development Phases

### Phase 1 (MVP) - 🚧 In Progress
- [x] Core Engine
- [x] Basic Concepts (Web, Auth, Storage)
- [ ] YAML DSL
- [ ] CLI Tools
- [ ] Complete DSL parser in TypeScript
- [ ] CLI for sync validation

### Phase 2 (Enterprise) - 📋 Planned
- [ ] Distributed Execution
- [ ] Advanced Queries (SPARQL integration)
- [ ] Plugin System
- [ ] Monitoring/Dashboard
- [ ] Automatic documentation generation

### Phase 3 (AI-First) - 📋 Planned
- [ ] LLM Code Generation
- [ ] Auto-optimization
- [ ] Visual Designer
- [ ] Multi-language Support
- [ ] VS Code Extension with syntax highlighting

## DSL Specification: `sync` Language

### Overview
```text
sync <Name>
when { <action-patterns> }
where { <state-queries> | bind(...) }
then { <action-invocations> }
```

- **Declarative**: "When these actions happen, where the state is so, then these actions follow"
- **Granular**: One business rule per sync
- **Readable**: What You See Is What It Does
- **LLM-Friendly**: Easy to generate with AI
- **Executable**: Runs directly

### Complete Syntax (BNF-like)
```ebnf
sync      ::= "sync" NAME NEWLINE block+
block     ::= "when" "{" pattern+ "}"
            | "where" "{" query+ "}"
            | "then" "{" invocation+ "}"

pattern   ::= CONCEPT "/" ACTION ":" "[" args? "]" "=>" "[" results? "]"
query     ::= CONCEPT ":" "{" bindings "}"
            | "bind" "(" expr "as" VARIABLE ")"
            | "optional" "{" query+ "}"

invocation ::= CONCEPT "/" ACTION ":" "[" inputs? "]"
```

### Built-in Functions for `bind()`
```ts
uuid()           → generates UUID
coalesce(a, b)   → a ?? b
slugify(text)    → "Hello World!" → "hello-world"
now()            → ISO timestamp
json(body)       → parses JSON
env("KEY")       → environment variable
```

### Key Features
- **Variables (`?var`)**: Automatic scoping throughout the sync
- **`bind()`**: Pure calculations
- **`optional {}`**: Optional JOINs (LEFT JOIN)
- **Partial Pattern Matching**: Only specify what's needed
- **Multi-Action `when`**: Waits for multiple actions in the same flow
- **Error Handling**: Match on `=> [ error: ?msg ]`
- **No Transactions**: Atomicity through order + idempotency

## LLM Integration

### Sync Generation
LLMs can generate complete syncs from natural language prompts:

```text
Generate a sync for user login that:
- Accepts POST /login with email/password
- Validates password
- Returns JWT and user profile
- Handles errors with 401
Use concepts: Web, User, Password, JWT, Profile
```

### Future Extension: Sync Macros
```sync
macro Authenticated(?method, ?path, ?action)
→ when { Web/request: [ method: ?method ; path: ?path ; token: ?token ] => [ request: ?req ]
         JWT/verify: [ token: ?token ] => [ user: ?user ] }
  then { ?action }

sync CreateArticle
use Authenticated("POST", "/articles", Article/create: [ ... ])
```

## Future Development Tools

### Planned CLI Commands
```bash
# Validate sync files
legiblesync sync validate file.sync

# Generate docs from syncs
legiblesync docs generate --from-syncs

# Transpile DSL to JS
legiblesync sync transpile file.sync --output file.js
```

### VS Code Extension
- Syntax highlighting for `.sync` files
- IntelliSense for concepts and actions
- Real-time validation
- Snippets for common patterns

## Conclusion

This roadmap establishes the path to transform LegibleSync into an enterprise-ready framework with advanced AI capabilities. Current priority is completing DSL improvements and rollback capabilities, followed by expansion toward distributed execution and deep LLM integration.