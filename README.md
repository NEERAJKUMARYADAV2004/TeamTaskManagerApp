# AuraTask - Premium Team Task Manager

A high-end, glassmorphic task management MVP built with the MERN stack.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS (Glassmorphism), Lucide Icons
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (Atlas)
- **Auth**: Custom JWT-based security (Protect & RestrictTo middlewares)

## Features
- **Elite Glassmorphic UI**: High-end aesthetic with mesh gradients, backdrop blurs, and polished interactions.
- **RBAC (Role Based Access Control)**:
  - **ADMIN**: Forge projects, assign tasks to specialists, and oversee operations.
  - **MEMBER**: Focused workspace for assigned tasks with status deployment.
- **Task Analytics**: Overdue indicators and visual status badges (Todo, In-Progress, Done).

## Local Setup

### 1. Database
You need a MongoDB instance (Local or Atlas). Set your `DATABASE_URL` in `backend/.env`:
```env
DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/auratask"
JWT_SECRET="glass-morphic-secret-2024"
```

### 2. Backend
```bash
cd backend
npm install
npm run start
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Railway Deployment
1. **GitHub**: Push this repository to GitHub.
2. **Railway**:
   - Connect your GitHub repo.
   - Add **MongoDB Plugin** or provide your `DATABASE_URL` from Atlas.
   - Ensure `JWT_SECRET` is set in the environment variables.
   - Railway will automatically detect the entry points.
3. **Frontend**: Deploy the `dist` folder to Vercel or use Railway's static hosting.
