# EduAI Frontend

Next.js 15 + TypeScript frontend for EduAI E-learning Platform.

## Tech Stack
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + ShadCN UI
- **State:** Zustand (auth store)
- **Data Fetching:** TanStack Query v5
- **Forms:** React Hook Form + Zod
- **Auth Client:** Better Auth v1
- **Animations:** Framer Motion
- **Charts:** Recharts
- **AI:** Google Gemini (via backend)

## Features
- 🏠 Full landing page (8+ sections)
- 🔐 Auth (login, register, Google OAuth)
- 📚 Course listing with search, filter, sort, pagination
- 📖 Course detail page with enrollment
- 🤖 AI Study Assistant (Gemini chat)
- 🎯 AI Smart Recommendations
- 📊 User dashboard with progress tracking
- 🛡️ Admin dashboard with charts & user management
- 🌙 Dark/Light mode
- 📱 Fully responsive

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy env file:
```bash
cp .env.example .env.local
```

3. Fill in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000  # your backend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── courses/              # Course listing + detail
│   ├── auth/                 # Login + Register
│   ├── dashboard/
│   │   ├── user/             # Student dashboard (6 pages)
│   │   └── admin/            # Admin dashboard (6 pages)
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── help/
│   └── privacy/
├── components/
│   ├── ui/                   # ShadCN UI components
│   ├── shared/               # Navbar, Footer, CourseCard
│   └── landing/              # Landing page sections
├── lib/
│   ├── api.ts                # Axios API client
│   ├── auth-client.ts        # Better Auth client
│   └── utils.ts              # Utility functions
├── store/
│   └── auth.store.ts         # Zustand auth store
└── types/
    └── index.ts              # TypeScript types
```

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` → your Render backend URL
   - `NEXT_PUBLIC_APP_URL` → your Vercel URL
4. Deploy!

## Demo Credentials
- **Student:** student@eduai.dev / student123
- **Admin:** admin@eduai.dev / admin123
