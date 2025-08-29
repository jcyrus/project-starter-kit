# Project Starter Kit - Turborepo Monorepo

A comprehensive full-stack starter kit built with Turborepo, featuring web applications, mobile apps, and a robust backend API. Perfect for launching modern applications with a complete tech stack.

## Project Overview

This starter kit provides a complete foundation for modern applications that includes:

- **Web Application** - Customer-facing application built with5. Ensure all tests pass: `turbo test`

6. Ensure code quality: `turbo lint`
7. Build successfully: `turbo build`xt.js

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

- **`@workspace/ui`** - Reusable React component library with shadcn/ui components
- **`@workspace/eslint-config`** - Shared ESLint configurations for consistent code quality
- **`@workspace/typescript-config`** - Shared TypeScript configurations for type safety
- **`@workspace/tailwind-config`** - Centralized Tailwind CSS configuration for consistent styling

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
   turbo dev
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
   - Define your data models and API endpoints

## 🗄️ Database Setup (PostgreSQL)

The API uses PostgreSQL with TypeORM for data persistence and includes a complete authentication system.

### Prerequisites

- PostgreSQL 12+ installed locally or access to a PostgreSQL server
- Database administration tool (optional): pgAdmin, TablePlus, or psql CLI

### Database Setup Steps

1. **Install PostgreSQL:**

   **macOS (using Homebrew):**

   ```bash
   brew install postgresql
   brew services start postgresql
   ```

   **Ubuntu/Debian:**

   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

   **Windows:**
   Download from https://www.postgresql.org/download/windows/

2. **Create Database and User:**

   Connect to PostgreSQL as superuser:

   ```bash
   psql -U postgres
   ```

   Create database and user:

   ```sql
   -- Create the database
   CREATE DATABASE database_name;

   -- Create user with password
   CREATE USER database_user WITH ENCRYPTED PASSWORD 'your-own-password';

   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE database_name TO database_user;

   -- Grant schema privileges (for newer PostgreSQL versions)
   \c database_name
   GRANT ALL ON SCHEMA public TO database_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO database_user;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO database_user;

   -- Exit psql
   \q
   ```

3. **Configure Environment Variables:**

   Update `apps/api/.env` with your database credentials:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=database_user
   DB_PASSWORD=your-own-password
   DB_DATABASE=database_name

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # App Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Test Database Connection:**

   Start the API server:

   ```bash
   cd apps/api
   pnpm run start:dev
   ```

   If successful, you should see:

   ```
   🚀 API Server running on http://localhost:3000
   ```

### Authentication System

The API includes a complete authentication system with:

- **User Registration & Login** - JWT-based authentication
- **Password Management** - Secure hashing with bcrypt
- **Role-Based Access Control** - Admin, User, Moderator roles
- **Profile Management** - User profile updates
- **Session Management** - Token-based sessions

**Available Endpoints:**

- `POST /auth/register` - Create new user account
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)
- `PUT /auth/profile` - Update user profile (protected)
- `POST /auth/change-password` - Change password (protected)
- `POST /auth/logout` - User logout (protected)

**Example Usage:**

```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "password": "SecurePassword123"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123"
  }'
```

### Database Schema

The system automatically creates these tables:

- **users** - User accounts with authentication and profile data
- Additional tables will be created as you add more entities

The database schema is automatically synchronized in development mode. In production, use migrations for schema changes.

### Troubleshooting

**Connection Issues:**

- Ensure PostgreSQL is running: `brew services list | grep postgresql`
- Check database exists: `psql -U developer -d database_name -c "\dt"`
- Verify user permissions: Ensure the user has proper privileges

**Authentication Issues:**

- Check JWT_SECRET is set in environment variables
- Ensure passwords meet minimum requirements (6+ characters)
- Verify CORS is configured for your frontend domains### Development

Start all applications in development mode:

```bash
turbo dev
```

Start specific applications:

```bash
# Web application (port 3001)
turbo dev --filter=web

# Dashboard (port 3002)
turbo dev --filter=dashboard

# API server
pnpm --filter api start:dev

# Mobile app (iOS & Android)
pnpm --filter mobile dev
```

### Building

Build all applications:

```bash
turbo build
```

Build specific applications:

```bash
# Build web application
turbo build --filter=web

# Build dashboard
turbo build --filter=dashboard

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
turbo test
```

Lint code:

```bash
turbo lint
```

Type checking:

```bash
turbo check-types
```

Format code:

```bash
pnpm format
```

## Key Features

### 🚀 **Ready-to-Use Tech Stack**

- **Frontend**: Next.js 15 with Tailwind CSS, shadcn/ui, and TypeScript
- **Backend**: NestJS with TypeScript, PostgreSQL, and JWT Authentication
- **Mobile**: Flutter for iOS and Android
- **Database**: PostgreSQL with TypeORM for robust data management
- **Authentication**: Complete JWT-based auth system with role-based access control
- **Monorepo**: Turborepo for optimized builds and development
- **Shared Packages**: Common UI components with shadcn/ui, configs, and utilities

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

