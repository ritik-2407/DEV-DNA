import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { githubFetch } from "@/app/lib/githubFetch";
import { normaliseGitHubData } from "@/app/lib/normalizeGitHubData";
import { buildPrompt } from "@/app/lib/promptGenerator";
import { geminiModel } from "@/app/lib/gemini";

export async function POST(req: Request) {
  try {
    console.log("AI/ACTION api HIT");

    // 1️⃣ Auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Token
    const token = await getToken({ req: req as any });
    const githubAccessToken = token?.githubAccessToken as string;
    const githubUsername = token?.githubUsername as string;

    if (!githubAccessToken || !githubUsername) {
      return Response.json(
        { success: false, error: "GitHub context missing" },
        { status: 401 }
      );
    }

    // 3️⃣ Action
    const { action } = await req.json();
    if (!action) {
      return Response.json(
        { success: false, error: "Action required" },
        { status: 400 }
      );
    }

    // 4️⃣ Fetch GitHub data (stateless)
    const user = await githubFetch("/user", githubAccessToken);
    const repos = await githubFetch("/user/repos?per_page=100", githubAccessToken);
    const events = await githubFetch(
      `/users/${githubUsername}/events`,
      githubAccessToken
    );

    const profile = normaliseGitHubData(user, repos, events);

    // 5️⃣ Prompt
    const prompt = buildPrompt(action, profile);

    // 6️⃣ Gemini call
    let raw: string;

    try {
      const result = await geminiModel.generateContent(prompt);
      raw = result.response.text();
    } catch (err) {
      console.error("Gemini failed:", err);
      return Response.json(
        { success: false, error: "Gemini API failed" },
        { status: 500 }
      );
    }

    if (!raw) {
      throw new Error("Empty Gemini response");
    }

    // 7️⃣ Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return Response.json(
        {
          success: false,
          error: "Invalid JSON returned by Gemini",
          raw,
        },
        { status: 500 }
      );
    }

    // 8️⃣ Success
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
