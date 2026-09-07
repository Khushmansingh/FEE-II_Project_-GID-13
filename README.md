# 📁 Campus Vault

A modern web application for uploading, browsing, and downloading academic resources across campus. Built as part of the **FEE-II Project (GID-13)**.

---

## ✨ Features

- **Upload Documents** — Drag-and-drop or click to upload PDFs, DOCX, and PPTX files to specific campus locations.
- **Browse Notes** — Search, filter by location, and sort notes shared by students. Supports grid and list views.
- **Download Files** — One-click download of any uploaded resource directly from the browser.
- **Dark / Light Mode** — Toggle between dark and light themes with a single click. Preference is saved across sessions.
- **Supabase Backend** — Files are stored in Supabase Storage with metadata tracked in a PostgreSQL database.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7 |
| **Styling** | Vanilla CSS with CSS custom properties (design tokens) |
| **Icons** | Lucide React |
| **Build Tool** | Vite 8 |
| **Backend / DB** | Supabase (PostgreSQL + Storage) |
| **Fonts** | Space Grotesk, IBM Plex Sans (via Google Fonts) |

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Home.jsx          # Upload page with drag-and-drop
│   └── Home.css
├── context/
│   └── ThemeContext.jsx   # Dark/light theme provider (localStorage-persisted)
├── App.jsx               # Root component with routing
├── App.css
├── Browse.jsx            # Browse notes with search, filter, sort, download
├── Browse.css
├── Nav.jsx               # Sticky navbar with theme toggle
├── Nav.css
├── supabaseClient.js     # Supabase client configuration
├── index.css             # Global design tokens & theme variables
└── main.jsx              # App entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Supabase](https://supabase.com/) project

### 1. Clone the repository

```bash
git clone https://github.com/Khushmansingh/FEE-II_Project_-GID-13.git
cd FEE-II_Project_-GID-13
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

Run the SQL in [`supabase_schema.sql`](supabase_schema.sql) in your Supabase SQL Editor to create the required tables, storage bucket, and RLS policies.

### 5. Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## 🎨 Theming

Campus Vault supports **dark** and **light** themes. The toggle is in the top-right corner of the navigation bar. Theme preference is persisted in `localStorage` so it survives page refreshes.

The theming system uses CSS custom properties defined in `index.css`, with overrides applied via the `[data-theme="light"]` selector on the root `<html>` element.

---

## 👥 Team — GID-13

| Name | Role |
|---|---|
| Khushman Singh | Developer |
| Gitansh | Developer |

---

## 📄 License

This project is part of an academic course (FEE-II) and is intended for educational purposes.
