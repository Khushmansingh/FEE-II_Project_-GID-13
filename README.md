# 📁 Campus Vault

A modern, high-performance web application for uploading, browsing, managing, and downloading academic resources across campus. Built as part of the **FEE-II Project (GID-13)**.

---

## ✨ Features & Architecture

- **SPA Routing (React Router v7)** — Nested layout routing (`<Outlet />`), active navigation states, dynamic resource routes (`/notes/:id`), student academic profile (`/profile`), and 404 Not Found handling.
- **State Architecture & Context API**
  - **`AuthContext`** — Centralized user session, authentication states (`signIn`, `signUp`, `signOut`, `updatePassword`), and profile synchronization.
  - **`ThemeContext`** — Dark and light mode toggle with `localStorage` persistence.
  - **`ToastContext`** — Non-blocking animated toast notification system replacing crude browser alerts.
- **Complete CRUD Workflow**
  - **Create**: Upload documents (PDF, DOCX, PPTX) to specific course categories with drag-and-drop.
  - **Read**: Browse verified notes with debounced search, category filter chips, and sorting (Recent, Popular, A–Z, Size). Includes both Grid and Table view modes.
  - **Update**: Edit resource title, topic/subject, and course category in real time via modal.
  - **Delete**: Safe removal of files from Supabase Storage and database with confirmation dialog.
- **Interactive UI Components** — Accessible dialog modals, confirmation alerts, tab switchers, user profile dropdowns, empty states, and animated loading indicators.
- **Student Profile Management** — Integrated with `profiles` table to track branch, semester, bio, and student uploads.
- **Analytics Dashboard** — Visualizes uploads by course (Bar Chart) and storage consumption (Donut Chart) using Recharts.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7 |
| **State Management** | React Context API (`AuthContext`, `ThemeContext`, `ToastContext`), Custom Hooks (`useDebounce`) |
| **Styling** | Tailwind CSS v4, CSS Custom Properties (Design Tokens) |
| **Icons** | Google Material Symbols Outlined, Lucide React |
| **Charts** | Recharts v3 |
| **Build Tool** | Vite 8 |
| **Backend / DB** | Supabase (PostgreSQL + Storage Bucket) |
| **Fonts** | Plus Jakarta Sans |

---

## 📂 Project Structure

```
src/
├── api/
│   ├── filesService.js        # Centralized CRUD & Supabase Storage operations
│   └── profileService.js      # Student profile queries and upserts
├── components/
│   ├── common/
│   │   ├── Button.jsx         # Accessible button with variants & loading state
│   │   ├── Input.jsx          # Controlled input with error & icon support
│   │   ├── Select.jsx         # Accessible select dropdown
│   │   ├── Modal.jsx          # Accessible dialog with ESC & backdrop handling
│   │   ├── ConfirmationModal.jsx # Destructive action confirmation dialog
│   │   ├── Dropdown.jsx       # User action dropdown menu
│   │   ├── Tabs.jsx           # Reusable tab switcher (Grid vs List, etc.)
│   │   ├── EmptyState.jsx     # Friendly zero-data visual fallback
│   │   └── LoadingSpinner.jsx # Centralized spinner indicator
│   ├── forms/
│   │   └── EditResourceModal.jsx # Resource metadata update modal
│   ├── layout/
│   │   ├── Layout.jsx         # Main layout route with Outlet & responsive drawer
│   │   ├── Sidebar.jsx        # Sidebar with NavLink active states
│   │   └── Header.jsx         # Sticky header with actions, theme & profile menu
│   ├── Home.jsx               # Upload Resource page with drag-and-drop
│   ├── Browse.jsx             # Notes repository with debounced search & sorting
│   ├── Dashboard.jsx          # Visual analytics & metrics
│   ├── ResourceDetail.jsx     # Dynamic note detail page (/notes/:id)
│   ├── Profile.jsx            # Student academic profile & personal uploads (/profile)
│   └── NotFound.jsx           # 404 page for unknown routes
├── context/
│   ├── AuthContext.jsx        # Authentication and session state
│   ├── ThemeContext.jsx       # Dark / Light theme state
│   └── ToastContext.jsx       # Non-intrusive toast notifications
├── hooks/
│   └── useDebounce.js         # Debounced value hook for search
├── utils/
│   ├── formatters.js          # Byte size, date, and extension formatters
│   └── validators.js          # Client-side validation rules
├── App.jsx                    # Root router configuration & provider hierarchy
├── Auth.jsx                   # Sign In / Sign Up portal
├── UpdatePassword.jsx         # Password recovery workflow
├── supabaseClient.js          # Supabase client initialization
├── index.css                  # Tailwind styles and theme tokens
└── main.jsx                   # Application entry point
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema
Execute the SQL in [`supabase_schema.sql`](supabase_schema.sql) in your Supabase SQL Editor.

### 4. Run Locally
```bash
npm run dev
```

### 5. Production Build & Lint
```bash
npm run lint
npm run build
```

---

## 👥 Team — GID-13

| Name | Role |
|---|---|
| Khushman Singh | Developer |
| Gitansh | Developer |
