# Journal App

A personal journal application built with Next.js and Supabase.

## Tech Stack

- **Frontend & API** — Next.js (App Router)
- **Database & Auth** — Supabase (PostgreSQL)
- **Styling** — Tailwind CSS
- **Hosting** — Vercel (frontend) + Supabase (database, free tier)

---

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd journal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. In the Supabase dashboard, open the **SQL Editor**
4. Paste and run the contents of `supabase/schema.sql` — this creates the `entries` table and security policies

### 4. Configure environment variables

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials from **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features

- **Auth** — register and sign in with email and password
- **Today's prompt** — shown on the dashboard if no entry exists for today
- **Calendar** — browse entries by month; days with entries are marked with a dot
- **Write / Edit** — click any day to write a new entry or edit an existing one
- **View** — read past entries by clicking a marked day

---

## Deploying to Vercel (free)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings
4. Deploy — Vercel auto-deploys on every push to main

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Redirects to /login or /dashboard
│   ├── login/page.tsx      # Sign in page
│   ├── register/page.tsx   # Register page
│   └── dashboard/page.tsx  # Main app (calendar + editor)
├── components/
│   ├── Calendar.tsx        # Monthly calendar with entry indicators
│   ├── TodayPrompt.tsx     # Banner shown when no entry exists today
│   ├── EntryEditor.tsx     # Write / edit an entry
│   └── EntryViewer.tsx     # Read a past entry
└── lib/
    └── supabase.ts         # Supabase client + types

supabase/
└── schema.sql              # Database schema — run once in Supabase SQL editor
```
