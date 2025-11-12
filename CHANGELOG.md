# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.2](https://github.com/mastepanoski/legiblesync/compare/v1.2.0...v1.2.2) (2025-11-11)


### Documentation

* create unified ROADMAP.md consolidating planning and DSL specification from PENDING.md and framework-design.md ([41c3b3d](https://github.com/mastepanoski/legiblesync/commit/41c3b3d))

### Bug Fixes

* add publishConfig for EDA package to enable public publishing ([c8910cd](https://github.com/mastepanoski/legiblesync/commit/c8910cd3f6011ceeb8fecce81faa942f1c8200a3))
* resolve Next.js SSE field name translation and test isolation ([d0bc29f](https://github.com/mastepanoski/legiblesync/commit/d0bc29fa6c00ac5239f3faaa25c4cc52a68c5446))





## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This changelog is automatically generated using [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog).

## [1.1.2] - 2025-11-11

### Fixed
- Fixed Next.js SSE field name translation between frontend (English) and backend (Spanish) concepts
- Added reset actions to EDA concepts (Order, Inventory, Notification, Payment) for proper test isolation
- Fixed API route to properly map field names between frontend and backend
- Updated SSEEmitter to emit English field names for frontend compatibility
- Fixed CSV reading to convert Spanish field names back to English for frontend consumption

### Changed
- Updated Next.js SSE API route to translate between English and Spanish field names
- Modified SSEEmitter concept to handle field name translation
- Enhanced test isolation by adding reset functionality to all EDA concepts

## [1.1.1] - 2025-11-08

### Added
- Documentation for use cases and best practices in main README and core package README, including guidance on syncs vs EventBus for side effects and decoupling

## [1.1.0] - 2025-11-08

### Added
- Query and Invocation types for advanced sync rule filtering
- ESLint configuration for example packages

### Changed
- Updated SyncRule to include optional where clause for query filtering
- Enhanced Engine to support binding filtering with Query.where

### Fixed
- Removed unused imports and variables in example code
- Fixed lint-staged configuration to work with lerna

## [1.0.0] - 2025-11-08

### Added
- Console and Express examples
- Jest test suite for core functionality

### Changed
- Improved sync variable extraction and loop prevention

### Fixed
- Sync system infinite loop issues

## [0.1.0] - 2025-11-07

### Added
- Initial release of LegibleSync framework
- Concept registration and execution
- Synchronization rules with variable binding
- Flow tracking
- TypeScript types and interfaces
