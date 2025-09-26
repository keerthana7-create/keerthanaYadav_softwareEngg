Blog-Daily Drive

A modern, responsive blog platform built with React (TypeScript), Vite, and TailwindCSS. It features authentication, a backend API, and a fully responsive blog system.

🚀 Features

Home Page – Browse latest blog posts

Categories – Filter posts by categories

Post CRUD – Create, read, update, and delete blog posts

Authentication – Secure login, registration, and session handling

Profile Page – Manage personal posts and settings

Subscribe & Contact Us – Stay connected with updates

Responsive Design – Works seamlessly on desktop, tablet, and mobile

Theme Toggle – Light and dark mode support

Reusable Components – Built with modular React components
Tech Stack

Frontend: React + TypeScript + Vite + TailwindCSS

State Management: Redux Toolkit / Custom Store

Backend: Node.js + Express

Authentication: JWT-based auth (via /server/routes/auth.js)

Deployment: Netlify (Frontend), Optional (Backend: Vercel / Heroku / Render)
Prerequisites

Node.js
 (>= 18)

pnpm
 or npm/yarn

A running MongoDB or PostgreSQL database (depending on your setup in auth.js)
Frontend Setup

Install dependencies:

pnpm install
# or
npm install


Start the frontend development server:

pnpm dev
# or
npm run dev


Open in browser:

http://localhost:5173
Backend Setup (Authentication & APIs)

Navigate to the backend folder:

cd server


Install backend dependencies:

pnpm install
# or
npm install


Create a .env file inside the root with the following (adjust as needed):

PORT=5000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=mongodb://localhost:27017/blogdb


Start the backend server:

node server.js
# or if using TypeScript
ts-node server.ts


The backend will run at:

http://localhost:5000

🔑 API Endpoints
Auth Routes (/api/auth)

POST /api/auth/register → Register a new user

POST /api/auth/login → Login user and return JWT

GET /api/auth/me → Get current user profile (requires token)
