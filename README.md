# NeoConnect — Staff Feedback & Complaint Management Platform

NeoConnect is a full-stack web application for transparent, role-based complaint and feedback management across an organization.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| File Uploads | Multer |

---

## Project Structure

```
neoconnect/
├── frontend/           # Next.js frontend
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── submit-case/
│   │   ├── cases/
│   │   │   └── [id]/
│   │   ├── polls/
│   │   ├── public-hub/
│   │   ├── analytics/
│   │   └── users/
│   ├── components/
│   │   ├── layout/     # Sidebar, Navbar, DashboardLayout
│   │   └── ui/         # Badges, StatCard, Modal
│   ├── services/       # API, auth, case, poll services
│   ├── hooks/          # useAuth (AuthContext)
│   └── lib/            # utils (cn, formatDate, etc.)
└── backend/            # Express REST API
    ├── config/         # MongoDB connection
    ├── controllers/    # Business logic
    ├── models/         # Mongoose schemas
    ├── routes/         # API routes
    ├── middleware/      # auth + role protection
    └── utils/          # Tracking ID generator
```

---

## User Roles & Permissions

| Role | Permissions |
|---|---|
| **staff** | Submit cases, vote in polls, view public hub |
| **secretariat** | View all cases, assign case managers, create polls, upload minutes |
| **case_manager** | View assigned cases, update status, add notes, close cases |
| **admin** | Everything — manage users, roles, view analytics |

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone & Install

```bash
# Clone the repo
git clone <repo-url>
cd neoconnect

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Environment Variables

#### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/neoconnect
JWT_SECRET=your_super_secret_key_here_make_it_long
```

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 3. Run the Application

Open two terminals:

#### Terminal 1 — Backend
```bash
cd backend
npm run dev
# API runs on http://localhost:5000
```

#### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

---

### 4. Create Your First Admin Account

Visit `http://localhost:3000/register` and register with role `admin` to get full access.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Cases
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/cases` | All | Submit case (multipart) |
| GET | `/api/cases` | All | Get cases (role-filtered) |
| GET | `/api/cases/:id` | All | Get case by ID |
| PUT | `/api/cases/:id` | CM/Sec/Admin | Update case |
| DELETE | `/api/cases/:id` | Admin | Delete case |
| PUT | `/api/cases/assign/:id` | Sec/Admin | Assign case manager |

### Polls
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/polls` | Sec/Admin | Create poll |
| GET | `/api/polls` | All | Get polls |
| POST | `/api/polls/vote` | All | Vote in poll |

### Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/analytics/cases` | Admin/Sec | Case analytics + hotspots |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | Admin/Sec | List users |
| PUT | `/api/users/:id` | Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |

### Public Hub
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/public/minutes` | Sec/Admin | Upload minutes PDF |
| GET | `/api/public/minutes` | All | List minutes |
| POST | `/api/public/updates` | Sec/Admin | Post announcement |
| GET | `/api/public/updates` | All | List announcements |

---

## Case Lifecycle

```
New → Assigned → In Progress → Pending → Resolved
                                        ↘ Escalated (auto, 7 days no update)
```

Auto-escalation runs daily via cron job at midnight.

Tracking ID format: `NEO-YYYY-NNN` (e.g. `NEO-2025-001`)

---

## Features

- ✅ JWT authentication with role-based access control
- ✅ Anonymous complaint submission
- ✅ File uploads (images + PDFs)
- ✅ Auto-escalation via cron (7 days inactivity)
- ✅ Case assignment workflow (Secretariat → Case Manager)
- ✅ Notes/activity log per case
- ✅ Resolution tracking (action taken + result)
- ✅ Poll system with one-vote-per-user enforcement
- ✅ Poll results visualized with bar charts
- ✅ Public hub: resolved cases digest, impact tracking table, minutes archive, announcements
- ✅ Analytics: cases by department, category, status + hotspot detection
- ✅ User management (admin)

---

## Design System

- **Fonts**: Syne (headings) + DM Sans (body)
- **Colors**: Deep navy sidebar + indigo primary accent
- **Components**: Custom StatCard, StatusBadge, SeverityBadge, RoleBadge, Modal, DashboardLayout

---

## Production Notes

- Set a strong `JWT_SECRET` (32+ random characters)
- Use MongoDB Atlas for production database
- Add HTTPS via reverse proxy (nginx/Caddy)
- Serve uploads via CDN or cloud storage (AWS S3) in production
- Set `NODE_ENV=production` and run `next build` for frontend
