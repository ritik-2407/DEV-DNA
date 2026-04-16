import { NextResponse } from "next/server";
import { checkRateLimit } from "@/app/lib/rateLimit";
import { headers } from "next/headers";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const PVP_PROFILE_QUERY = `
query ($login: String!) {
  user(login: $login) {
    login
    name
    avatarUrl
    url
    createdAt
    followers { totalCount }
    following { totalCount }
    organizations(first: 100) { totalCount }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
    repositories(ownerAffiliations: OWNER, first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
      nodes {
        name
        stargazerCount
        forkCount
        watchers { totalCount }
        openIssues: issues(states: OPEN) { totalCount }
        primaryLanguage { name }
      }
    }
  }
}
`;

function calcLongestStreak(weeks: any[]): number {
  const days = weeks.flatMap((w: any) => w.contributionDays);
  let longest = 0, current = 0;
  for (const day of days) {
    if (day.contributionCount > 0) { current++; longest = Math.max(longest, current); }
    else { current = 0; }
  }
  return longest;
}

function calcCurrentStreak(weeks: any[]): number {
  const days = weeks.flatMap((w: any) => w.contributionDays).reverse();
  let streak = 0;
  for (const day of days) {
    if (day.contributionCount > 0) { streak++; }
    else if (streak > 0) { break; }
  }
  return streak;
}

function calcActiveWeeks(weeks: any[]): number {
  return weeks.filter((w: any) =>
    w.contributionDays.some((d: any) => d.contributionCount > 0)
  ).length;
}

export async function GET(req: Request) {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
      headersList.get("x-real-ip") ??
      "unknown";

    const limit = await checkRateLimit(ip, "github-pvp-profile", {
      limit: 2,
      windowSec: 60,
    });

    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${limit.resetIn}s.` },
        { status: 429, headers: { "Retry-After": String(limit.resetIn) } }
      );
    }

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
        query: PVP_PROFILE_QUERY,
        variables: { login: githubUsername },
      }),
      next: { revalidate: 60 * 60 * 6 },
    });

    if (!res.ok) {
      throw new Error("GitHub GraphQL request failed");
    }

    const json = await res.json();

    if (json.errors) {
      const notFound = json.errors.some((e: any) =>
        e.type === "NOT_FOUND" || e.message?.includes("Could not resolve")
      );
      if (notFound) {
        return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
      }
      throw new Error(json.errors[0]?.message || "GitHub GraphQL error");
    }

    const user = json?.data?.user;
    if (!user) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
    }

    const repos: any[] = user.repositories.nodes;
    const contrib = user.contributionsCollection;
    const weeks = contrib.contributionCalendar.weeks;

    const totalStars = repos.reduce((s: number, r: any) => s + r.stargazerCount, 0);
    const totalForks = repos.reduce((s: number, r: any) => s + r.forkCount, 0);
    const totalWatchers = repos.reduce((s: number, r: any) => s + r.watchers.totalCount, 0);

    const top3Repos = repos.slice(0, 3).map((r: any) => ({
      name: r.name,
      stars: r.stargazerCount,
      language: r.primaryLanguage?.name ?? null,
    }));

    const langRepoCount: Record<string, number> = {};
    for (const repo of repos) {
      const lang = repo.primaryLanguage?.name;
      if (lang) langRepoCount[lang] = (langRepoCount[lang] ?? 0) + 1;
    }
    const topLanguages = Object.entries(langRepoCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, repoCount: count }));

    const createdAt = new Date(user.createdAt);
    const accountAgeYears = +(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    ).toFixed(1);

    const response = {
      username: user.login,
      name: user.name,
      avatar: user.avatarUrl,
      profileUrl: user.url,
      accountAgeYears,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      orgsCount: user.organizations.totalCount,
      repoCount: repos.length,
      totalStars,
      totalForks,
      totalWatchers,
      avgStarsPerRepo: repos.length > 0 ? +(totalStars / repos.length).toFixed(2) : 0,
      top3Repos,
      reposOver50Stars: repos.filter((r: any) => r.stargazerCount > 50).length,
      reposOver100Stars: repos.filter((r: any) => r.stargazerCount > 100).length,
      topLanguages,
      uniqueLanguages: Object.keys(langRepoCount).length,
      contributions: {
        total: contrib.contributionCalendar.totalContributions,
        totalCommits: contrib.totalCommitContributions,
        totalPRs: contrib.totalPullRequestContributions,
        totalIssues: contrib.totalIssueContributions,
        totalReviews: contrib.totalPullRequestReviewContributions,
        longestStreak: calcLongestStreak(weeks),
        currentStreak: calcCurrentStreak(weeks),
        activeWeeks: calcActiveWeeks(weeks),
      },
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("GitHub PVP profile API failed:", err);
    return NextResponse.json(
      { error: "Failed to load GitHub PVP profile" },
      { status: 500 }
    );
  }
}
