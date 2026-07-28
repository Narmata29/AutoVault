# AutoVault - Car Dealership Inventory System

A robust full-stack Car Dealership Inventory System built with Test-Driven Development (TDD).

## Features
- **Authentication**: JWT-based login and registration system.
- **Role-Based Access Control**: Separate `USER` and `ADMIN` roles.
- **Inventory Management**: Admins can add, edit, delete, and restock vehicles.
- **Browsing & Purchasing**: Users can search via advanced filters and purchase vehicles (decreasing stock).
- **Responsive Design**: Modern, glass-morphism inspired UI built with Tailwind CSS v3 and Lucide React icons.

## Tech Stack
**Backend**:
- Node.js & Express (TypeScript)
- Prisma ORM & PostgreSQL
- Zod (Validation), bcryptjs, jsonwebtoken
- Jest & Supertest (TDD / API Testing)

**Frontend**:
- React 18 & Vite (TypeScript)
- Tailwind CSS v3
- Axios (HTTP client)
- React Router (Routing)
- Vitest & React Testing Library (TDD / Component Testing)

---

## My AI Usage

### AI Tools Used
- **Antigravity (Google DeepMind)** - Main agent used for pair-programming this assessment.

### How I Used Them
- **Architecture & Planning**: I used the AI to define a strict 9-phase TDD implementation plan covering both backend and frontend structure.
- **Boilerplate & Backend Logic**: The AI generated the boilerplate for Express middleware, Zod schemas, and Prisma configurations. 
- **TDD Execution**: I asked the AI to write unit/integration tests first for the `Auth`, `Vehicle`, and `Inventory` modules (Red step). The AI then implemented the services/controllers to make the tests pass (Green step).
- **Frontend SPA**: The AI scaffolded the Vite + React app, set up Tailwind CSS v3, and generated modular components like `VehicleCard`, `SearchBar`, and `VehicleForm`.
- **Debugging**: When we encountered a mismatch with Express 5 types and a debounce timing issue in Vitest, I prompted the AI to identify and fix the TypeScript assertions and `waitFor` timing assertions.

### Reflection on AI Impact
AI significantly accelerated the development workflow by handling the boilerplate and scaffolding instantly. Following TDD with an AI is highly effective because you can direct it to generate the contract (tests) first, ensuring its subsequent implementation strictly adheres to the requirements. The AI excelled at creating a robust backend and visually appealing frontend, though it required explicit guidance when resolving subtle type incompatibilities or async testing nuances.

---

## Setup Instructions

### 1. Database Setup
1. Install PostgreSQL and create a database named `car_dealership`.
2. Navigate to the `server/` directory and rename `.env.example` to `.env`.
3. Update the `DATABASE_URL` with your PostgreSQL credentials (e.g. `postgresql://postgres:password@localhost:5432/car_dealership`).

### 2. Backend Setup
```bash
cd server
npm install
npx prisma migrate dev --name init
npm run dev
```
*(The migration will automatically seed an admin user: `admin@cardealership.com` / `Admin123!` and 8 sample vehicles)*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The app will be running at `http://localhost:5173`.

### 4. Running Tests
**Backend Tests** (Jest):
```bash
cd server
npm run test:coverage
```

**Frontend Tests** (Vitest):
```bash
cd client
npx vitest run
```

---

## TDD Approach
The backend was built using strict TDD:
1. **Red**: Wrote tests using Jest + Supertest for `auth.service`, `auth.routes`, `vehicle.service`, `vehicle.routes`, `inventory.service`, and `inventory.routes`.
2. **Green**: Implemented the Prisma logic, Zod validation, and Express controllers to pass all suites.
3. **Refactor**: Abstracted error handling to a global middleware and validation to a generic Zod middleware.
Backend test coverage is over 94% across statements, branches, and functions.
