# 🚀 TaskFlow — Team Task Manager

A full-stack web application for managing teams, projects, and tasks with role-based access control. Built with **FastAPI**, **MongoDB**, and **React**.

![Status](https://img.shields.io/badge/status-live-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.11-blue)
![React](https://img.shields.io/badge/react-18-61dafb)

---

## 🌐 Live Demo

- **Frontend:** https://your-frontend-url.up.railway.app
- **Backend API:** https://your-backend-url.up.railway.app
- **API Docs (Swagger):** https://your-backend-url.up.railway.app/docs

> 🎥 **Demo Video:** [Watch on YouTube/Loom](https://your-video-link)

---

## ✨ Features

### 🔐 Authentication
- Secure user signup & login
- JWT-based authentication
- Bcrypt password hashing
- Persistent sessions

### 📁 Project Management
- Create, edit, and delete projects
- Add/remove team members by email
- Two roles: **Admin** and **Member**
- Owner protection (cannot be removed/demoted)

### ✅ Task Management
- Kanban-style task board (To Do / In Progress / Done)
- Assign tasks to project members
- Set priority (Low / Medium / High)
- Due dates with **overdue detection**
- Status tracking with role-based permissions

### 📊 Dashboard
- Global dashboard with workspace stats
- Per-project dashboard
- Tasks-by-status & priority breakdowns
- Recent tasks (last 5)
- Upcoming tasks (next 7 days)
- Overdue tasks count

### 🛡️ Role-Based Access Control (RBAC)
| Action                   | Owner | Admin | Member |
|--------------------------|:-----:|:-----:|:------:|
| View project & tasks     |   ✅  |   ✅  |   ✅   |
| Create/edit/delete tasks |   ✅  |   ✅  |   ❌   |
| Update task status       |   ✅  |   ✅  | ✅ (assigned only) |
| Add/remove members       |   ✅  |   ✅  |   ❌   |
| Edit project info        |   ✅  |   ✅  |   ❌   |
| Delete project           |   ✅  |   ❌  |   ❌   |

---

## 🛠️ Tech Stack

### Backend
- **Python 3.11** + **FastAPI** — High-performance async REST API
- **MongoDB** + **Motor** — NoSQL database with async driver
- **Pydantic v2** — Request/response validation
- **JWT (python-jose)** — Token-based auth
- **Bcrypt** — Password hashing
- **Uvicorn** — ASGI server

### Frontend
- **React 18** + **Vite** — Fast modern UI
- **TailwindCSS** — Utility-first styling
- **React Router v6** — Client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Lucide React** — Icon library

### Deployment
- **Railway** — Backend, MongoDB, and frontend hosting
- **GitHub** — Source control

---

## 📂 Project Structure
