# LukaScope Agent Guidelines

This file contains project-specific information to help AI agents work effectively on the LukaScope codebase.

## Project Overview

LukaScope is an AI-powered blood smear analysis platform designed to help clinicians detect potential leukemia earlier, faster, and more consistently. The project is a monorepo using Bun workspaces with:

- **Frontend**: Next.js 16 with React 19, TypeScript, and Tailwind CSS v4
- **Backend**: Express.js with TypeScript and security middleware
- **AI Training**: Python workspace in `backend/ai` for dataset preparation and model training using PyTorch

## Architecture

### Monorepo Structure (Bun Workspace)
```
LukaScope/
├── frontend/          # Next.js 16 application
├── backend/           # Express.js API
│   ├── src/          # Backend source code
│   └── ai/           # Python AI training workspace
│       ├── hooks/    # Dataset loading and source-specific hooks
│       ├── functions/ # Preprocessing and training functions
│       └── requirements.txt
├── docs/             # Documentation and assets
└── package.json      # Root workspace configuration
```

### Frontend Structure
- **Framework**: Next.js 16 App Router
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Routes**:
  - `/` - Login screen (MVP static credential check)
  - `/dashboard` - Upload panel and project summary
  - `/analysis` - Simulated analysis overlay flow
  - `/results` - Paginated sample result grid
  - `/results/[id]` - Detailed single-sample result view
  - `/about` - About page placeholder
  - `/profile` - User profile page

### Backend Structure
- **Framework**: Express.js with TypeScript
- **Pattern**: Clean architecture with `hooks/` and `functions/` directories
- **Current Implementation**:
  - Health check endpoint: `GET /health`
  - Security middleware (CORS, Helmet)
  - Config management in `backend/src/config.ts`

### AI Training Structure
- **Language**: Python 3.11+
- **Framework**: PyTorch + Ultralytics YOLO
- **Pattern**: Separated into `hooks/` (dataset loading) and `functions/` (preprocessing/training)
- **Dependencies**: PyTorch, TorchVision, scikit-learn, OpenCV, Albumentations, SHAP, Matplotlib

## Development Commands

### Prerequisites
- Node.js 20+
- Bun 1.3+
- Python 3.11+ (for AI training)

### Installation
```bash
# Install all workspace dependencies from root
bun install

# Configure backend environment
cp backend/.env.example backend/.env

# Optional: Set up Python AI environment
cd backend/ai
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Running the Project
Run each service in its own terminal:

```bash
# Terminal A: Backend API
bun run dev:backend
# Backend URL: http://localhost:3001

# Terminal B: Frontend App
bun run dev:frontend
# Frontend URL: http://localhost:3000

