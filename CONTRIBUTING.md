# Contributing to Project Starter Kit

Thank you for your interest in contributing to the Project Starter Kit! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+
- Flutter SDK (for mobile development)
- Git

### Getting Started

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/yourusername/project-starter-kit.git
   cd project-starter-kit
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start development servers:**

   ```bash
   pnpm dev
   ```

## Project Structure

This is a Turborepo monorepo with the following structure:

```
project-starter-kit/
├── apps/
│   ├── web/              # Next.js customer portal (port 3001)
│   ├── dashboard/        # Next.js admin dashboard (port 3002)
│   ├── api/              # NestJS backend API (port 3000)
│   └── mobile/           # Flutter mobile app (iOS & Android)
├── packages/
│   ├── ui/               # Shared React components
│   ├── eslint-config/    # Shared ESLint configurations
│   ├── typescript-config/# Shared TypeScript configurations
│   └── tailwind-config/  # Shared Tailwind CSS configuration
└── turbo.json            # Turborepo pipeline configuration
```

## Development Guidelines

### Code Style

- **TypeScript**: All code should be written in TypeScript
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code is automatically formatted with Prettier
- **Naming**: Use camelCase for variables and functions, PascalCase for components

### Commits

We use conventional commits for clear change history:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```bash
git commit -m "feat(api): add user authentication endpoints"
git commit -m "fix(web): resolve mobile navigation issue"
git commit -m "docs: update installation instructions"
```

### Pull Request Process

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clear, concise code
   - Add tests for new functionality
   - Update documentation as needed

3. **Run quality checks:**

   ```bash
   pnpm lint        # Check code style
   pnpm test        # Run tests
   pnpm build       # Ensure builds succeed
   ```

4. **Commit your changes:**

   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push and create PR:**

   ```bash
   git push origin feature/your-feature-name
   ```

   Then create a pull request on GitHub.

### Testing

- **Write tests** for new features and bug fixes
- **Run the full test suite** before submitting PRs
- **Maintain or improve** test coverage

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter web test
pnpm --filter api test
pnpm --filter mobile test
```

### Adding New Packages

When adding new shared packages:

1. Create the package in `packages/`
2. Add appropriate `package.json` with dependencies
3. Update `pnpm-workspace.yaml` if needed
4. Add build/lint/test scripts following existing patterns
5. Update `turbo.json` task configurations

### Documentation

- Update README.md for significant changes
- Add JSDoc comments for complex functions
- Update this CONTRIBUTING.md for process changes
- Include examples in package READMEs

## Specific Areas

### Frontend (Next.js Apps)

- Use Tailwind CSS for styling via `@workspace/tailwind-config`
- Utilize shared components from `@workspace/ui`
- Follow Next.js 15 best practices
- Ensure responsive design

### Backend (NestJS API)

- Follow NestJS architectural patterns
- Use DTOs for request/response validation
- Write unit and e2e tests
- Document API endpoints

### Mobile (Flutter)

- Follow Flutter/Dart conventions
- Test on both iOS and Android
- Use proper state management
- Ensure platform-specific considerations

### Shared Packages

- Keep packages focused and minimal
- Use proper TypeScript exports
- Document public APIs
- Version appropriately

## Issue Reporting

When reporting issues:

1. **Search existing issues** first
2. **Use issue templates** when available
3. **Provide clear reproduction steps**
4. **Include environment details** (OS, Node version, etc.)
5. **Add relevant logs or screenshots**

## Feature Requests

For new features:

1. **Check if it fits the starter kit scope**
2. **Discuss in issues before implementing**
3. **Consider backward compatibility**
4. **Think about maintenance burden**

## Questions and Help

- **GitHub Discussions**: For general questions and discussions
- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Check README.md and package-specific docs first

## Recognition

Contributors will be recognized in:

- GitHub contributor list
- Release notes for significant contributions
- README.md contributors section

Thank you for helping make this starter kit better! 🚀
