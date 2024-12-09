# MicroTask Manager

A microservices-based task management system built with NestJS. This system allows users to create, update, assign, and track tasks in a collaborative environment.

## Table of Contents
- [MicroTask Manager](#microtask-manager)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Setup](#environment-setup)
    - [Running the Application](#running-the-application)
    - [Running the Application](#running-the-application-1)
      - [Development Mode](#development-mode)
      - [Production Mode](#production-mode)
  - [Project Structure](#project-structure)
  - [Features and Usage](#features-and-usage)
    - [Authentication](#authentication)
      - [Register a new user](#register-a-new-user)
      - [Login](#login)
    - [Task Management](#task-management)
      - [Create a task](#create-a-task)
      - [Update task status](#update-task-status)
      - [Assign task](#assign-task)
    - [Team Management](#team-management)
      - [Create a team](#create-a-team)
      - [Add team member](#add-team-member)
  - [API Documentation](#api-documentation)
    - [Role-Based Access Control](#role-based-access-control)
      - [Role Permissions:](#role-permissions)

## Getting Started

### Prerequisites
- Node.js 20.9.0 or higher
- Docker and Docker Compose
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd micro-task-manager
```

2. Install dependencies:
```bash
yarn install
```

### Environment Setup

1. Create the following `.env` files:

Root `.env`:
```env
NODE_ENV=development
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
DB_HOST=postgres
DB_PORT=5432
```

`apps/gateway/.env`:
```env
GLOBAL_PREFIX=api/v1
PORT=3300
AUTH_TCP_PORT=3401
TASKS_TCP_PORT=3402
USERS_TCP_PORT=3403
JWT_SECRET=secret
```

`apps/auth/.env`:
```env
GLOBAL_PREFIX=api/v1
PORT=3301
USERS_TCP_PORT=3403
DB_NAME=auth_db
JWT_SECRET=secret
```

`apps/tasks/.env`:
```env
GLOBAL_PREFIX=api/v1
PORT=3302
USERS_TCP_PORT=3403
DB_NAME=task_db

```

`apps/users/.env`:
```env
GLOBAL_PREFIX=api/v1
PORT=3303
DB_NAME=user_db
```

### Running the Application

### Running the Application

#### Development Mode

1. Start all services:
```bash
yarn docker:dev
```

2. Build and start all services:
```bash
yarn docker:dev:build
```

3. Additional development commands:
```bash
# Stop all services
yarn docker:dev:down

# View logs
yarn docker:dev:logs

# Clean up Docker resources
yarn docker:clean

# Remove all unused Docker resources
yarn docker:prune

# Remove all unused Docker volumes
yarn docker:volumes:prune
```

4. For individual microservices development:
```bash
# Build all microservices
yarn build:all

# Start a specific microservice in watch mode
yarn start:dev auth    # Start auth service
yarn start:dev users   # Start users service
yarn start:dev tasks   # Start tasks service
yarn start:dev gateway # Start API gateway
```

Make sure you have all the required environment variables set up in your `.env` files before running these commands. Check the Environment Setup section for details.

#### Production Mode
```bash
# Build and start all services
docker-compose up --build

# Start specific service
docker-compose up api-gateway
```

## Project Structure

The project follows a monorepo structure using NestJS workspace:

```
micro-task-manager/
├── apps/
│   ├── gateway/             # API Gateway
│   │   ├── src/
│   │   │   ├── auth/       # Authentication related code
│   │   │   │   ├── controllers/
│   │   │   │   ├── guards/
│   │   │   │   └── services/
│   │   │   ├── tasks/      # Tasks endpoints
│   │   │   │   ├── controllers/
│   │   │   │   └── services/
│   │   │   └── users/      # Users and teams endpoints
│   │   │       ├── controllers/
│   │   │       └── services/
│   ├── auth/               # Auth Microservice
│   │   ├── src/
│   │   │   ├── core/
│   │   │   │   ├── controllers/
│   │   │   │   ├── entities/
│   │   │   │   └── services/
│   │   │   └── config/
│   ├── tasks/              # Tasks Microservice
│   │   ├── src/
│   │   │   ├── core/
│   │   │   │   ├── controllers/
│   │   │   │   ├── entities/
│   │   │   │   └── services/
│   │   │   └── config/
│   └── users/              # Users Microservice
│       ├── src/
│       │   ├── core/
│       │   │   ├── controllers/
│       │   │   ├── entities/
│       │   │   └── services/
│       │   └── config/
├── libs/
│   └── common/             # Shared code
│       ├── dtos/
│       │   ├── auth/
│       │   ├── tasks/
│       │   ├── teams/
│       │   └── users/
│       ├── enums/
│       └── exceptions/
```

Each microservice follows a similar structure:
- `core/`: Contains the main business logic
  - `controllers/`: API endpoints
  - `entities/`: Database models
  - `services/`: Business logic implementation
- `config/`: Service configuration

## Features and Usage

### Authentication

#### Register a new user
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt-token"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "jwt-token"
}
```

### Task Management

#### Create a task
```http
POST /tasks
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "title": "Implement Feature",
  "description": "Implement new authentication feature",
  "dueDate": "2024-12-31T23:59:59.999Z",
  "status": "TODO"
}
```

#### Update task status
```http
PUT /tasks/:id/status
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

#### Assign task
```http
PUT /tasks/:id
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "assignedUserId": "user-uuid"
  // or
  "assignedTeamId": "team-uuid"
}
```

### Team Management

#### Create a team
```http
POST /teams
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "name": "Development Team",
  "description": "Main development team",
  "memberIds": ["user-uuid-1", "user-uuid-2"]
}
```

#### Add team member
```http
POST /teams/:id/members
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "userId": "user-uuid"
}
```

## API Documentation

The API documentation is available through Swagger UI at:
- Development: http://localhost:3300/docs
- Production: https://your-domain/docs

All endpoints except authentication (/auth/*) require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer your-jwt-token
```

### Role-Based Access Control

The system implements three roles:
- `ADMIN`: Full access to all features
- `TEAM_LEADER`: Can manage teams and tasks
- `MEMBER`: Basic task management capabilities

#### Role Permissions:

1. Task Management:
   - Create Tasks: All roles
   - Update Tasks: All roles (own tasks or assigned tasks)
   - Delete Tasks: ADMIN, TEAM_LEADER
   - Assign Tasks: TEAM_LEADER, ADMIN

2. Team Management:
   - Create Teams: TEAM_LEADER, ADMIN
   - Update Teams: TEAM_LEADER (own teams), ADMIN
   - Delete Teams: ADMIN
   - Add/Remove Members: TEAM_LEADER (own teams), ADMIN

For more details about specific endpoints and their requirements, consult the Swagger documentation.