# Terminal C (Optional): Python AI training
cd backend/ai
source .venv/bin/activate
python functions/train_model.py
```

### Build Commands
```bash
bun run build:frontend  # Build frontend
bun run build:backend   # Build backend TypeScript
bun run lint:frontend   # Run frontend lint
```

## Code Conventions

### Frontend
- **Framework**: Next.js 16 App Router with TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui primitives
- **Components**: Use shadcn/ui components (`button`, `card`, `input`, `pagination`, `nav`)
- **State**: React 19 features with Framer Motion for animations
- **Icons**: Lucide React and Heroicons
- **File Organization**: App Router structure in `frontend/app/`

### Backend
- **Pattern**: Clean architecture with separation of concerns
- **Structure**:
  - `config.ts` - Configuration management
  - `hooks/` - Reusable logic and middleware hooks
  - `functions/` - Pure functions and business logic
  - `index.ts` - Express app setup and route registration
- **Security**: CORS and Helmet middleware enabled
- **Environment**: Use dotenv for configuration

### AI Training
- **Pattern**: Separated into `hooks/` and `functions/` for maintainability
- **Hooks**: Dataset loading and source-specific logic
- **Functions**: Preprocessing, training, and evaluation functions
- **Documentation**: See `backend/ai/README.md` for detailed AI workflow

## Testing Strategy

### Current Status
Formal test scripts are not yet wired in `frontend/package.json` and `backend/package.json`. This is a planned implementation phase.

### Planned Testing Approach

**Frontend Testing**:
- Unit tests for UI components, utility functions, and page-level logic
- Integration tests for key flows: login, dashboard interactions, analysis state transitions, results rendering
- End-to-end tests for critical user journeys
- Accessibility and regression checks on core pages

**Backend Testing**:
- Unit tests for pure functions (`functions/`) and configuration parsing
- Integration tests for API handlers, middleware behavior, and error contracts
- Contract tests for response shape and status codes
- Smoke tests for `/health` and startup configuration

**Test Execution**:
1. Run fast unit tests on every commit/PR
2. Run integration + end-to-end suites in CI before merge
3. Block merges when lint/build/tests fail
4. Track coverage trend and enforce minimum thresholds

## Environment Variables

### Backend (.env)
Based on `backend/.env.example`:
- `PORT` - API server port (default: 3001)
- `NODE_ENV` - Runtime environment (development/production)
- `FRONTEND_URL` - CORS allowed origin (default: http://localhost:3000)

## API Routes

### Implemented
- `GET /health` - Backend health/status metadata
- `POST /api/login` - Frontend route handler for MVP login (static credential check)

### Planned
- `/api/auth` - Authentication endpoints
- `/api/upload` - Sample upload handling
- `/api/analysis` - Analysis request processing
- `/api/results` - Results retrieval and management

## Key Dependencies

### Frontend
- `next` 16.0.10 - React framework
- `react` 19.2.0 - UI library
- `framer-motion` - Animation library
- `lucide-react` - Icon components
- `@radix-ui/react-slot` - UI primitive components
- `tailwindcss` v4 - CSS framework

### Backend
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `dotenv` - Environment configuration

### AI Training
- `torch` - Deep learning framework
- `torchvision` - Computer vision utilities
- `ultralytics` - YOLO models
- `scikit-learn` - Machine learning utilities
- `opencv-python` - Image processing
- `albumentations` - Image augmentation
- `shap` - Explainability
- `matplotlib` - Visualization

## Workflow Guidelines

### Before Making Changes
1. Read relevant files to understand existing patterns
2. Check for existing libraries/frameworks before adding new dependencies
3. Follow the established `hooks/` and `functions/` pattern in backend
4. Use shadcn/ui components for UI elements when possible

### Dependency Management
- Always run `bun install` from the repo root (workspace level)
- Avoid running separate installs in `frontend/` or `backend/` directories
- When adding dependencies, prefer running `bun add` instead of editing package.json manually

### Code Style
- Follow TypeScript best practices
- Use compact code – collapse duplicate else branches, avoid unnecessary nesting
- Avoid excessive verbose error handling; focus on appropriate error boundaries
- Do NOT add or remove comments unless asked
- Default to writing idiomatic code for the respective language/framework

### Git Workflow
- Create feature branches for changes
- Keep changes scoped by layer (frontend or backend)
- Run lint/build before opening PRs
- Update this AGENTS.md when behavior or setup changes

## Verification Steps

Before considering a task complete:
1. Run relevant build commands (`bun run build:frontend`, `bun run build:backend`)
2. Run lint commands (`bun run lint:frontend`)
3. Test the specific functionality that was changed
4. For UI changes, verify in the browser if possible
5. For backend changes, verify API endpoints respond correctly

## Important Notes

- **Workspace Model**: This is a Bun workspace monorepo – always install dependencies from the root
- **AI Separation**: Python AI training logic is cleanly separated from the TypeScript backend API
- **Security**: Never commit secrets or keys to the repository
- **Medical Context**: This is a medical application – prioritize accuracy, reliability, and clear error handling
- **Performance**: AI model training prioritizes sensitivity/recall for early suspicious-case flagging

## Resources

- Main README: `README.md`
- AI Documentation: `backend/ai/README.md`
- Frontend: Next.js 16 documentation
- Backend: Express.js documentation
- AI Training: PyTorch and Ultralytics documentation
