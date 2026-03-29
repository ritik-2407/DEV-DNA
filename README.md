
# DEV DNA

Analyzes any GitHub profile the way a senior engineer would — not stars and streaks, but patterns, depth, and signals.

Enter a GitHub username → get structured, LLM-powered evaluations grounded in their actual repos, commits, and activity.

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
Enter Username → Fetch live PUBLIC data via server PAT (repos, commits, events)
               → Normalize into compact profile
               → Build action-specific prompt
               → LLM generates structured JSON (Groq with auto-fallback to OpenRouter)
               → Cache response in Redis (1hr TTL)
```

**Resilient AI architecture:** DevDNA uses **Groq** for lightning-fast inference. If global API rate limits are temporarily hit, the system automatically initiates an exponential backoff cooldown state in Redis and seamlessly routes traffic through **OpenRouter** (Llama 3.3 70B) — ensuring analyzing never stops for the end user.

No sign-in required. Every request fetches live GitHub data, so insights stay fresh.

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
- **Redis (Upstash)** — response caching and fallback state tracking
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
│   ├── ai/action/     # Core analysis endpoint
│   └── github/profile/ # GitHub data endpoint
├── dashboard/         # Analysis UI + result sections
├── lib/
│   ├── githubFetch.ts       # Authenticated GitHub API calls
│   ├── normalizeGitHubData.ts  # Raw API → clean profile
│   ├── promptGenerator.ts   # Action-specific prompt builder
│   ├── llm.ts               # Core LLM interface
│   ├── llmRouter.ts         # High-availability Groq/OpenRouter fallback logic
│   ├── llmProviders.ts      # LLM Provider client configs
│   ├── llmCache.ts          # Redis caching layer
│   └── redis.ts             # Redis client (singleton)
├── components/        # Shared UI components
└── LandingPage.tsx    # Landing page
```

---

## Future Updates


- Profile Comparison of two users
- Repository Analysis
- Multiple platforms Analysis (LeetCode, HackerRank, etc.)

