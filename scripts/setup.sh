#!/bin/bash

# LegibleSync Monorepo Setup Script

echo "🚀 Setting up LegibleSync Monorepo"
echo "=================================="

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check npm version
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

NPM_VERSION=$(npm -v | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 8 ]; then
    echo "❌ npm version 8+ is required. Current version: $(npm -v)"
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Build all packages
echo ""
echo "🔨 Building packages..."
npm run build

# Run tests
echo ""
echo "🧪 Running tests..."
npm run test

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Available commands:"
echo "  npm run dev:console  - Start console example"
echo "  npm run dev:express   - Start Express example"
echo "  npm run build         - Build all packages"
echo "  npm run test          - Run all tests"
echo "  npm run lint          - Run linting"
echo "  npm run typecheck     - Run type checking"
echo ""
echo "Package structure:"
echo "  packages/legible-sync/     - Core framework"
echo "  packages/example-console/  - Console example"
echo "  packages/example-express/  - Express API example"
echo ""
echo "Happy coding! 🚀"