This monorepo uses a centralized Tailwind CSS configuration following the [Turborepo Tailwind guide](https://turborepo.com/docs/guides/tools/tailwind):

#### 🏗️ Architecture

```
packages/
├── tailwind-config/
│   ├── package.json           # Tailwind dependencies
│   ├── shared-styles.css      # Base Tailwind imports and custom styles
│   └── postcss.config.js      # PostCSS configuration
└── ui/
    ├── src/
    │   ├── styles.css         # Imports from @workspace/tailwind-config
    │   └── *.tsx              # UI components with Tailwind classes
    └── dist/
        └── index.css          # Compiled Tailwind styles

apps/
├── web/
│   ├── src/app/globals.css    # Imports Tailwind + shared config + UI styles
│   └── postcss.config.js      # Uses shared PostCSS config
└── dashboard/
    ├── src/app/globals.css    # Imports Tailwind + shared config + UI styles
    └── postcss.config.js      # Uses shared PostCSS config
```

#### 🎯 Benefits

- ✅ **Consistency**: Shared base styles across all applications
- ✅ **Maintainability**: Single source of truth for Tailwind configuration
- ✅ **Scalability**: Easy to add new apps that inherit the shared styles
- ✅ **Performance**: Optimized build pipeline with Turbo caching
- ✅ **DX**: Hot reloading works seamlessly in development

#### 🔄 CSS Import Chain

The CSS import chain ensures proper style ordering:

```css
/* In apps/*/src/app/globals.css */
@import 'tailwindcss';                    // Tailwind CSS v4
@import '@workspace/tailwind-config';     // Shared base styles
@import '@workspace/ui/styles.css';       // UI component styles

/* App-specific styles can go here */
```

#### 📝 Usage

**Building Styles:**

```bash
# Build UI package styles
turbo build:styles --filter=@workspace/ui

# Build all packages including styles
turbo build
```

**Adding New shadcn/ui Components:**

```bash
# From any app directory, add components to the shared UI package
cd apps/web  # or apps/dashboard
pnpm dlx shadcn@canary add [component-name]

# Example: Add button, card, input components
pnpm dlx shadcn@canary add button card input
```

**Using shadcn/ui Components:**

```tsx
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <h2>My Card</h2>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

**Adding Custom Components:**

1. Create component in `packages/ui/src/components/`
2. Use Tailwind classes and shadcn/ui utilities (`cn` function)
3. Export from the UI package
4. Import in your apps

**Customizing Styles:**

- **Base styles**: Edit `packages/tailwind-config/shared-styles.css`
- **Component styles**: Add to UI components in `packages/ui/src/`
- **App-specific styles**: Add to individual app's `globals.css`

## 🎨 Theme System

The project includes a comprehensive dark/light theme system powered by next-themes:

### Features

- **Automatic theme detection** - matches your system preference by default
- **Manual theme toggle** - users can override system preference
- **Persistent theme selection** - remembers user choice across sessions
- **Custom primary colors** - beautiful purple-based color scheme
- **Smooth transitions** - no flash on theme change
- **Shared across apps** - consistent theming for web and dashboard

### Theme Components

```tsx
// Theme Provider (already set up in app layouts)
import { ThemeProvider } from "@workspace/ui/components/theme-provider"

// Theme Toggle Button
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"

// Usage in your components
<ThemeToggle /> {/* Renders sun/moon toggle button */}
```

### Customizing Colors

Edit the CSS variables in `packages/tailwind-config/shared-styles.css`:

```css
:root {
  --primary: 262 73% 57%; /* Purple primary color */
  --primary-foreground: 0 0% 98%; /* White text on primary */
  --secondary: 240 4.8% 95.9%; /* Light gray */
  /* ... more variables ... */
}

.dark {
  --primary: 263 70% 50%; /* Darker purple for dark mode */
  --primary-foreground: 0 0% 98%; /* White text on primary */
  --secondary: 240 3.7% 15.9%; /* Dark gray */
  /* ... more variables ... */
}
```

### Theme-Aware Components

All shadcn/ui components automatically adapt to the current theme:

```tsx
<Button variant="default">Automatically themed</Button>
<Card className="bg-card text-card-foreground border">
  Content adapts to light/dark theme
</Card>
```

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

- **`@workspace/database`** - Shared database schema and models
- **`@workspace/types`** - Shared TypeScript types between frontend and backend
- **`@workspace/utils`** - Common utility functions
- **`@workspace/env-config`** - Environment variable validation
- **`@workspace/test-utils`** - Shared testing helpers and mocks
- **`@workspace/auth`** - Authentication utilities and components

## Useful Links

Learn more about the technologies used:

- [Turborepo Documentation](https://turborepo.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Flutter Documentation](https://docs.flutter.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
