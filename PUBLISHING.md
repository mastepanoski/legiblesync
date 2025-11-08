# Publishing to npm

This guide explains how to publish the WYSIWID Legible Software packages to npm.

## Prerequisites

1. **npm Account**: You need an npm account with publishing rights
2. **2FA Enabled**: Two-factor authentication should be enabled on your npm account
3. **Repository Access**: You should have access to the `@legible-sync` npm organization

## Setup

### 1. Login to npm
```bash
npm login
```

### 2. Verify Access
```bash
npm whoami
npm org ls @legible-sync
```

## Publishing Process

### Build All Packages
```bash
# Clean previous builds
npm run clean

# Install dependencies
npm install

# Bootstrap packages
npm run bootstrap

# Build all packages
npm run build

# Run tests
npm run test
```

### Publish Packages

#### Option 1: Publish Individually (Recommended for first time)
```bash
# Publish core framework first
cd packages/legible-sync
npm publish --access public

# Publish examples
cd ../example-console
npm publish --access public

cd ../example-express
npm publish --access public
```

#### Option 2: Use Lerna (Automated)
```bash
# From root directory
npx lerna publish --yes
```

### Version Management

Lerna handles versioning automatically. To bump versions:

```bash
# Patch version (1.0.0 -> 1.0.1)
npx lerna version patch --yes

# Minor version (1.0.0 -> 1.1.0)
npx lerna version minor --yes

# Major version (1.0.0 -> 2.0.0)
npx lerna version major --yes
```

## Package Structure

### @legible-sync/core
- **Version**: Independent versioning
- **Dependencies**: Minimal (uuid only)
- **Files**: `dist/` + `README.md`

### @legible-sync/example-*
- **Version**: Match core version
- **Dependencies**: `@legible-sync/core` + specific deps
- **Files**: Source code (examples are runnable)

## Post-Publish Checklist

### 1. Verify Packages
```bash
npm view @legible-sync/core
npm view @legible-sync/example-console
npm view @legible-sync/example-express
```

### 2. Test Installation
```bash
# Create test directory
mkdir test-install && cd test-install

# Test core installation
npm install @legible-sync/core
node -e "const { LegibleEngine } = require('@legible-sync/core'); console.log('✅ Core installed');"

# Test example installation
npm install @legible-sync/example-console
npm install @legible-sync/example-express
```

### 3. Update Documentation
- Update README badges with correct npm versions
- Update installation instructions if needed
- Update changelog/release notes

### 4. Announce Release
- Create GitHub release with changelog
- Announce on social media/forums
- Update website/documentation if applicable

## Troubleshooting

### Common Issues

#### "You do not have permission to publish"
- Check if you're logged in: `npm whoami`
- Verify organization access: `npm org ls @legible-sync`
- Contact organization admin for access

#### "Package name already exists"
- Check existing packages: `npm search @legible-sync`
- Use different name or contact npm support

#### "Cannot publish over existing version"
- Check current version: `npm view @legible-sync/core version`
- Bump version appropriately before publishing

### Rollback
If you need to unpublish (only within 72 hours):
```bash
npm unpublish @legible-sync/core@1.0.0
```

## CI/CD Integration

For automated publishing, set up GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish to npm
on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run bootstrap
      - run: npm run build
      - run: npm run test
      - run: npx lerna publish from-package --yes
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Best Practices

1. **Test Thoroughly**: Always test packages before publishing
2. **Semantic Versioning**: Use appropriate version bumps
3. **Changelogs**: Maintain clear changelogs for each release
4. **Deprecation**: Use deprecation warnings for breaking changes
5. **Security**: Audit dependencies before publishing

## Support

For publishing issues:
- Check npm documentation: https://docs.npmjs.com/
- Contact npm support: https://www.npmjs.com/support
- Open GitHub issue for repository-specific problems