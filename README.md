# DEV DNA

Analyzes any GitHub profile the way a senior engineer would — not stars and streaks, but patterns, depth, and signals.

Enter a GitHub username → get structured, LLM-powered evaluations grounded in their actual repos, commits, and activity.

---

## Actions

| Action | What it does |
|--------|-------------|
| **Analyze** | Evaluates your profile — skill level, strengths, blind spots, developer type |
| **Improve** | Calls out missing engineering practices and structural weaknesses |
| **Judge** | Judges your recent commit history — discipline, intent, and quality |
| **Roast** | Brutally honest reality check with analogies. Stings because it's accurate |

Every action returns strict JSON — no markdown, no fluff, directly parseable.

---

## PvP Arena

Go head-to-head with another developer in a high-energy, esports-style GitHub showdown. The system pulls and directly compares enriched metrics to determine a winner across key engineering pillars.

- **5-Point Grading System:** Consistency, Output, Influence, Breadth, and Experience.
- **Head-to-head Scoreboard:** Dynamic, emerald-themed progress bars that visually crown the winner (scored 0-10).
- **AI Verdict:** A punchy, ruthless AI-generated summary highlighting exactly why one profile dominated the other.

---

## How It Works

```
Enter Username → Fetch live PUBLIC data via server PAT (repos, commits, events)
               → Normalize into compact profile
               → Build action-specific prompt
               → LLM generates structured JSON (Groq with auto-fallback to OpenRouter)
               → Cache response in Redis (1hr TTL)
```

**Resilient AI architecture:** DevDNA uses **Groq** for lightning-fast inference. If global API rate limits are temporarily hit, the system automatically initiates an exponential backoff cooldown state in Redis and seamlessly routes traffic through **OpenRouter** (Llama 3.3 70B) — ensuring analyzing never stops for the end user.

No sign-in required. Every request fetches live GitHub data, so insights stay fresh.

---

## Rate Limits

Rate limits are enforced per IP using a fixed-window counter in Redis. The counter is only incremented when a **real LLM or GitHub API response** is returned — cached responses never burn quota.

| Endpoint | Limit |
|----------|-------|
| Stats (GitHub profile lookup) | 5 requests / hour |
| AI Actions (Analyze, Judge, Improve, Roast) | 4 requests / day |
| PvP Arena | 2 battles / day |

Remaining quota is displayed live in the UI on each section. Once the limit is hit, the backend returns a `429` with a reset time.

---

## Constraints

> **Public repositories only.**
> DEV DNA uses a server-side GitHub Personal Access Token (PAT) to call the GitHub REST API on your behalf. This token only grants access to **publicly visible** data.
>
> - ✅ Public repos, commits, events, languages, stars
> - ❌ Private repositories — not visible, not included in the analysis
> - ❌ Organisation secrets or private gists

This is by design: no authentication is required from the user, so the tool can only see what anyone on the internet can see on your GitHub profile. If your work lives primarily in private repos, the analysis will reflect only your public contributions.

---

## Stack

- **Next.js** (App Router)
- **Server-side PAT** — secure API access without rate limits
- **GitHub REST API** — repos, commits, events
- **Groq** — Primary LLM inference
- **OpenRouter** — Fallback LLM inference
- **Redis (Upstash)** — response caching, rate limiting, and fallback state tracking
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
GITHUB_TOKEN=your_github_personal_access_token
GROK_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
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
│   ├── ai/action/          # Core analysis endpoint
│   ├── ai/pvp/             # PvP Arena AI verdict endpoint
│   ├── ai/rate-status/     # Read-only quota status endpoint (UI polling)
│   ├── github/profile/     # GitHub stats data endpoint
│   └── github/pvp-profile/ # PvP-specific GitHub data endpoint
├── dashboard/              # Analysis UI + result sections
├── lib/
│   ├── githubFetch.ts          # Authenticated GitHub API calls
│   ├── normalizeGitHubData.ts  # Raw API → clean profile
│   ├── promptGenerator.ts      # Action-specific prompt builder
│   ├── llm.ts                  # Core LLM interface
│   ├── llmRouter.ts            # High-availability Groq/OpenRouter fallback logic
│   ├── llmProviders.ts         # LLM Provider client configs
│   ├── llmCache.ts             # Redis caching layer
│   ├── rateLimit.ts            # IP-based fixed-window rate limiter
│   └── redis.ts                # Redis client (singleton)
├── components/             # Shared UI components
└── LandingPage.tsx         # Landing page
```

---

## Potential Updates

- Repository Analysis
- Multiple platforms Analysis (LeetCode, HackerRank, etc.)
