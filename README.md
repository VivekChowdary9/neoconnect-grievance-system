# NeoConnect — Staff Feedback & Complaint Management Platform

NeoConnect is a full-stack web application for transparent, role-based complaint and feedback management across an organization.

It allows users to register, log in, submit complaints, track complaint progress, participate in polls, view public updates, and manage complaint workflows based on role permissions.

---

````md
## Live Links

Frontend Login:
`https://neoconnect-grievance-system.vercel.app/login`

Backend Base URL:
`https://neoconnect-backend-i3q1.onrender.com/`

GitHub Repository:
`https://github.com/VivekChowdary9/neoconnect-grievance-system`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| File Uploads | Multer |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## Project Structure

```text
neoconnect-grievance-system/
├── backend/
│   ├── config/              # Database connection setup
│   ├── controllers/         # Route logic
│   ├── middleware/          # Auth and role protection
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── uploads/             # Uploaded files
│   ├── utils/               # Utility functions
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable components
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Helper functions
│   ├── services/            # API service files
│   ├── styles/              # Global styles
│   ├── public/              # Static assets
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.local
│   └── next.config.js
│
└── README.md
````

---

## Main Features

* Role-based authentication and authorization
* Complaint submission and tracking
* Complaint assignment workflow
* Department-based complaint handling
* Public hub for announcements and minutes
* Poll creation and voting
* Analytics dashboard
* File upload support
* Auto-escalation for inactive complaints
* Admin user management

---

## User Roles and Permissions

| Role           | Description                | Permissions                                                                 |
| -------------- | -------------------------- | --------------------------------------------------------------------------- |
| `staff`        | General employee/user      | Submit complaints, view own/allowed cases, vote in polls, access public hub |
| `secretariat`  | Complaint review authority | View all cases, assign case managers, create polls, upload public minutes   |
| `case_manager` | Complaint handler          | View assigned complaints, update status, add notes, close cases             |
| `admin`        | Full system controller     | Manage users, roles, analytics, all complaints, all modules                 |

---

## Complaint Lifecycle

```text
New
 ↓
Assigned
 ↓
In Progress
 ↓
Pending
 ↓
Resolved

If not updated for 7 days:
Pending / Assigned / In Progress → Escalated
```

Tracking ID format:

```text
NEO-YYYY-NNN
Example: NEO-2026-001
```

---

## Default Demo Login Credentials

Use these accounts to test different roles.

> Change these passwords after deployment if needed.

| Role         | Email                        | Password     |
| ------------ | ---------------------------- | ------------ |
| Admin        | `admin@neoconnect.com`       | `Admin@123`  |
| Secretariat  | `secretariat@neoconnect.com` | `Secret@123` |
| Case Manager | `casemanager@neoconnect.com` | `Case@123`   |
| Staff        | `staff@neoconnect.com`       | `Staff@123`  |

---

## Public URLs

### Frontend

```text
https://neoconnect-grievance-system.vercel.app/login
```

### Backend

```text
https://neoconnect-backend-i3q1.onrender.com/
```

### GitHub Repository

```text
https://github.com/VivekChowdary9/neoconnect-grievance-system
```

---

## API Base URL

For deployed frontend:

```env
NEXT_PUBLIC_API_URL=https://neoconnect-backend-i3q1.onrender.com/api
```

For local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Installation Guide

This guide is written in simple step-by-step format so that anyone can download, install, and run the project.

---

## Prerequisites

Install the following software before starting:

```text
1. Node.js (version 18 or above)
2. npm
3. Git
4. MongoDB Community Server OR MongoDB Atlas
5. VS Code (recommended)
6. Postman (optional, for API testing)
```

Check installation:

```bash
node -v
npm -v
git --version
```

---

## Step 1 — Clone the Repository

Open terminal or PowerShell and run:

```bash
git clone https://github.com/VivekChowdary9/neoconnect-grievance-system.git
cd neoconnect-grievance-system
```

---

## Step 2 — Install Backend Dependencies

Move into backend folder:

```bash
cd backend
npm install
```

This installs required backend packages such as:

```text
express
mongoose
jsonwebtoken
bcryptjs
cors
dotenv
multer
node-cron
```

---

## Step 3 — Create Backend Environment File

Inside the `backend` folder, create a file named:

```text
.env
```

Paste this inside:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/neoconnect
JWT_SECRET=your_super_secret_key_here
```

