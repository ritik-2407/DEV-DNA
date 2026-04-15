import { githubFetch } from "@/app/lib/githubFetch";
import { normaliseGitHubData } from "@/app/lib/normalizeGitHubData";
import { buildPrompt } from "@/app/lib/promptGenerator";
import { runLLM } from "@/app/lib/llm";
import { getCachedLLM, setCachedLLM } from "@/app/lib/llmCache";
import { rateLimit } from "@/app/lib/rateLimit";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // ── Rate limiting ──────────────────────────────────────────────────────────
    // We identify the caller by their IP address (Next.js forwards it via
    // the `x-forwarded-for` header when behind a proxy/CDN like Vercel).
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
      headersList.get("x-real-ip") ??
      "unknown";

    const limit = await rateLimit(ip, "ai-action", {
      limit: 4,
      windowSec: 86400, // 24 hours
    });

    if (!limit.allowed) {
      return Response.json(
        {
          success: false,
          error: `Daily limit reached. You have used all 4 actions for today. Resets in ${Math.ceil(limit.resetIn / 3600)}h.`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "4",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(limit.resetIn),
            "Retry-After": String(limit.resetIn),
          },
        },
      );
    }
    // ──────────────────────────────────────────────────────────────────────────

    // Read username + action from body
    const { action, username } = await req.json();
    const githubUsername = username;

    if (!githubUsername) {
      return Response.json(
        { success: false, error: "Username is required" },
        { status: 400 },
      );
    }

    if (!action) {
      return Response.json(
        { success: false, error: "Action required" },
        { status: 400 },
      );
    }

    const cacheKey = `${githubUsername}::${action}`;

    const cached = await getCachedLLM(cacheKey);

    if (cached) {
      return Response.json({
        success: true,
        action,
        data: cached,
        cached: true,
      });
    }
    console.log("further llm API hit");
    //  Fetch GitHub data (public endpoints)
    const user = await githubFetch(`/users/${githubUsername}`);
    const repos = await githubFetch(
      `/users/${githubUsername}/repos?per_page=100`,
    );
    const events = await githubFetch(`/users/${githubUsername}/events`);

    const recentRepos = repos
      .filter((r: any) => r.size > 0 && r.default_branch)
      .sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      .slice(0, 3);

    const recentCommits: any[] = [];

    for (const repo of recentRepos) {
      try {
        const commits = await githubFetch(
          `/repos/${repo.full_name}/commits?per_page=5`,
        );

        commits.forEach((c: any) => {
          recentCommits.push({
            repo: repo.full_name,
            message: c.commit.message,
            date: c.commit.author.date,
          });
        });
      } catch (err: any) {
        // 404, 409, restricted org repo, archived repo → skip
        continue;
      }
    }

    const profile = await normaliseGitHubData(
      user,
      repos,
      events,
      recentCommits,
    );

    //  Prompt
    const prompt = buildPrompt(action, profile);

    //  Groq call
    let raw: string | null;
    try {
      raw = await runLLM(prompt);
    } catch (err: any) {
      console.error("LLM failed:", err);
      
      // Check if it's a rate limit error from Groq (status 429 or message includes rate limit)
      if (err?.status === 429 || err?.message?.toLowerCase().includes("rate limit") || err?.message?.toLowerCase().includes("too many requests")) {
        return Response.json(
          { success: false, error: "The free tier LLM rate limit has been reached. Please try again in a few minutes." },
          { status: 429 },
        );
      }

      return Response.json(
        { success: false, error: "LLM API failed. Please try again." },
        { status: 500 },
      );
    }

    if (!raw) {
      throw new Error("Empty LLM response");
    }

    //  Parse JSON
    let parsed;
    try {
      // Strip markdown code block if present
      const cleanRaw = raw
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
        
      parsed = JSON.parse(cleanRaw);
      await setCachedLLM(cacheKey, parsed);
    } catch {
      return Response.json(
        {
          success: false,
          error: "Invalid JSON returned by LLM (Rate limit or unexpected output)",
          raw,
        },
        { status: 500 },
      );
    }

    //  Success
    return Response.json(
      {
        success: true,
        action,
        data: parsed,
      },
      {
        headers: {
          "X-RateLimit-Limit": "4",
          "X-RateLimit-Remaining": String(limit.remaining),
          "X-RateLimit-Reset": String(limit.resetIn),
        },
      },
    );
  } catch (err: any) {
    console.error("AI ACTION CRASHED:", err);
    return Response.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
