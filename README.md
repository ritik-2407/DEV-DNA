
# DEV DNA

Analyzes your GitHub profile the way a senior engineer would — not stars and streaks, but patterns, depth, and signals.

Sign in with GitHub → get structured, LLM-powered evaluations grounded in your actual repos, commits, and activity.

---

## Actions

| Action | What it does |
|--------|-------------|
| **Analyze** | Evaluates your profile — skill level, strengths, blind spots, developer type |
| **Suggest** | High-leverage suggestions tied to what's visible (or missing) on your GitHub |
| **Improve** | Calls out missing engineering practices and structural weaknesses |
| **Judge** | Judges your recent commit history — discipline, intent, and quality |
| **Roast** | Brutally honest reality check with analogies. Stings because it's accurate |

Every action returns strict JSON — no markdown, no fluff, directly parseable.

---

## How It Works

```
GitHub OAuth → Fetch live data (repos, commits, events)
            → Normalize into compact profile
            → Build action-specific prompt
            → LLM generates structured JSON
            → Cache response in Redis (1hr TTL)
```

No stored profiles. Every request fetches live GitHub data, so insights stay fresh.

---

## Stack

- **Next.js** (App Router)
- **NextAuth** — GitHub OAuth
- **GitHub REST API** — repos, commits, events
- **Groq** — LLM inference
- **Redis (Upstash)** — response caching
- **Framer Motion** — animations
- **Recharts** — data visualization
- **TypeScript**

---

## Setup

```bash
git clone https://github.com/ritik-2407/dev-dna.git
cd dev-dna
npm install
```

Create a `.env` file:

```env
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret
NEXTAUTH_SECRET=any_random_string
NEXTAUTH_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
REDIS_URL=rediss://default:your_password@your_endpoint.upstash.io:6379
```

```bash
npm run dev
```

---

## Project Structure

```
app/
├── api/
│   ├── ai/action/    # Core analysis endpoint
│   ├── auth/          # NextAuth GitHub OAuth
│   ├── github/        # GitHub data proxy
│   └── logout/
├── dashboard/         # Analysis UI + result sections
├── lib/
│   ├── githubFetch.ts       # Authenticated GitHub API calls
│   ├── normalizeGitHubData.ts  # Raw API → clean profile
│   ├── promptGenerator.ts   # Action-specific prompt builder
│   ├── llm.ts               # Groq API wrapper
│   ├── llmCache.ts          # Redis caching layer
│   └── redis.ts             # Redis client (singleton)
├── components/        # Shared UI components
└── LandingPage.tsx    # Landing page
```

---

## License

MIT
