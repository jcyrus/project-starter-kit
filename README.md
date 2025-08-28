# Project Starter Kit - Turborepo Monorepo

A comprehensive full-stack starter kit built with Turborepo, featuring web applications, mobile apps, and a robust backend API. Perfect for launching modern applications with a complete tech stack.

## Project Overview

This starter kit provides a complete foundation for modern applications that includes:

- **Web Application** - Customer-facing application built with Next.js
- **Admin Dashboard** - Admin interface for content and user management
- **API** - NestJS backend for business logic and data management
- **Mobile App** - Cross-platform mobile application built with Flutter (iOS & Android)

## Architecture

```
project-starter-kit/
├── apps/
│   ├── web/              # Next.js customer portal (port 3001)
│   ├── dashboard/        # Next.js admin dashboard (port 3002)
│   ├── api/              # NestJS backend API (port 3000)
│   └── mobile/           # Flutter mobile application (iOS & Android)
├── packages/
│   ├── ui/               # Shared React components
│   ├── eslint-config/    # Shared ESLint configurations
│   ├── typescript-config/# Shared TypeScript configurations
│   └── tailwind-config/  # Shared Tailwind CSS configuration
└── turbo.json            # Turborepo pipeline configuration
```

## What's Inside?

### Applications

- **`web`** - Next.js customer-facing application for your main product/service
- **`dashboard`** - Next.js admin interface for content and user management
- **`api`** - NestJS backend API providing RESTful endpoints and business logic
- **`mobile`** - Flutter mobile application for both iOS and Android devices

### Shared Packages

- **`@repo/ui`** - Reusable React component library used across web applications
- **`@repo/eslint-config`** - Shared ESLint configurations for consistent code quality
- **`@repo/typescript-config`** - Shared TypeScript configurations for type safety
- **`@repo/tailwind-config`** - Centralized Tailwind CSS configuration for consistent styling

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+
- Flutter SDK (for mobile development)

### Quick Start

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url> my-new-project
   cd my-new-project
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start development servers:**

   ```bash
   pnpm dev
   ```

   This will start:
   - **Web app** at http://localhost:3001
   - **Dashboard** at http://localhost:3002
   - **API** at http://localhost:3000
   - **Mobile app** (if device/emulator connected)

4. **Customize for your project:**
   - Update project name in `package.json`
   - Modify app titles and branding
   - Replace placeholder content with your features
   - Configure your database and environment variables

### Project Customization

When starting a new project from this kit:

1. **Update Project Identity:**

   ```bash
   # Update package.json name
   # Update app titles in layout.tsx files
   # Update mobile app name in main.dart
   # Update API responses and branding
   ```

2. **Environment Setup:**

   ```bash
   # Copy environment templates
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   cp apps/dashboard/.env.example apps/dashboard/.env.local
   ```

3. **Database Configuration:**
   - Configure your preferred database in the API
   - Set up authentication and user management
   - Define your data models and API endpoints### Development

Start all applications in development mode:

```bash
pnpm dev
```

Start specific applications:

```bash
# Web application (port 3001)
pnpm --filter web dev

# Dashboard (port 3002)
pnpm --filter dashboard dev

# API server
pnpm --filter api start:dev

# Mobile app (iOS & Android)
pnpm --filter mobile dev
```

### Building

Build all applications:

```bash
pnpm build
```

Build specific applications:

```bash
# Build web application
pnpm --filter web build

# Build dashboard
pnpm --filter dashboard build

# Build API
pnpm --filter api build

# Build mobile app (iOS & Android)
pnpm --filter mobile build
pnpm --filter mobile build:ios
pnpm --filter mobile build:android
```

### Testing & Quality

Run tests across all packages:

```bash
pnpm test
```

Lint code:

```bash
pnpm lint
```

Type checking:

```bash
pnpm check-types
```

Format code:

```bash
pnpm format
```

## Key Features

### 🚀 **Ready-to-Use Tech Stack**

- **Frontend**: Next.js 15 with Tailwind CSS and TypeScript
- **Backend**: NestJS with TypeScript
- **Mobile**: Flutter for iOS and Android
- **Monorepo**: Turborepo for optimized builds and development
- **Shared Packages**: Common UI components, configs, and utilities

