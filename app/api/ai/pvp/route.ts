import { NextResponse } from "next/server";
import { rateLimit } from "@/app/lib/rateLimit";
import { headers } from "next/headers";
import { buildPrompt } from "@/app/lib/promptGenerator";
import { runLLM } from "@/app/lib/llm";

export async function POST(req: Request) {
  try {
    // ── Rate limiting ─────────────────────────────────────────────────────────
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
      headersList.get("x-real-ip") ??
      "unknown";

    const limit = await rateLimit(ip, "ai-pvp", { limit: 2, windowSec: 60 });

    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: `Rate limit exceeded. Try again in ${limit.resetIn}s.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(limit.resetIn),
          },
        }
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    const { player1Data, player2Data } = await req.json();

    if (!player1Data || !player2Data) {
      return NextResponse.json(
        { success: false, error: "Both player1Data and player2Data profiles are required" },
        { status: 400 }
      );
    }

    if (player1Data.username.toLowerCase() === player2Data.username.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "You can't battle yourself! Enter two different users." },
        { status: 400 }
      );
    }

    // ── Build prompt and call LLM ─────────────────────────────────────────────
    const prompt = buildPrompt("pvp", { player1: player1Data, player2: player2Data });

    let raw: string | null;
    try {
      raw = await runLLM(prompt);
    } catch (err: any) {
      if (
        err?.status === 429 ||
        err?.message?.toLowerCase().includes("rate limit") ||
        err?.message?.toLowerCase().includes("too many requests")
      ) {
        return NextResponse.json(
          { success: false, error: "LLM rate limit reached. Please try again in a few minutes." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { success: false, error: "LLM API failed. Please try again." },
        { status: 500 }
      );
    }

    if (!raw) throw new Error("Empty LLM response");

    // ── Parse LLM response ────────────────────────────────────────────────────
    let verdict: any;
    try {
      const cleanRaw = raw
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      verdict = JSON.parse(cleanRaw);
    } catch {
      return NextResponse.json(
        { success: false, error: "LLM returned unexpected output. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      verdict,
    });
  } catch (err: any) {
    console.error("PVP API crashed:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
