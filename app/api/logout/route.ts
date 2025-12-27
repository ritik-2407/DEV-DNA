import { getToken } from "next-auth/jwt";
import { NextRequest , NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = await getToken({ req  });

  if (!token?.githubAccessToken) {
    return NextResponse.json({ success: true });
  }

  // Revoke GitHub OAuth token
  await fetch(
    `https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/token`,
    {
      method: "DELETE",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`
          ).toString("base64"),
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        access_token: token.githubAccessToken,
      }),
    }
  );

  return NextResponse.json({ success: true });
}