### 🛠 **Developer Experience**

- **Hot Reloading**: Instant feedback across all applications
- **Type Safety**: Full TypeScript support across the stack
- **Code Quality**: Pre-configured ESLint, Prettier, and testing
- **Build Optimization**: Smart caching and parallel builds with Turborepo

### 📱 **Production Ready**

- **Responsive Design**: Mobile-first web applications
- **Performance**: Optimized builds and deployments
- **Scalability**: Modular architecture for easy feature additions
- **Testing**: Unit and E2E testing setup included

### Shared Tailwind Configuration

This monorepo includes a centralized Tailwind CSS configuration (`@repo/tailwind-config`) that:

- ✅ Eliminates duplication of Tailwind dependencies across Next.js apps
- ✅ Ensures consistent styling between web and dashboard applications
- ✅ Provides centralized theme management and design tokens
- ✅ Simplifies maintenance and updates

### Enhanced Turborepo Pipeline

The `turbo.json` configuration includes optimized task definitions for:

- **Build** - Parallel building with proper dependency management
- **Test** - Efficient testing with smart caching
- **Lint** - Code quality checks across all packages
- **Dev** - Development servers with hot reloading
- **Type Checking** - TypeScript validation

### Workspace Organization

Each package is 100% TypeScript and follows modern development practices:

- **Consistent tooling** across all applications and packages
- **Shared configurations** for ESLint, TypeScript, and Tailwind
- **Optimized caching** for faster builds and tests
- **Clear separation** between applications and shared packages

## Utilities

This Turborepo includes pre-configured tools:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Turborepo](https://turbo.build/) for build orchestration

## Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Enable remote caching to share build artifacts across machines:

```bash
# Authenticate with Vercel
pnpm exec turbo login

# Link repository to remote cache
pnpm exec turbo link
```

## Deployment

### Web Applications (Next.js)

Deploy to Vercel with zero configuration:

```bash
# Deploy web application
vercel --cwd apps/web

# Deploy dashboard
vercel --cwd apps/dashboard
```

### API (NestJS)

Build and deploy the API:

```bash
pnpm --filter api build
pnpm --filter api start:prod
```

### Mobile Applications

Build for production:

```bash
# iOS
pnpm --filter mobile build:ios

# Android
pnpm --filter mobile build:android

# Android Release
pnpm --filter mobile build:android:release
```

## Using as a Starter Kit

This project is designed to be a comprehensive starter kit for modern full-stack applications. Here's how to use it:

### 🎯 **Perfect For:**

- **SaaS Applications** - Complete user management and admin interfaces
- **E-commerce Platforms** - Web shop with mobile app and admin dashboard
- **Content Management** - Multi-platform content creation and management
- **Social Platforms** - Web and mobile social applications
- **Business Applications** - Internal tools with web and mobile access

### 🔧 **Customization Guide:**

1. **Clone and Setup:**

   ```bash
   git clone <repository-url> my-awesome-project
   cd my-awesome-project
   rm -rf .git && git init  # Start fresh git history
   ```

2. **Update Project Configuration:**

   ```bash
   # Update package.json names across all apps
   # Modify app.json for mobile app configuration
   # Update API endpoints and database connections
   ```

3. **Brand Your Application:**

   ```bash
   # Replace logos and favicon files
   # Update color schemes in Tailwind config
   # Modify app names and descriptions
   ```

4. **Add Your Features:**
   ```bash
   # Define your data models in the API
   # Create your UI components in packages/ui
   # Build your specific screens and flows
   ```

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the established patterns
3. Ensure all tests pass: `pnpm test`
4. Ensure code quality: `pnpm lint`
5. Build successfully: `pnpm build`
6. Submit a pull request

## Future Enhancements

Planned shared packages for continued growth:

- **`@repo/database`** - Shared database schema and models
- **`@repo/types`** - Shared TypeScript types between frontend and backend
- **`@repo/utils`** - Common utility functions
- **`@repo/env-config`** - Environment variable validation
- **`@repo/test-utils`** - Shared testing helpers and mocks
- **`@repo/auth`** - Authentication utilities and components

## Useful Links

Learn more about the technologies used:

- [Turborepo Documentation](https://turborepo.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Flutter Documentation](https://docs.flutter.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
