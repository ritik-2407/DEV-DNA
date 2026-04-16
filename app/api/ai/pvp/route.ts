import { NextResponse } from "next/server";
import { checkRateLimit, consumeRateLimit } from "@/app/lib/rateLimit";
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

    const limitCheck = await checkRateLimit(ip, "ai-pvp", { limit: 2, windowSec: 86400 });

    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: `Daily limit reached. You have used all 2 battles for today. Resets in ${Math.ceil(limitCheck.resetIn / 3600)}h.` },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "2",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(limitCheck.resetIn),
            "Retry-After": String(limitCheck.resetIn),
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

    // Only charge the quota after a real LLM response was successfully parsed
    const consumed = await consumeRateLimit(ip, "ai-pvp", { limit: 2, windowSec: 86400 });

    return NextResponse.json(
      { success: true, verdict },
      {
        headers: {
          "X-RateLimit-Limit": "2",
          "X-RateLimit-Remaining": String(consumed.remaining),
          "X-RateLimit-Reset": String(consumed.resetIn),
        },
      }
    );
  } catch (err: any) {
    console.error("PVP API crashed:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
