import { NextResponse } from "next/server";
import { getRateLimitStatus } from "@/app/lib/rateLimit";
import { headers } from "next/headers";

const CONFIGS: Record<string, { limit: number; windowSec: number }> = {
  "ai-action": { limit: 4, windowSec: 86400 },
  "ai-pvp": { limit: 2, windowSec: 86400 },
  "github-profile": { limit: 5, windowSec: 3600 },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");

    if (!tag || !CONFIGS[tag]) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing 'tag' query param. Use 'ai-action' or 'ai-pvp'." },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
      headersList.get("x-real-ip") ??
      "unknown";

    const config = CONFIGS[tag];
    const status = await getRateLimitStatus(ip, tag, config);

    return NextResponse.json({ success: true, ...status });
  } catch (err: any) {
    console.error("rate-status GET crashed:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
