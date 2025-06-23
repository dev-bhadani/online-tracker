# StudIP Online Tracker

Track who is online in [Stud.IP](https://studip.hs-schmalkalden.de), log their activity, and gain insights into user sessions all backed by **Supabase**, **Playwright**, and **PostgreSQL**.

---

### Features

- Scrape "Who is online?" from Stud.IP
- Track `last_login`, `last_seen`, `login_at`, `logout_at`, and session durations
- Scheduled GitHub Actions job every 10 minutes
- Supabase as cloud-hosted PostgreSQL backend

---

### Getting Started

#### 1. Clone and Install

```bash
git clone https://github.com/dev-bhadani/online-tracker.git
cd studip-online-tracker
npm install
```

#### 2. Environment Variables

Create a `.env` file:

```env
SUPABASE_DB_URL=postgresql://postgres:<password>@db.<hash>.supabase.co:5432/postgres
STUDIP_URL=https://studip.hs-schmalkalden.de
STUDIP_USER=your_username
STUDIP_PASS=your_password
```

#### 3. Initialize DB Schema (only once)

```bash
npm run setup-db
```

---

### Run Locally

#### Run scraper directly

```bash
npm run start
```

#### Run Playwright tests

```bash
npm run test
```
---

### GitHub Actions

- CI is triggered on `main`/`master` push and every 10 minutes via scheduled workflow
- Data is scraped, saved to Supabase, and logs are auto-cleaned using GitHub API
