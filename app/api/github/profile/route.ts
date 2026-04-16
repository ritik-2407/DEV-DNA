import { NextResponse } from "next/server";
import { checkRateLimit, consumeRateLimit } from "@/app/lib/rateLimit";
import { headers } from "next/headers";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const GITHUB_PROFILE_QUERY = `
query ($login: String!) {
  user(login: $login) {
    login
    name
    avatarUrl
    followers {
      totalCount
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
    repositories(ownerAffiliations: OWNER, first: 100) {
      nodes {
        stargazerCount
        forkCount
        languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
            }
          }
        }
      }
    }
  }
}
`;

export async function GET(req: Request) {
  try {
    // ── Rate limiting ──────────────────────────────────────────────────────────
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
      headersList.get("x-real-ip") ??
      "unknown";

    const limit = await checkRateLimit(ip, "github-profile", {
      limit: 5,      // 5 requests …
      windowSec: 3600,  // … per hour
    });

    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${Math.round(limit.resetIn/60)} minutes.` },
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

    const { searchParams } = new URL(req.url);
    const githubUsername = searchParams.get("username");

    if (!githubUsername) {
      return NextResponse.json(
        { error: "Username query parameter is required" },
        { status: 400 }
      );
    }

    const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_PAT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GITHUB_PROFILE_QUERY,
        variables: { login: githubUsername },
      }),
      next: { revalidate: 60 * 60 * 6 }, // 6 hours
    });

    if (!res.ok) {
      throw new Error("GitHub GraphQL request failed");
    }

    const json = await res.json();
    const user = json?.data?.user;

    if (!user) {
      throw new Error("GitHub user not found");
    }

    // Aggregate stars
    const totalStars = user.repositories.nodes.reduce(
      (sum: number, repo: any) => sum + repo.stargazerCount,
      0
    );

    // Aggregate forks
    const totalForks = user.repositories.nodes.reduce(
      (sum: number, repo: any) => sum + repo.forkCount,
      0
    );

    // Aggregate language bytes across all repos
    const languageMap: Record<string, number> = {};
    for (const repo of user.repositories.nodes) {
      for (const edge of repo.languages?.edges ?? []) {
        const name = edge.node.name;
        languageMap[name] = (languageMap[name] ?? 0) + edge.size;
      }
    }

    const response = {
      username: user.login,
      name: user.name,
      avatar: user.avatarUrl,
      followers: user.followers.totalCount,
      stars: totalStars,
      forks: totalForks,
      repoCount: user.repositories.nodes.length,
      languages: languageMap,
      contributions: {
        total:
          user.contributionsCollection.contributionCalendar.totalContributions,
        weeks: user.contributionsCollection.contributionCalendar.weeks.map(
          (week: any) =>
            week.contributionDays.map((day: any) => ({
              date: day.date,
              count: day.contributionCount,
              color: day.color,
            }))
        ),
      },
    };

    // Charge quota only after a successful GitHub response
    const consumed = await consumeRateLimit(ip, "github-profile", { limit: 5, windowSec: 3600 });

    return NextResponse.json(response, {
      headers: {
        "X-RateLimit-Limit": "5",
        "X-RateLimit-Remaining": String(consumed.remaining),
        "X-RateLimit-Reset": String(consumed.resetIn),
      },
    });
  } catch (err: any) {
    console.error("GitHub profile API failed:", err);
    return NextResponse.json(
      { error: "Failed to load GitHub profile" },
      { status: 500 }
    );
  }
}