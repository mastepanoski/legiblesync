# WYSIWYG Legible Software

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

> "What You See Is What It Does" - A Structural Pattern for Legible Software

This repository implements the WYSIWYG (What You See Is What It Does) architectural pattern for creating maintainable, legible software systems. The pattern separates business logic into independent **Concepts** and declarative **Synchronizations** that orchestrate interactions between concepts.

**Implementation by:** [Mauro Stepanoski](https://maurostepanoski.ar)  
**Based on research by:** Eagon Meng and Daniel Jackson

## 📚 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Concepts](#concepts)
- [Synchronizations](#synchronizations)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Contributing](#contributing)
- [Research](#research)
- [License](#license)

## 🎯 Overview

Traditional software architecture often mixes business logic with orchestration code, making systems hard to understand and maintain. The WYSIWYG pattern addresses this by:

- **Concepts**: Independent, self-contained modules that encapsulate state and behavior
- **Synchronizations**: Declarative rules that define when and how concepts interact
- **Engine**: A runtime that executes concepts and manages synchronizations

This separation makes software behavior visible and modifiable through explicit, declarative rules rather than implicit, imperative code.

## 🏗️ Architecture

```
src/
├── concepts/          # Independent business logic modules
│   ├── User.ts       # User management
│   ├── Article.ts    # Article/blog post management
│   ├── Favorite.ts   # Favorites functionality
│   ├── Comment.ts    # Comments system
│   ├── Password.ts   # Password validation and storage
│   ├── JWT.ts        # JWT token handling
│   ├── Web.ts        # HTTP request/response handling
│   └── Persistence.ts # RDF/SPARQL state persistence
├── engine/           # Core synchronization engine
│   ├── Engine.ts     # Main synchronization engine
│   └── types.ts      # TypeScript type definitions
├── syncs/            # Declarative synchronization rules
│   ├── registration.sync.ts  # User registration flow
│   ├── article.sync.ts       # Article creation flow
│   ├── favorite.sync.ts      # Favorites management
│   ├── comment.sync.ts       # Comments management
│   └── persistence.sync.ts   # State persistence rules
└── utils/            # Utility functions
    └── audit.ts      # Flow auditing utilities
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wysiwyg-legible-software.git
cd wysiwyg-legible-software

# Install dependencies
npm install

# Run the demo
npm start

# Run with file watching
npm run dev

# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Express.js Version

```bash
# Navigate to Express app
cd express-app

# Install dependencies
npm install

# Run the server
npm start

# The API will be available at http://localhost:3000
```

## 🎨 Concepts

Each concept is an independent module with its own state and actions:

### Core Concepts

- **User**: Manages user registration and profiles
- **Article**: Handles blog posts/articles with automatic slug generation
- **Password**: Validates and securely stores passwords using bcrypt
- **JWT**: Generates and verifies JSON Web Tokens for authentication

### Extended Concepts

- **Favorite**: Manages user favorites for articles
- **Comment**: Handles article comments and discussions
- **Web**: Simulates HTTP request/response handling
- **Persistence**: RDF/SPARQL-based state persistence

### Creating a New Concept

```typescript
import { ConceptImpl } from '../engine/types';

export const MyConcept: ConceptImpl = {
  state: {
    myData: new Map(),
  },

  async execute(action: string, input: any) {
    if (action === 'myAction') {
      // Implement your logic here
      return { result: 'success' };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
```

## 🔄 Synchronizations

Synchronizations are declarative rules that define system behavior:

```typescript
export const mySyncs: SyncRule[] = [
  {
    name: "MySynchronization",
    when: [
      {
        concept: "SourceConcept",
        action: "someAction"
      }
    ],
    then: [
      {
        concept: "TargetConcept",
        action: "anotherAction",
        input: {
          param: "?outputParam"
        }
      }
    ]
  }
];
```

## 📡 API Reference

### REST API Endpoints (Express Version)

```
POST   /users              # Register a new user
POST   /login              # User login
POST   /articles           # Create a new article
POST   /articles/:id/favorite    # Favorite an article
DELETE /articles/:id/favorite    # Unfavorite an article
POST   /articles/:id/comments    # Add a comment
GET    /audit/:flowId      # Audit a flow
```

### Engine API

```typescript
import { SyncEngine } from './engine/Engine';

// Create engine instance
const engine = new SyncEngine();

// Register concepts
engine.registerConcept("MyConcept", MyConcept);

// Register synchronizations
engine.registerSync(mySyncRule);

// Execute actions
const result = await engine.invoke("MyConcept", "myAction", input, flowId);

// Audit flows
const actions = engine.getActionsByFlow(flowId);
```

## 💡 Examples

### User Registration Flow

```typescript
// Trigger user registration
await engine.invoke("Web", "request", {
  method: "POST",
  path: "/users",
  body: {
    username: "alice",
    email: "alice@example.com",
    password: "secure123"
  }
}, "registration-flow");
```

This single action triggers:
1. Password validation
2. User registration
3. Password hashing and storage
4. JWT token generation
5. State persistence to RDF store

### Article Creation with Authentication

```typescript
// Create article (requires authentication)
await engine.invoke("Web", "request", {
  method: "POST",
  path: "/articles",
  body: {
    title: "My Article",
    body: "Article content...",
    token: "jwt-token-here"
  }
}, "article-flow");
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the linter: `npm run lint`
6. Run tests: `npm test`
7. Submit a pull request

### Adding New Features

1. **New Concepts**: Create in `src/concepts/`
2. **New Synchronizations**: Create in `src/syncs/`
3. **Update Tests**: Add test cases
4. **Update Documentation**: Update this README

## 🔬 Research

This implementation is based on the paper:

> **"What You See Is What It Does: A Structural Pattern for Legible Software"**
>
> Eagon Meng, Daniel Jackson
>
> [arXiv:2508.14511](https://arxiv.org/html/2508.14511v2)

The WYSIWYG pattern provides:
- **Legibility**: System behavior is explicitly declared
- **Modularity**: Concepts are independent and reusable
- **Maintainability**: Changes are localized to specific rules
- **Testability**: Each concept and synchronization can be tested independently

## 🤖 AI Assessment Scale

This project demonstrates **co-creation with AI agents** using the [AI Assessment Scale](https://aiassessmentscale.com/) framework.

### AI Participation Level: **4 - AI as Leader**

**AI Contributions:**
- **Research Synthesis**: Analyzed academic paper and extracted architectural patterns
- **Framework Design**: Created complete LegibleSync framework architecture
- **Code Implementation**: Generated all TypeScript code and examples
- **Documentation**: Produced comprehensive bilingual documentation
- **Quality Engineering**: Implemented testing strategies and code optimization

**Human Contributions:**
- **Project Vision**: Mauro Stepanoski defined the project scope and goals
- **Domain Validation**: Ensured technical accuracy and research fidelity
- **Ethical Framework**: Maintained responsible AI implementation standards

**Assessment Rationale:**
- AI drove the technical creation and implementation process
- Human provided strategic direction and quality assurance
- Collaboration resulted in accelerated development with human oversight

## 👨‍💻 Author & Attribution

**Implementation by:** [Mauro Stepanoski](https://maurostepanoski.ar) with AI co-creation

**Original Research:** Eagon Meng and Daniel Jackson - ["What You See Is What It Does: A Structural Pattern for Legible Software"](https://arxiv.org/html/2508.14511v2)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Daniel Jackson and Eagon Meng for the original research
- The MIT Software Design Group for their work on software architecture patterns

---

**⭐ Star this repository if you find it useful!**

For questions or discussions, please [open an issue](https://github.com/yourusername/wysiwyg-legible-software/issues).