# 🚀 Digital Portfolio Builder

> A modern, responsive, full-stack web application designed for students and graduates to build, customize, preview, and publish high-converting personal portfolios for professional branding, internship applications, and showcasing technical skills.

---

## 📋 Table of Contents

- [Overview & Objectives](#overview--objectives)
- [Technology Stack](#technology-stack)
- [Key Features](#key-features)
- [Directory Structure](#directory-structure)
- [Prerequisites](#prerequisites)
- [Installation & Running Locally](#installation--running-locally)
- [User Guide & Workflows](#user-guide--workflows)
- [API Documentation](#api-documentation)
- [Deployment Guide](#deployment-guide)
- [Testing & Quality Assurance](#testing--quality-assurance)

---

## 🎯 Overview & Objectives

Students often struggle to quickly create polished, recruiter-ready portfolios that effectively showcase their hackathon apps, coursework deliverables, and technical skills. 

**Digital Portfolio Builder** solves this by providing:
- An intuitive SaaS-style studio editor.
- Side-by-side **live preview** supporting Desktop, Tablet, and Mobile viewports.
- **5 curated themes** (Modern Tech, Cyber Dark, Swiss Minimalist, Creative Gradient, Academic Scholar).
- Built-in **contact form with backend validation** and an integrated **Messages Inbox**.
- Instant **1-click publishing**, unique public slugs (`/p/:slug`), **QR code generator** for resume printing, and direct social share buttons.
- Fully persistent, zero-configuration JSON file storage.

---

## 🛠 Technology Stack (Mandatory)

| Layer | Technology | Purpose |
|---|---|---|
| **Structure** | HTML5 | Semantic page layout, accessibility tags, and modals |
| **Styling** | CSS3 & Custom Variables | Responsive layout, modern themes, card shadows, animations |
| **Frontend Framework** | Bootstrap 5.3.3 + Icons | Responsive grid system, navbar, tabs, offcanvas, and UI components |
| **Client Scripting** | JavaScript (ES6+) | Dynamic DOM manipulation, AJAX fetch API, state management, validation |
| **Backend** | Node.js & Express.js 5.x | RESTful API routes, validation, static file serving, error handling |
| **File Uploads** | Multer | Secure multipart form data processing for profile photos & project screenshots |
| **QR Code Engine** | qrcode | Generates instant mobile QR codes as Base64 data URLs |
| **Persistence** | File-backed JSON DB (`/data`) | Reliable zero-native-compilation storage across all environments |

---

## ✨ Key Features

### 1. Profile Editor
- **Full Identity Customization**: Name, professional headline, bio, location, email, phone, personal website, and resume PDF links.
- **Profile Photo Support**: Upload local image files (JPG, PNG, WEBP, SVG) via Multer or link to external image URLs.
- **"Open to Work / Internships" Badge**: Pulsing green availability indicator to catch recruiter attention.

### 2. Project Gallery (Complete CRUD)
- **Add / Edit / Delete**: Easily manage personal and academic projects.
- **Screenshots & Media**: File upload or direct image URL.
- **Categorization & Filter**: Filter projects by categories (Web App, Full Stack, Mobile First, Developer Tool, etc.).
- **Tech Stack Badges**: Interactive pill tags for technologies used (Node.js, Express, React, etc.).
- **Live Demo & GitHub Repos**: Direct external action buttons on each project card.
- **Featured Tag**: Highlight award-winning hackathon or capstone projects.

### 3. Contact Form & Recruiter Inbox
- **Public Contact Form**: Name, email, subject, and message fields on the public portfolio.
- **Server-Side Validation**: Robust Express validation regex ensuring legitimate emails and minimum character lengths.
- **Dashboard Recruiter Inbox**: View all received inquiries in the studio, filter by all/unread, mark as read, delete, or reply directly via email (`mailto:`).

### 4. Real-time Live Portfolio Preview
- **Split Screen Mode**: Edit on the left, watch your portfolio update on the right.
- **Device Viewport Switcher**: Toggle preview between Desktop (100%), Tablet (768px), and Mobile (375px) frames.
- **Instant Synchronization**: Automatic refresh when changes are saved or themes are changed.

### 5. Multi-Theme Engine (5 Tailored Styles)
1. **Modern Tech**: Crisp indigo & slate with glassmorphism cards. Ideal for software engineers.
2. **Cyber Dark**: High-contrast midnight dark mode with glowing neon cyan accents. Great for cybersecurity and backend developers.
3. **Swiss Minimalist**: Clean black & white architectural grid design. Loved by UI/UX designers and minimalists.
4. **Creative Gradient**: Vibrant purple-to-pink gradients and soft pill borders.
5. **Academic & Scholar**: Collegiate navy and warm gold with classic serif headings. Tailored for researchers and graduate students.

### 6. Publish, Share & Export
- **Public URL**: Shareable link at `/p/:slug` (e.g., `http://localhost:3000/p/alex-morgan`).
- **QR Code Generator**: Instant high-resolution QR code to scan on smartphones or download as a PNG for printed resumes.
- **Social Sharing**: Direct share buttons for LinkedIn, Twitter/X, WhatsApp, and Email.
- **Draft Mode Toggle**: Set portfolio to private draft mode anytime with a single click.
- **JSON Backup & Restore**: 1-click export of your complete portfolio as a `.json` backup file, with a full import modal.
- **Pre-Loaded Demo Data**: 1-click "Load Demo Data" button that populates a comprehensive UC Berkeley CS student portfolio (Alex Morgan).

---

## 📁 Directory Structure

```
digital-portfolio-builder/
├── package.json               # Dependencies and npm scripts
├── server.js                  # Express application, routes, Multer upload & static serving
├── .env.example               # Environment variable template
├── .env                       # Local environment configuration
├── README.md                  # Complete documentation and deployment guide
├── data/
│   ├── db.js                  # Persistent storage engine & data helpers
│   ├── portfolios.json        # Persistent store for student portfolios
│   └── messages.json          # Persistent store for contact form submissions
├── uploads/                   # Uploaded profile photos and project screenshots
│   └── .gitkeep
└── public/
    ├── index.html             # High-converting SaaS landing page
    ├── dashboard.html         # Studio dashboard with sidebar, editor & live preview
    ├── portfolio.html         # Dynamic multi-theme public portfolio viewer
    ├── css/
    │   ├── main.css           # Global tokens, typography, toasts, animations
    │   ├── dashboard.css      # SaaS layout, split preview frame, admin cards
    │   ├── landing.css        # Hero banner, feature cards, mockups
    │   └── templates.css      # 5 complete theme definitions (Modern, Cyber, Minimal, Creative, Academic)
    └── js/
        ├── api.js             # Centralized fetch API client with toast alerts
        ├── dashboard.js       # Studio state management, forms, CRUD modals, QR generation
        └── portfolio.js       # Public portfolio renderer, project filters, AJAX contact form
```

---

## 💻 Prerequisites

- **Node.js**: v18.0.0 or higher (Tested on Node.js v24)
- **npm**: v8.0.0 or higher
- Modern web browser (Chrome, Edge, Firefox, Safari)

---

## 🚀 Installation & Running Locally

### 1. Clone or Navigate to the Workspace
```bash
cd "C:\Users\hp 840 g8\OneDrive\Desktop\web"
```

### 2. Install Dependencies
Dependencies are already configured in `package.json`. If installing fresh:
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```
*Or for live reloading during development:*
```bash
npm run dev
```

### 4. Open in Your Browser
Once started, open:
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Studio Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Pre-Built Demo Portfolio**: [http://localhost:3000/p/alex-morgan](http://localhost:3000/p/alex-morgan)

---

## 📖 User Guide & Workflows

### How to Build a Student Portfolio:
1. Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).
2. Click **Load Demo Data** to explore a pre-populated profile, or click **New** in the sidebar to create a clean portfolio from scratch.
3. In **Profile Editor**: Fill in your full name, desired URL slug, university headline, bio, and upload a profile picture.
4. In **Project Gallery**: Click **Add New Project**. Upload a screenshot, write a brief overview, select technologies, and attach your GitHub / Live demo links.
5. In **Skills & Tools**: Add your programming languages with proficiency ratings (30% to 100%).
6. In **Education & Exp**: Add your degree, expected graduation date, GPA, and internships.
7. In **Theme & Styles**: Choose between **Modern Tech**, **Cyber Dark**, **Swiss Minimal**, **Creative**, or **Academic**.
8. In **Publish & Share**: Toggle **Published** ON, copy your public URL, or download your mobile QR code.

---

## 🔌 API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/portfolios` | List all available portfolios summary |
| `GET` | `/api/portfolios/:slug` | Retrieve full portfolio object by slug |
| `POST` | `/api/portfolios` | Create a new student portfolio |
| `PUT` | `/api/portfolios/:slug` | Update an existing portfolio |
| `DELETE` | `/api/portfolios/:slug` | Delete portfolio and associated messages |
| `POST` | `/api/portfolios/:slug/publish` | Toggle public/draft visibility |
| `POST` | `/api/portfolios/:slug/reset-demo`| Reset/seed portfolio with rich sample demo data |
| `POST` | `/api/portfolios/:slug/contact` | Submit contact inquiry (Validated: name, email, message) |
| `GET` | `/api/portfolios/:slug/messages` | Fetch received contact messages for inbox |
| `PATCH` | `/api/messages/:id/read` | Mark message as read/unread |
| `DELETE` | `/api/messages/:id` | Delete contact message |
| `POST` | `/api/upload` | Multipart file upload for images (`image` field) |
| `GET` | `/api/qrcode?url=...` | Generate high-res QR code PNG data URL |
| `GET` | `/api/portfolios/:slug/export` | Download portfolio JSON backup |
| `POST` | `/api/import` | Import and save portfolio JSON |

---

## 🌐 Deployment Guide

### Option 1: Deploy to Render (Recommended for Students - Free Tier)
1. Push your repository to GitHub.
2. Log in to [Render](https://render.com) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Deploy Web Service**. Your app is live at `https://your-app-name.onrender.com`.

### Option 2: Deploy to Railway
1. Install Railway CLI or connect via GitHub on [railway.app](https://railway.app).
2. Click **New Project > Deploy from GitHub repo**.
3. Railway automatically detects `server.js` and `package.json` and provisions the container.

### Option 3: Deploy to Ubuntu Linux VPS (Nginx + PM2)
1. SSH into your VPS:
   ```bash
   ssh user@your-server-ip
   ```
2. Install Node.js 20+ and PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
3. Clone and install:
   ```bash
   git clone <your-repo-url> /var/www/portfolio-builder
   cd /var/www/portfolio-builder
   npm install --production
   ```
4. Start with PM2 process manager:
   ```bash
   pm2 start server.js --name "portfolio-builder"
   pm2 save
   pm2 startup
   ```
5. Configure Nginx reverse proxy to forward port 80/443 to `localhost:3000`.

---

## 🧪 Testing & Verification Checklist

- [x] **Backend Server**: Starts cleanly with `node server.js` or `npm start`.
- [x] **Landing Page (`/`)**: Displays hero, feature cards, template previews, and live demo buttons.
- [x] **Studio Dashboard (`/dashboard`)**: Full sidebar navigation, responsive layout, and metrics.
- [x] **Live Preview Pane**: Split-view updates in real time with Desktop, Tablet, and Mobile switches.
- [x] **Profile Editor**: Updates full name, avatar, bio, location, and social links with auto-save.
- [x] **Project Gallery**: Add, edit, and delete projects with image uploads, tags, and links.
- [x] **Skills & Timeline**: Add skills with category progress bars, and manage education/experience cards.
- [x] **Contact Form**: Client and server-side validation; sends message and logs into studio inbox.
- [x] **Recruiter Inbox**: Displays submissions, marks as read, supports mailto reply, and deletion.
- [x] **1-Click Publishing**: Generates public link `/p/:slug` with QR code download.
- [x] **Export & Import**: Downloads `.json` backup and restores correctly.
- [x] **Sample Demo Content**: 1-click reset to Alex Morgan's UC Berkeley Computer Science portfolio.

---

## 📄 License
Open source and available under the [ISC License](LICENSE). Built for students, educational institutions, and software engineers worldwide.
