# Agent Guidelines for LegibleSync

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
- **Types/Interfaces**: PascalCase (ActionRecord, Concept)

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

## Cybersecurity and Compliance Recommendations

This section provides security guidelines based on OWASP Top 10 and OWASP GenAI recommendations for applications built with LegibleSync.

### OWASP Top 10 Compliance

#### A01:2021 - Broken Access Control
- Implement proper authentication and authorization in Concept implementations
- Use role-based access control (RBAC) for sync rules
- Validate user permissions before executing actions

#### A02:2021 - Cryptographic Failures
- Use strong encryption for sensitive data storage
- Implement HTTPS/TLS for all communications
- Use secure key management practices

#### A03:2021 - Injection
- Validate and sanitize all user inputs in Concept execute methods
- Use parameterized queries if interacting with databases
- Avoid dynamic code execution

#### A04:2021 - Insecure Design
- Follow the "What You See Is What It Does" principle for transparent system behavior
- Implement fail-safe defaults in sync rules
- Conduct threat modeling during architecture design

#### A05:2021 - Security Misconfiguration
- Use environment variables for configuration
- Implement proper error handling without exposing sensitive information
- Regularly update dependencies and monitor for vulnerabilities

#### A06:2021 - Vulnerable and Outdated Components
- Keep all dependencies updated
- Use tools like npm audit and Snyk for vulnerability scanning
- Implement automated dependency updates in CI/CD

#### A07:2021 - Identification and Authentication Failures
- Implement multi-factor authentication where appropriate
- Use secure session management
- Enforce strong password policies

#### A08:2021 - Software and Data Integrity Failures
- Verify integrity of data in transit and at rest
- Implement proper backup and recovery procedures
- Use digital signatures for critical operations

#### A09:2021 - Security Logging and Monitoring Failures
- Implement comprehensive logging for all actions
- Monitor sync rule executions for anomalies
- Set up alerts for security events

#### A10:2021 - Server-Side Request Forgery (SSRF)
- Validate and restrict external resource access in Concepts
- Implement allowlists for external URLs
- Use safe libraries for HTTP requests

### OWASP GenAI Security Recommendations

#### Prompt Injection Prevention
- Validate and sanitize inputs to AI-generated content
- Implement prompt engineering best practices
- Avoid exposing AI system prompts to users

#### Data Privacy and Protection
- Implement data minimization principles
- Use differential privacy for sensitive data processing
- Ensure compliance with data protection regulations (GDPR, CCPA)

#### Model Security
- Regularly update and patch AI models
- Implement model validation and monitoring
- Use trusted AI providers and frameworks

#### Output Validation
- Validate all AI-generated outputs before use
- Implement content filtering for harmful content
- Monitor for adversarial inputs and outputs

#### Responsible AI Practices
- Document AI decision-making processes
- Implement explainability features where possible
- Conduct regular AI ethics reviews

### Compliance Frameworks
- **GDPR**: Implement data subject rights, consent management, and data minimization
- **HIPAA**: Secure health data handling (if applicable)
- **PCI DSS**: Protect payment card information
- **SOX**: Maintain audit trails for financial systems

### Implementation Guidelines
- Conduct regular security audits and penetration testing
- Implement automated security scanning in CI/CD pipelines
- Train development teams on secure coding practices
- Maintain an incident response plan
- Regularly review and update security policies

## Release Process

- Follow [Semantic Versioning (SemVer)](https://semver.org/) for version numbers
- Use [Conventional Commits](https://conventionalcommits.org/) for commit messages
- Generate changelog automatically using `conventional-changelog`
- Update version in package.json files
- Create git tags for releases