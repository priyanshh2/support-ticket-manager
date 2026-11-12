# Mini Support Ticket Manager

A lightweight, responsive, full-stack Support Ticket Management application built using the MERN stack (MongoDB, Express.js, React, Node.js).

---

## 📑 Project Status

- **Phase 1: Project Initialization & Architecture** — ✅ Completed
- **Phase 2: Backend APIs & MongoDB Atlas Integration** — ✅ Completed & Verified
- **Phase 3: Frontend UI & Component Architecture** — ✅ Completed & Verified
- **Phase 4: Full Frontend-Backend API Integration** — ✅ Completed & Verified
- **Phase 5: Production Readiness & Quality Assurance** — ✅ Completed & Verified

---

## 🏗 Architecture & Directory Structure

```
support-ticket-manager/
├── client/                     # Frontend React application (Vite)
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── assets/             # Images, SVG icons, media
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ConfirmationDialog.jsx # Deletion guard modal
│   │   │   ├── EmptyState.jsx         # Zero-state placeholder
│   │   │   ├── Footer.jsx             # Footer
│   │   │   ├── Header.jsx             # Header with "+ Create Ticket"
│   │   │   ├── Navbar.jsx             # Brand bar & Phase badge
│   │   │   ├── StatsCards.jsx         # Dynamic metrics summary
│   │   │   ├── TicketCard.jsx         # Card with badges & status dropdown
│   │   │   ├── TicketForm.jsx         # Controlled ticket creation form
│   │   │   └── TicketList.jsx         # Ticket card feed
│   │   ├── pages/
│   │   │   └── Dashboard.jsx   # Live dashboard coordinator
│   │   ├── services/
│   │   │   └── api.js          # Centralized API service (native fetch)
│   │   ├── App.jsx             # Root layout
│   │   ├── index.css           # Global responsive CSS design system
│   │   └── main.jsx            # React DOM mounting entry point
│   ├── .env                    # Local client environment (gitignored)
│   ├── .env.example            # Client environment variable template
│   ├── .gitignore              # Client git ignore rules
│   ├── index.html              # HTML shell
│   ├── package.json            # Client dependencies & scripts
│   ├── vercel.json             # Vercel SPA routing configuration
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Backend Express REST API
│   ├── src/
│   │   ├── config/             # Configuration modules (env.js, db.js)
│   │   ├── controllers/        # Request handlers (health, ticket)
│   │   ├── middlewares/        # Middlewares (dbCheck, error, notFound)
│   │   ├── models/             # Mongoose Ticket schema
│   │   ├── routes/             # Express routes (health.routes.js, ticket.routes.js)
│   │   ├── app.js              # Express app setup, CORS, and error handlers
│   │   └── server.js           # Server listen entry point
│   ├── .env                    # Local environment variables (gitignored)
│   ├── .env.example            # Server environment variable template
│   ├── .gitignore              # Server git ignore rules
│   └── package.json            # Server dependencies & scripts
│
├── .env.example                # Root environment variable template
├── .gitignore                  # Monorepo-level git ignore rules
├── package.json                # Root orchestration package.json (concurrently)
└── README.md                   # Comprehensive project documentation
```

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite 8, Pure CSS (Modern variables, responsive breakpoints)
- **Backend:** Node.js (v23+), Express.js (v4), CORS, Dotenv, Mongoose 8
- **Database:** MongoDB Atlas (`support_ticket_manager`)
- **Hosting Targets:**
  - Frontend: Vercel
  - Backend: Render
  - Database: MongoDB Atlas

---

## 🌐 Production Deployment Guide

### A. Deploying Backend to Render
1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Set Environment Variables in Render:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/support_ticket_manager?retryWrites=true&w=majority`
   - `PORT`: `10000` (or leave default, Render sets this automatically)
   - `CLIENT_URL`: `https://your-app.vercel.app`
   - `NODE_ENV`: `production`

### B. Deploying Frontend to Vercel
1. Create a new **Project** on [Vercel](https://vercel.com/).
2. Connect your GitHub repository.
3. Configure the project settings:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Set Environment Variables in Vercel:
   - `VITE_API_URL`: `https://your-render-backend-url.onrender.com/api`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health-check endpoint verifying backend status |
| `GET` | `/api/tickets` | Retrieve all tickets (newest first) |
| `POST` | `/api/tickets` | Create a new ticket (`title`, `description`, `priority`) |
| `PATCH` | `/api/tickets/:id` | Update status (`Open`, `In Progress`, `Resolved`) |
| `DELETE` | `/api/tickets/:id` | Permanently delete a ticket |

---

## 💻 Local Development

### Prerequisites
- Node.js v18+
- npm v10+

### Run Both Concurrently
```bash
npm run dev
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)
- Health Check: [http://localhost:5000/api/health](http://localhost:5000/api/health)
