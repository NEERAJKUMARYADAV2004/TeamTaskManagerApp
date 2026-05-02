# AuraTask - Premium Team Task Manager

A high-end, glassmorphic task management MVP built with the MERN stack.

## 🚀 Live Demo
- **Frontend**: [team-task-manager-app-kappa.vercel.app](https://team-task-manager-app-kappa.vercel.app/)
- **Backend API**: [teamtaskmanagerapp.onrender.com/api](https://teamtaskmanagerapp.onrender.com/api)

## 🎨 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS (Glassmorphism), Lucide Icons
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (Atlas)
- **Auth**: Custom JWT-based security (Protect & RestrictTo middlewares)

## ✨ Key Features
- **Elite Glassmorphic UI**: High-end aesthetic with mesh gradients, backdrop blurs, and polished interactions.
- **Advanced 3-Column Dashboard**: 
  - **Left Sidebar**: Project management and workspace switching.
  - **Center Feed**: Independent scrollable task workspace.
  - **Right Sidebar**: Admin task assignment panel.
- **Task Descriptions**: Detailed context for every task, displayed in styled cards.
- **Sticky Architecture**: Fixed sidebars and independent scrolling for a smooth, modern app-like experience.
- **RBAC (Role Based Access Control)**:
  - **ADMIN**: Forge projects, assign tasks with descriptions, and oversee operations.
  - **MEMBER**: Focused workspace for assigned tasks with status deployment.
- **Task Analytics**: Overdue indicators and visual status badges (Todo, In-Progress, Done).

## 🛠️ Local Setup

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

## 🌐 Deployment Info
- **Frontend**: Deployed on **Vercel**.
- **Backend**: Deployed on **Render**.
- **Database**: Hosted on **MongoDB Atlas**.
