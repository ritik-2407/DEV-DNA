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
      limit: 5,       // 5 requests …
      windowSec: 60,  // … per 60 seconds
    });

    if (!limit.allowed) {
      return Response.json(
        {
          success: false,
          error: `Rate limit exceeded. Try again in ${limit.resetIn}s.`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(limit.resetIn),
            "Retry-After": String(limit.resetIn),
          },
        }
      );
    }
    // ──────────────────────────────────────────────────────────────────────────

    // Read username + action from body
    const { action, username } = await req.json();
    const githubUsername = username;

    if (!githubUsername) {
      return Response.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      );
    }

    if (!action) {
      return Response.json(
        { success: false, error: "Action required" },
        { status: 400 }
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
      `/users/${githubUsername}/repos?per_page=100`
    );
    const events = await githubFetch(
      `/users/${githubUsername}/events`
    );

    const recentRepos = repos
      .filter((r: any) => r.size > 0 && r.default_branch)
      .sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, 3);

    const recentCommits: any[] = [];

    for (const repo of recentRepos) {
      try {
        const commits = await githubFetch(
          `/repos/${repo.full_name}/commits?per_page=5`
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
      recentCommits
    );

    //  Prompt
    const prompt = buildPrompt(action, profile);

    //  Groq call
    let raw: string | null;
    try {
      raw = await runLLM(prompt);
    } catch (err) {
      console.error("LLM failed:", err);
      return Response.json(
        { success: false, error: "LLM API failed" },
        { status: 500 }
      );
    }

    if (!raw) {
      throw new Error("Empty LLM response");
    }

    //  Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(raw);
      await setCachedLLM(cacheKey, parsed);
    } catch {
      return Response.json(
        {
          success: false,
          error: "Invalid JSON returned by LLM",
          raw,
        },
        { status: 500 }
      );
    }

    //  Success
    return Response.json({
      success: true,
      action,
      data: parsed,
    });
  } catch (err: any) {
    console.error("AI ACTION CRASHED:", err);
    return Response.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
