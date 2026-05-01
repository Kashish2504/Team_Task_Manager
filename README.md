# 🚀 TaskFlow — Team Task Manager

A full-stack web application for managing teams, projects, and tasks with role-based access control. Built with *FastAPI, **MongoDB, and **React*.

![Status](https://img.shields.io/badge/status-live-success)
![Python](https://img.shields.io/badge/python-3.11-blue)
![React](https://img.shields.io/badge/react-18-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)

---

## 🌐 Live Demo

- *🖥️ Frontend (App):* https://team-task-manager-g1soplhfn-kashish-omars-projects.vercel.app
- *⚙️ Backend (API):* https://team-task-manager-li1s.onrender.com
- *📚 API Docs (Swagger):* https://team-task-manager-li1s.onrender.com/docs

> ⚠️ *Note:* The backend is hosted on Render's free tier and may take *30–60 seconds to wake up* on the first request after inactivity. Please be patient on the first load.

---

## ✨ Features

### 🔐 Authentication
- Secure user signup & login
- JWT-based authentication
- Bcrypt password hashing
- Persistent sessions via localStorage

### 📁 Project Management
- Create, edit, and delete projects
- Add/remove team members by email
- Two roles: *Admin* and *Member*
- Owner protection (cannot be removed/demoted)
- Cascade delete (project → members + tasks)

### ✅ Task Management
- Kanban-style task board (To Do / In Progress / Done)
- Assign tasks to project members
- Set priority (Low / Medium / High)
- Due dates with *overdue detection*
- Status tracking with role-based permissions
- Filter tasks by status and assignee

### 📊 Dashboard
- Global dashboard with workspace stats
- Per-project dashboard
- Task breakdown by status & priority
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
- *Python 3.11* + *FastAPI* — High-performance async REST API
- *MongoDB Atlas* + *Motor* — NoSQL database with async driver
- *Pydantic v2* — Request/response validation
- *JWT (python-jose)* — Token-based auth
- *Bcrypt* — Password hashing
- *Uvicorn* — ASGI server

### Frontend
- *React 18* + *Vite* — Fast modern UI
- *TailwindCSS* — Utility-first styling
- *React Router v6* — Client-side routing
- *Axios* — HTTP client with JWT interceptor
- *Lucide React* — Icon library

### Hosting
- *Vercel* — Frontend (React)
- *Render* — Backend (FastAPI)
- *MongoDB Atlas* — Database (Free M0 Cluster)

---

## 📂 Project Structure


team-task-manager/
├── backend/
│   ├── app/
│   │   ├── controllers/      # Business logic
│   │   │   ├── auth_controller.py
│   │   │   ├── project_controller.py
│   │   │   ├── task_controller.py
│   │   │   └── dashboard_controller.py
│   │   ├── routes/           # API endpoints
│   │   │   ├── auth_routes.py
│   │   │   ├── project_routes.py
│   │   │   ├── task_routes.py
│   │   │   └── dashboard_routes.py
│   │   ├── schemas/          # Pydantic models
│   │   │   ├── auth_schema.py
│   │   │   ├── project_schema.py
│   │   │   ├── task_schema.py
│   │   │   └── dashboard_schema.py
│   │   ├── middleware/       # Auth + RBAC
│   │   │   ├── auth_middleware.py
│   │   │   └── rbac.py
│   │   ├── utils/            # Helpers
│   │   │   ├── jwt.py
│   │   │   ├── password.py
│   │   │   └── objectid.py
│   │   ├── config.py         # Env config
│   │   ├── database.py       # MongoDB connection
│   │   └── main.py           # FastAPI app entry
│   ├── requirements.txt
│   ├── runtime.txt
│   ├── Procfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios + service modules
│   │   │   ├── axios.js
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   └── dashboard.js
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── context/          # AuthContext
│   │   │   └── AuthContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   └── MyTasks.jsx
│   │   ├── utils/            # Helpers
│   │   │   └── format.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── .env.example
│
└── README.md


---

## 🗄️ Database Schema

### users
json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "created_at": "datetime"
}


### projects
json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "owner_id": "ObjectId (ref: users)",
  "created_at": "datetime",
  "updated_at": "datetime"
}


### project_members
json
{
  "_id": "ObjectId",
  "project_id": "ObjectId (ref: projects)",
  "user_id": "ObjectId (ref: users)",
  "role": "ADMIN | MEMBER",
  "joined_at": "datetime"
}


### tasks
json
{
  "_id": "ObjectId",
  "project_id": "ObjectId (ref: projects)",
  "title": "string",
  "description": "string",
  "status": "TODO | IN_PROGRESS | DONE",
  "priority": "LOW | MEDIUM | HIGH",
  "due_date": "datetime",
  "assignee_id": "ObjectId (ref: users)",
  "created_by": "ObjectId (ref: users)",
  "created_at": "datetime",
  "updated_at": "datetime"
}


### Indexes
- users.email — unique
- project_members(project_id, user_id) — unique compound
- tasks.project_id
- tasks.assignee_id

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint              | Description           | Auth Required |
|--------|-----------------------|-----------------------|:-------------:|
| POST   | /api/auth/signup    | Register new user     | ❌            |
| POST   | /api/auth/login     | Login & receive token | ❌            |
| GET    | /api/auth/me        | Get current user      | ✅            |

### Projects
| Method | Endpoint                                      | Access    |
|--------|-----------------------------------------------|-----------|
| POST   | /api/projects                               | Auth      |
| GET    | /api/projects                               | Auth      |
| GET    | /api/projects/{id}                          | Member    |
| PUT    | /api/projects/{id}                          | Admin     |
| DELETE | /api/projects/{id}                          | Owner     |
| POST   | /api/projects/{id}/members                  | Admin     |
| GET    | /api/projects/{id}/members                  | Member    |
| DELETE | /api/projects/{id}/members/{user_id}        | Admin     |
| PATCH  | /api/projects/{id}/members/{user_id}/role   | Admin     |

### Tasks
| Method | Endpoint                              | Access            |
|--------|---------------------------------------|-------------------|
| POST   | /api/projects/{id}/tasks            | Admin             |
| GET    | /api/projects/{id}/tasks            | Member            |
| GET    | /api/tasks/my                       | Auth              |
| GET    | /api/tasks/{id}                     | Member            |
| PUT    | /api/tasks/{id}                     | Admin             |
| PATCH  | /api/tasks/{id}/status              | Admin or Assignee |
| DELETE | /api/tasks/{id}                     | Admin             |

### Dashboard
| Method | Endpoint                              | Description      |
|--------|---------------------------------------|------------------|
| GET    | /api/dashboard                      | Global stats     |
| GET    | /api/projects/{id}/dashboard        | Project stats    |

> 💡 Full interactive API documentation available at **[/docs](https://team-task-manager-li1s.onrender.com/docs)** (Swagger UI).

---

## 🚀 Local Setup

### Prerequisites
- *Python 3.11+*
- *Node.js 20+*
- *MongoDB* (local) or *MongoDB Atlas* account

### 1. Clone the Repository
bash
git clone https://github.com/YOUR-USERNAME/team-task-manager.git
cd team-task-manager


### 2. Backend Setup

bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt


Create backend/.env:
env
MONGO_URI=mongodb://localhost:27017
DB_NAME=team_task_manager
JWT_SECRET=your-super-secret-key-change-this
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:5173


Run the server:
bash
uvicorn app.main:app --reload


- Backend: *http://localhost:8000*
- API Docs: *http://localhost:8000/docs*

### 3. Frontend Setup

bash
cd ../frontend
npm install


Create frontend/.env:
env
VITE_API_BASE_URL=http://localhost:8000


Run the dev server:
bash
npm run dev


Frontend: *http://localhost:5173*

---

## 🌐 Deployment

This project uses a multi-platform deployment strategy:

| Service   | Platform        | Live URL                                                                 |
|-----------|-----------------|--------------------------------------------------------------------------|
| Frontend  | *Vercel*      | https://team-task-manager-g1soplhfn-kashish-omars-projects.vercel.app    |
| Backend   | *Render*      | https://team-task-manager-li1s.onrender.com                              |
| Database  | *MongoDB Atlas* | Cloud (M0 Free Tier)                                                   |

### Backend Deployment (Render)

1. Push code to GitHub
2. Create a *Web Service* on [Render](https://render.com)
3. Connect repo & set:
   - *Root Directory:* backend
   - *Build Command:* pip install -r requirements.txt
   - *Start Command:* uvicorn app.main:app --host 0.0.0.0 --port $PORT
4. Add environment variables (see below)

### Frontend Deployment (Vercel)

1. Import the repo on [Vercel](https://vercel.com)
2. Set:
   - *Root Directory:* frontend
   - *Framework Preset:* Vite
3. Add environment variable: VITE_API_BASE_URL
4. Deploy

### MongoDB Setup (Atlas)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist all IPs (0.0.0.0/0) for cloud access
4. Use the connection string in MONGO_URI

---

## 🔒 Environment Variables

### Backend (backend/.env)

| Variable             | Description                            | Example                                  |
|----------------------|----------------------------------------|------------------------------------------|
| MONGO_URI          | MongoDB connection string              | mongodb+srv://user:pass@cluster.../db  |
| DB_NAME            | Database name                          | team_task_manager                      |
| JWT_SECRET         | Secret for JWT signing (min 32 chars)  | random-secure-string                   |
| JWT_ALGORITHM      | JWT signing algorithm                  | HS256                                  |
| JWT_EXPIRE_MINUTES | Token lifetime (minutes)               | 1440                                   |
| ENVIRONMENT        | development / production           | production                             |
| ALLOWED_ORIGINS    | Comma-separated CORS origins           | https://your-app.vercel.app            |

### Frontend (frontend/.env)

| Variable             | Description           | Example                                       |
|----------------------|-----------------------|-----------------------------------------------|
| VITE_API_BASE_URL  | Backend API base URL  | https://team-task-manager-li1s.onrender.com |

---

## 🧪 Testing the App

### Quick Demo Flow

1. *Open the live app:* https://team-task-manager-g1soplhfn-kashish-omars-projects.vercel.app
2. *Sign up* as User A (becomes the project Admin/Owner)
3. *Create a project* from the Projects page
4. *Sign up* as User B in another browser/incognito window
5. As User A, *add User B* to the project as a Member (by email)
6. As User A, *create tasks* and assign them to User B with priorities and due dates
7. As User B, log in and visit *My Tasks* → update task statuses
8. View the *Dashboard* to see real-time stats

### RBAC Demonstration

| Test | Expected Result |
|------|-----------------|
| Member tries to create a task | 403 Forbidden |
| Member updates assigned task status | ✅ Allowed |
| Member updates someone else's task | 403 Forbidden |
| Admin removes the project owner | 400 Bad Request |
| Non-member accesses project | 403 Forbidden |

---

## 🎯 Highlights

- ✅ *Async-first backend* with Motor for non-blocking MongoDB queries
- ✅ *Type-safe APIs* with Pydantic v2 validation everywhere
- ✅ *Reusable RBAC* dependencies (require_project_admin, require_project_owner)
- ✅ *Cascade deletes* to maintain data integrity
- ✅ *Auto-unassign* tasks when a member is removed
- ✅ *Server-side overdue detection* using indexed queries
- ✅ *MongoDB aggregation pipelines* for efficient dashboard stats
- ✅ *JWT auto-attach* & 401 auto-redirect on the frontend
- ✅ *Persistent sessions* with localStorage caching
- ✅ *Mobile responsive* UI with TailwindCSS

---

## 🐛 Known Limitations

- ⏰ Render free tier spins down after 15 minutes of inactivity (cold start ~30–60s on first request)
- 🔔 No real-time updates (would need WebSockets)
- 📧 No email notifications
- 💬 No task comments/attachments

These are intentional for the MVP scope and can be added in future iterations.

---

## 🚧 Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Email notifications (SendGrid/Resend)
- [ ] Task comments & file attachments
- [ ] Activity log / audit trail
- [ ] Drag-and-drop Kanban board
- [ ] Dark mode toggle
- [ ] User avatars upload
- [ ] Export tasks (CSV/PDF)
- [ ] OAuth (Google/GitHub login)

---


## 👨‍💻 Author

*Kashish Omar*

Built with ❤️ using FastAPI, MongoDB, and React.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) — Modern Python web framework
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — Cloud database
- [React](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — Build tool
- [TailwindCSS](https://tailwindcss.com/) — CSS framework
- [Vercel](https://vercel.com/) — Frontend hosting
- [Render](https://render.com/) — Backend hosting
- [Lucide](https://lucide.dev/) — Icon library