If you are using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/neoconnect
```

---

## Step 4 — Start Backend Server

Run this command inside the `backend` folder:

```bash
npm start
```

If you use nodemon and have a dev script:

```bash
npm run dev
```

Expected output:

```text
NeoConnect API running on port 5000
MongoDB Connected
```

Backend will run at:

```text
http://localhost:5000
```

---

## Step 5 — Install Frontend Dependencies

Open a new terminal.

Move into frontend folder:

```bash
cd frontend
npm install
```

This installs required frontend packages such as:

```text
next
react
react-dom
axios
recharts
lucide-react
tailwindcss
```

---

## Step 6 — Create Frontend Environment File

Inside the `frontend` folder, create a file named:

```text
.env.local
```

Paste this:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For deployed backend, use:

```env
NEXT_PUBLIC_API_URL=https://neoconnect-backend-i3q1.onrender.com/api
```

---

## Step 7 — Start Frontend Server

Run this command inside the `frontend` folder:

```bash
npm run dev
```

Expected output:

```text
Local: http://localhost:3000
```

Frontend will run at:

```text
http://localhost:3000
```

---

## Step 8 — Open the Application

Open your browser and visit:

```text
http://localhost:3000
```

Login page:

```text
http://localhost:3000/login
```

Register page:

```text
http://localhost:3000/register
```

---

## Step 9 — Login With Demo Accounts

Use any of these credentials:

```text
Admin
Email: admin@neoconnect.com
Password: Admin@123
```

```text
Secretariat
Email: secretariat@neoconnect.com
Password: Secret@123
```

```text
Case Manager
Email: casemanager@neoconnect.com
Password: Case@123
```

```text
Staff
Email: staff@neoconnect.com
Password: Staff@123
```

---

## Step 10 — API Testing With Postman

Backend base URL:

```text
http://localhost:5000/api
```

Deployed backend base URL:

```text
https://neoconnect-backend-i3q1.onrender.com/api
```

---

## Authentication APIs

### Register User

```http
POST /api/auth/register
```

Example URL:

```text
http://localhost:5000/api/auth/register
```

Example JSON body:

```json
{
  "name": "Admin User",
  "email": "admin@neoconnect.com",
  "password": "Admin@123",
  "department": "Administration",
  "role": "admin"
}
```

---

### Login User

```http
POST /api/auth/login
```

Example URL:

```text
http://localhost:5000/api/auth/login
```

Example JSON body:

```json
{
  "email": "admin@neoconnect.com",
  "password": "Admin@123"
}
```

---

### Get Current User

```http
GET /api/auth/me
```

Add header:

```text
Authorization: Bearer <your_token>
```

---

## Case APIs

### Create Complaint

```http
POST /api/cases
```

### Get All Complaints

```http
GET /api/cases
```

### Get Complaint By ID

```http
GET /api/cases/:id
```

### Update Complaint

```http
PUT /api/cases/:id
```

### Delete Complaint

```http
DELETE /api/cases/:id
```

### Assign Complaint

```http
PUT /api/cases/assign/:id
```

---

## Poll APIs

### Create Poll

```http
POST /api/polls
```

### Get Polls

```http
GET /api/polls
```

### Vote in Poll

```http
POST /api/polls/vote
```

---

## Analytics APIs

### Get Case Analytics

```http
GET /api/analytics/cases
```

---

## User APIs

### Get All Users

```http
GET /api/users
```

### Update User

```http
PUT /api/users/:id
```

### Delete User

```http
DELETE /api/users/:id
```

---

## Public Hub APIs

### Upload Minutes

```http
POST /api/public/minutes
```

### Get Minutes

```http
GET /api/public/minutes
```

### Post Announcement

```http
POST /api/public/updates
```

### Get Announcements

```http
GET /api/public/updates
```

---

## Example Local Development Commands

Run backend:

```bash
cd backend
npm install
npm start
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## Example Full Setup Commands From Scratch

```bash
git clone https://github.com/VivekChowdary9/neoconnect-grievance-system.git
cd neoconnect-grievance-system

cd backend
npm install

cd ../frontend
npm install
```

Then create environment files:

```env
# backend/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/neoconnect
JWT_SECRET=your_super_secret_key_here
```

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Then start both servers:

```bash
# terminal 1
cd backend
npm start
```

```bash
# terminal 2
cd frontend
npm run dev
```

---

## Deployment Information

### Frontend Deployment

Frontend is deployed on Vercel:

```text
https://neoconnect-grievance-system.vercel.app/login
```

### Backend Deployment

Backend is deployed on Render:

```text
https://neoconnect-backend-i3q1.onrender.com/
```

### GitHub Repository

Source code is available here:

```text
https://github.com/VivekChowdary9/neoconnect-grievance-system
```

---

## Important Notes

```text
1. MongoDB must be running before backend starts.
2. Backend must be running before frontend can call APIs.
3. frontend/.env.local must contain the correct backend API URL.
4. backend/.env must contain valid MongoDB URI and JWT secret.
5. Use different demo accounts to test different roles.
6. Some admin-only features require login with admin account.
7. Render free backend may sleep after inactivity; first request can be slow.
```

---

## Architecture Overview

```text
User Browser
   |
   v
Frontend (Next.js / React)
   |
   v
Backend API (Node.js / Express)
   |
   v
MongoDB Database
```

Detailed flow:

```text
1. User opens frontend in browser
2. Frontend sends API request to backend
3. Backend verifies JWT token and role
4. Backend reads/writes data from MongoDB
5. Backend returns JSON response
6. Frontend updates UI
```

---

## Built Modules

```text
1. Authentication Module
2. Complaint Submission Module
3. Complaint Tracking Module
4. Poll and Voting Module
5. Public Hub Module
6. Analytics Module
7. User Management Module
8. Role-Based Dashboard Module
```

---

## Security Features

```text
1. Password hashing using bcrypt
2. JWT-based authentication
3. Role-based route protection
4. Secure environment variable usage
5. File upload handling using Multer
```

---

## Sample Demo Workflow

```text
1. Login as staff
2. Submit a complaint
3. Login as secretariat
4. View all complaints
5. Assign complaint to case manager
6. Login as case manager
7. Update complaint status
8. Mark complaint as resolved
9. Login as admin
10. View analytics and manage users
```

---

## Troubleshooting

### Problem: Backend not starting

```text
Check:
- MongoDB is running
- .env file exists in backend
- MONGO_URI is correct
- PORT is free
```

### Problem: Frontend not connecting to backend

```text
Check:
- backend is running on port 5000
- NEXT_PUBLIC_API_URL is correct
- CORS settings allow frontend URL
```

### Problem: Login not working

```text
Check:
- user exists in database
- password is correct
- role is valid
- JWT_SECRET is set properly
```

### Problem: `next` is not recognized

```text
Run:
npm install
```

### Problem: MongoDB connection error

```text
Check:
- MongoDB service is active
- local URI or Atlas URI is correct
- network access is allowed in Atlas
```

---

## License

```text
This project is created for educational and portfolio purposes.
```

---

## Author

```text
Vivek Chowdary
GitHub: https://github.com/VivekChowdary9
```

```
```
