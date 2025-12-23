import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { githubFetch } from "@/app/lib/githubFetch";
import { normaliseGitHubData } from "@/app/lib/normalizeGitHubData";
import { buildPrompt } from "@/app/lib/promptGenerator";
import { runLLM } from "@/app/lib/llm";

export async function POST(req: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Token
    const token = await getToken({ req: req as any });
    const githubAccessToken = token?.githubAccessToken as string;
    const githubUsername = token?.githubUsername as string;

    if (!githubAccessToken || !githubUsername) {
      return Response.json(
        { success: false, error: "GitHub context missing" },
        { status: 401 }
      );
    }

    // Action
    const { action } = await req.json();
    if (!action) {
      return Response.json(
        { success: false, error: "Action required" },
        { status: 400 }
      );
    }

    //  Fetch GitHub data (stateless)
    const user = await githubFetch("/user", githubAccessToken);
    const repos = await githubFetch(
      "/user/repos?per_page=100",
      githubAccessToken
    );
    const events = await githubFetch(
      `/users/${githubUsername}/events`,
      githubAccessToken
    );

    const profile = await normaliseGitHubData(user, repos, events);

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
