# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This changelog is automatically generated using [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog).

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