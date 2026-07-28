# AI Tooling Chat History & Prompts

*This document contains the prompt history and interactions with the AI assistant during the development of this project.*

### Initial Prompt
```
TDD Kata: Car Dealership Inventory System 
[Pasted the entire assessment requirements covering Backend API, Frontend SPA, TDD, Clean Code, Git, and AI Usage Policy]
```

### AI Response & Planning
The AI generated a comprehensive 9-phase implementation plan:
1. Project Scaffolding & Database
2. Backend Core
3. Auth Module (TDD)
4. Vehicles Module (TDD)
5. Inventory Module (TDD)
6. Frontend Setup
7. Frontend Pages & Components
8. Frontend Tests
9. Documentation & Polish

### Development Interactions
1. **Approval**: Approved the PostgreSQL + Prisma + React + Vite + Tailwind v3 stack.
2. **Execution**: AI executed the plan, creating the Git repo, generating standard ignores, package files, and Prisma schema.
3. **TDD Flow**: AI generated failing tests for the `Auth` module, then implemented the logic to pass them. This process was repeated for `Vehicles` and `Inventory`.
4. **Database Setup**: AI attempted to run migrations but PostgreSQL was not installed locally. Prompted the AI to provide instructions to install PostgreSQL via EDB.
5. **Password Issue**: After installing PostgreSQL, the AI's default password (`password`) didn't match the one set during installation.
   - *Prompt*: Provided the actual password `[REDACTED]`.
   - *AI Action*: The AI URL-encoded the password in the `.env` file since it contained special characters (`@`), and successfully ran the migration and seed script.
6. **Backend Tests**: AI ran `npm run test:coverage`. Found 3 test suite failures due to Express 5 type mismatches (`req.params.id` being typed as `string | string[]`).
   - *AI Action*: Used `multi_replace_file_content` to cast the params as `string` in the controllers. Reran tests — 100% pass, 94% coverage.
7. **Frontend Setup**: AI ran Vite initialization, installed Tailwind dependencies, and generated global CSS, layouts, Auth context, and Axios interceptors.
8. **Frontend Components**: AI generated `LoginPage`, `RegisterPage`, `DashboardPage`, `VehicleCard`, `SearchBar`, and `VehicleForm`.
9. **Frontend Tests**: AI wrote Vitest tests for `VehicleCard` and `SearchBar`.
   - *Issue*: `SearchBar` debounce test failed.
   - *AI Action*: Adjusted the test assertions and `waitFor` timing to account for React state updates and the 500ms timeout clearing logic.
10. **Final Polish**: AI generated this `PROMPTS.md` and the `README.md` with the AI usage reflection.
