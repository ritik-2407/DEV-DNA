import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

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
      }
    }
  }
}
`;

export async function GET(req: Request) {
  try {
    // Auth (JWT)
    const token = await getToken({ req: req as any });

    const githubAccessToken = token?.githubAccessToken as string;
    const githubUsername = token?.githubUsername as string;

    if (!githubAccessToken || !githubUsername) {
      return NextResponse.json(
        { error: "GitHub auth context missing" },
        { status: 401 }
      );
    }

    // GitHub GraphQL call
    const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GITHUB_PROFILE_QUERY,
        variables: { login: githubUsername },
      }),
      // profile data changes slowly → safe to cache
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

    // Shape clean response
    const response = {
      username: user.login,
      name: user.name,
      avatar: user.avatarUrl,
      followers: user.followers.totalCount,
      stars: totalStars,
      repoCount: user.repositories.nodes.length,
      contributions: {
        total:
          user.contributionsCollection.contributionCalendar.totalContributions,
        weeks:
          user.contributionsCollection.contributionCalendar.weeks.map(
            (week: any) =>
              week.contributionDays.map((day: any) => ({
                date: day.date,
                count: day.contributionCount,
                color: day.color,
              }))
          ),
      },
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("GitHub profile API failed:", err);
    return NextResponse.json(
      { error: "Failed to load GitHub profile" },
      { status: 500 }
    );
  }
}
