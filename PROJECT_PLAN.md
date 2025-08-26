# Forge Cohort Platform - Revised Project Plan

## Project Overview
A modern web-based platform inspired by "Embracing Resistance: The Paradox of Learning" built with a monorepo architecture using Next.js, TypeScript, and Prisma.

## Technology Stack
- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Node.js with Express (separate API service)
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Features**: Socket.io for WebSocket connections
- **Styling**: Tailwind CSS with custom components
- **Development**: Docker-compose for local environment
- **State Management**: React Context + custom hooks
- **Authentication**: NextAuth.js or custom JWT implementation

## Monorepo Structure
```
forge-cohort-platform/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Basic components (Button, Input, etc.)
│   │   │   ├── contract/   # Contract builder components
│   │   │   ├── resistance/ # Resistance analysis components
│   │   │   └── shared/     # Shared components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configurations
│   │   ├── pages/          # Next.js pages
│   │   │   ├── api/        # API routes
│   │   │   ├── cohorts/
│   │   │   ├── contracts/
│   │   │   └── ...
│   │   ├── store/          # State management
│   │   ├── styles/         # Global styles
│   │   └── types/          # TypeScript type definitions
│   └── api/                # Backend API service
│       ├── src/
│       │   ├── controllers/ # Route controllers
│       │   ├── middleware/ # Custom middleware
│       │   ├── models/     # Data models
│       │   ├── routes/     # API routes
│       │   ├── services/   # Business logic
│       │   ├── sockets/    # Socket.io handlers
│       │   └── utils/      # Utilities
│       ├── prisma/         # Database schema and migrations
│       └── tests/          # API tests
├── packages/
│   ├── eslint-config/      # Shared ESLint configuration
│   ├── types/              # Shared TypeScript definitions
│   └── ui/                 # Shared UI component library
├── docker-compose.yml      # Local development environment
├── README.md
└── package.json
```

## Core Modules Implementation

### 1. Dynamic Contract Builder (To be converted to React)
- **Location**: `apps/web/components/contract/`
- **Components**: ContractBuilder, ClauseEditor, PromptSelector
- **State Management**: React hooks with context for shared state
- **API Integration**: REST endpoints from API service

### 2. Tension Thermometer
- **Location**: `apps/web/components/resistance/TensionThermometer.tsx`
- **Features**: Real-time sentiment polling with WebSocket updates
- **Visualization**: Chart.js integration for heat maps
- **Storage**: PostgreSQL with Prisma models

### 3. Resistance Journal
- **Location**: `apps/web/components/resistance/JournalEntry.tsx`
- **Features**: Rich text editor, categorization, analysis templates
- **Integration**: Links to specific contract clauses and tension events

### 4. Failure Folio
- **Location**: `apps/web/components/resistance/FailureFolio.tsx`
- **Components**: IterationTracker, PostMortemTemplate, LearningExtractor
- **Visualization**: Timeline with failure points and learning milestones

### 5. Facilitator Dashboard
- **Location**: `apps/web/pages/facilitator/dashboard.tsx`
- **Metrics**: Real-time analytics with WebSocket updates
- **Alerts**: Notification system for tension thresholds
- **Tools**: Intervention suggestion engine

## Database Schema (Prisma)

### Core Models
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(PARTICIPANT)
  cohorts   Cohort[] @relation("CohortMembers")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Cohort {
  id          String   @id @default(cuid())
  name        String
  description String?
  members     User[]   @relation("CohortMembers")
  contracts   Contract[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Contract {
  id        String   @id @default(cuid())
  title     String
  clauses   Clause[]
  cohort    Cohort   @relation(fields: [cohortId], references: [id])
  cohortId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Clause {
  id         String   @id @default(cuid())
  title      String
  content    String
  contract   Contract @relation(fields: [contractId], references: [id])
  contractId String
  createdBy  User     @relation(fields: [userId], references: [id])
  userId     String
  amendments Amendment[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## API Endpoints Design

### Contracts API (`/api/contracts`)
- `GET /api/contracts` - List contracts for cohort
- `POST /api/contracts` - Create new contract
- `GET /api/contracts/:id` - Get specific contract
- `PUT /api/contracts/:id` - Update contract
- `DELETE /api/contracts/:id` - Delete contract
- `POST /api/contracts/:id/amend` - Propose amendment

### Tension API (`/api/tension`)
- `POST /api/tension/measure` - Submit tension measurement
- `GET /api/tension/:contractId` - Get tension history
- `WS /tension-updates` - Real-time tension stream

## Implementation Phases

### Phase 1: Monorepo Setup (Week 1)
- [ ] Initialize monorepo with Turborepo or Nx
- [ ] Set up Next.js frontend application
- [ ] Create Express API service
- [ ] Configure shared packages (eslint, types, ui)
- [ ] Set up Docker-compose for PostgreSQL
- [ ] Configure Prisma schema and migrations

### Phase 2: Core Features (Week 2-3)
- [ ] Convert Dynamic Contract Builder to React components
- [ ] Implement database models and API endpoints
- [ ] Create basic authentication system
- [ ] Set up WebSocket server for real-time features

### Phase 3: Advanced Modules (Week 4-5)
- [ ] Implement Tension Thermometer with real-time updates
- [ ] Build Resistance Journal with rich text editor
- [ ] Create Failure Folio with iteration tracking
- [ ] Develop Facilitator Dashboard with analytics

### Phase 4: Polish & Deployment (Week 6-7)
- [ ] Responsive design refinement
- [ ] Performance optimization
- [ ] Testing suite implementation
- [ ] Deployment configuration

## Dependencies Overview

### Root package.json
```json
{
  "name": "forge-cohort-platform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0"
  }
}
```

### Apps/Web Dependencies
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Socket.io-client
- Chart.js
- React Hook Form

### Apps/Api Dependencies
- Express.js
- TypeScript
- Prisma
- Socket.io
- JWT authentication
- CORS & security middleware

## Next Steps
1. Switch to Code mode to implement the monorepo structure
2. Initialize the project with Turborepo
3. Set up Next.js frontend and Express API
4. Configure Docker-compose for PostgreSQL
5. Implement Prisma schema and migrations
6. Convert the existing contract builder to React components

## Success Metrics
- 95%+ test coverage for critical components
- Sub-100ms API response times
- Real-time updates with <1s latency
- Mobile-responsive design across all components
- Secure authentication and data protection