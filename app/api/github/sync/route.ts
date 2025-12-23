import { githubFetch } from "@/app/lib/githubFetch";
import { normaliseGitHubData } from "@/app/lib/normalizeGitHubData";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { saveProfile } from "@/app/lib/profileStore";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
console.log("GITHUB SYNC ROUTE HIT");

  // Auth check (identity)
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Token access (capability)
  const token = await getToken({ req: req as any });
  const githubAccessToken = token?.githubAccessToken as string;
  const githubUsername = token?.githubUsername as string;

  if (!githubAccessToken || !githubUsername) {
    return new Response("GitHub token missing", { status: 401 });
  }

  // GitHub API calls
const user = await githubFetch("/user", githubAccessToken)
const repos = await githubFetch("/user/repos?per_page=100", githubAccessToken)
const events = await githubFetch(`/users/${githubUsername}/events`, githubAccessToken)

  //  Normalize + store
  const profile = normaliseGitHubData(user, repos, events);
  await saveProfile(githubUsername, profile);

  


  return Response.json({ success: true });
}
