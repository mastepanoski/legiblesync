# Contributing to WYSIWID Legible Software

Thank you for your interest in contributing to WYSIWID Legible Software!

## Commit Convention

This project uses [Conventional Commits](https://conventionalcommits.org/) for commit messages. This allows us to automatically generate changelogs and determine version bumps.

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Examples

```
feat: add sync rule validation
fix: prevent infinite loops in engine
docs: update API documentation
```

## Development

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Commit using conventional format
6. Push and create a pull request

## Changelog

The changelog is automatically generated from conventional commits using `conventional-changelog`.

To update the changelog:

```bash
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

## Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Write tests for new features
- Update documentation as needed