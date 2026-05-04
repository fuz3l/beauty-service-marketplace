# Beauty Marketplace - Team Setup Guide

Welcome to the project! This document outlines what has been built so far and provides a step-by-step guide on how to get the local development environment (specifically the database) up and running.

---

## 🚀 What We've Built So Far

We have transformed this into a fully functional, full-stack React + Express + Prisma application. 

### 1. Core Platform Features
* **Authentication & Authorization:** JWT-based login/signup system with distinct roles (`client` vs `artist`).
* **Dynamic Routing:** Switched all static anchor tags to React Router `Link` components for a seamless Single Page Application (SPA) experience.
* **Prisma ORM Database:** Fully structured PostgreSQL relational database bridging Users, Artists, Services, Bookings, and Portfolios.

### 2. Client Experience
* **Landing Page:** Beautiful hero section with a quick search bar to find artists immediately.
* **Browse Artists Page:** Real-time search and filtering system.
* **"Near Me" Geolocation:** Users can click the compass icon in the search bar. The app uses HTML5 GPS to get their coordinates, reverse-geocodes it via OpenStreetMap, and instantly filters artists in their city!

### 3. Artist Dashboard
* **Profile Management:** Artists can edit their Location and Speciality in real-time.
* **Services Menu:** Artists can add services with prices (e.g., "Bridal Makeup", "Party Look").
* **Portfolio:** Grid view to upload mock portfolio pictures.
* **Live Bookings:** The dashboard checks for new booking requests.

---

## 🛠️ Local Setup Guide

If you are cloning this repo for the first time, follow these exact steps to get the database and servers running on your machine.

### Step 1: Install Dependencies
You need to install dependencies for both the frontend (React) and the backend (Express).
```bash
# In the root folder (Frontend)
npm install

# In the server folder (Backend)
cd server
npm install
```

### Step 2: Database Configuration
We use **PostgreSQL** via Prisma. You can use a local Postgres database (like Postgres.app or pgAdmin) or a free cloud database like Neon.tech or Supabase.

1. Inside the `server` folder, create a `.env` file.
2. Add your database connection string and a secret key:
```env
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_PASSWORD@localhost:5432/beauty_marketplace?schema=public"
JWT_SECRET="super-secret-jwt-key"
PORT=5001
```

### Step 3: Run Database Migrations
Prisma needs to build the tables in your empty PostgreSQL database. Run this from inside the `server` folder:
```bash
npx prisma migrate dev --name init
```
This command reads `schema.prisma` and creates all the tables (User, Artist, Booking, Service, etc.).

### Step 4: Seed Demo Data
We built an interactive CLI tool to easily insert realistic artists into the database for testing. From the `server` folder, run:
```bash
node createArtist.js
```
*It will prompt you for a name, email, password, and location. It automatically creates the Artist, attaches a portfolio, and adds services!*

### Step 5: Start the Servers
You need to run both the frontend and backend servers simultaneously in separate terminal windows.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
# From the root folder
npm run dev
```

### Step 6: View the Database
Whenever you want to visualize the raw database, open a new terminal in the `server` folder and run:
```bash
npx prisma studio
```
This opens a beautiful web UI (`http://localhost:5555`) to view, edit, and delete rows directly!
