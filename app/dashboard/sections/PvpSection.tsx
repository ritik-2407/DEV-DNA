"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Swords,
  Loader2,
  Zap,
  GitCommit,
  Users,
  Star,
  Ghost,
} from "lucide-react";

type PvpPlayerState = {
  data: any | null;
  loading: boolean;
  error: string | null;
};

export default function PvpSection({ username }: { username: string }) {
  const [player1Name, setPlayer1Name] = useState(username);
  const [player2Name, setPlayer2Name] = useState("");

  const [p1State, setP1State] = useState<PvpPlayerState>({
    data: null,
    loading: false,
    error: null,
  });
  const [p2State, setP2State] = useState<PvpPlayerState>({
    data: null,
    loading: false,
    error: null,
  });

  const [aiVerdict, setAiVerdict] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [lastFoughtP1, setLastFoughtP1] = useState("");
  const [lastFoughtP2, setLastFoughtP2] = useState("");

  const [quota, setQuota] = useState<{
    remaining: number;
    limit: number;
    resetIn: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/ai/rate-status?tag=ai-pvp")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setQuota(json);
      })
      .catch(() => {
        /* silently fail */
      });
  }, []);

  const startBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player1Name.trim() || !player2Name.trim()) return;

    // Reset
    setAiVerdict(null);
    setAiError(null);

    setP1State({ data: null, loading: true, error: null });
    setP2State({ data: null, loading: true, error: null });
    setAiLoading(true);

    // Fetch Player 1
    const fetch1 = fetch(
      `/api/github/pvp-profile?username=${encodeURIComponent(player1Name)}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setP1State({ data: json, loading: false, error: null });
        return json;
      })
      .catch((err) => {
        setP1State({ data: null, loading: false, error: err.message });
        return null;
      });

    // Fetch Player 2
    const fetch2 = fetch(
      `/api/github/pvp-profile?username=${encodeURIComponent(player2Name)}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setP2State({ data: json, loading: false, error: null });
        return json;
      })
      .catch((err) => {
        setP2State({ data: null, loading: false, error: err.message });
        return null;
      });

    // Await profiles
    const [p1Data, p2Data] = await Promise.all([fetch1, fetch2]);

    if (!p1Data || !p2Data) {
      setAiLoading(false);
      setAiError("Battle aborted: unable to load one or both profiles.");
      return;
    }

    // Hit AI Endpoint
    try {
      const aiRes = await fetch("/api/ai/pvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player1Data: p1Data, player2Data: p2Data }),
      });
      const aiJson = await aiRes.json();

      if (!aiJson.success) throw new Error(aiJson.error);

      setAiVerdict(aiJson.verdict);
      setLastFoughtP1(player1Name.trim());
      setLastFoughtP2(player2Name.trim());
      // Optimistically decrement quota in UI
      setQuota((prev) =>
        prev ? { ...prev, remaining: Math.max(0, prev.remaining - 1) } : prev,
      );
    } catch (err: any) {
      setAiError(err.message || "The AI judges refused to respond.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full text-zinc-300">
      {/* ── Header ── */}
      <div className="flex flex-col items-center justify-center text-center pt-4 pb-8 border-b border-white/5 mb-8">
        <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">
          Profile Comparison
        </h2>

        {/* ── Daily Quota Pill ── */}
        {quota !== null && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`mt-8 mb-4 flex items-center gap-2 px-4 py-2 rounded-full border text-s font-bold backdrop-blur-sm transition-colors ${
              quota.remaining === 0
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : quota.remaining <= 1
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-emerald-500/20 bg-emerald-500/8 text-emerald-400"
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            {quota.remaining === 0 ? (
              <span>
                Daily limit reached · Resets in{" "}
                <span className="font-black">
                  {quota.resetIn > 3600
                    ? `${Math.ceil(quota.resetIn / 3600)}h`
                    : `${Math.ceil(quota.resetIn / 60)}m`}
                </span>
              </span>
            ) : (
              <span>
                <span className="font-black">{quota.remaining}</span>
                <span className="text-zinc-500 font-normal">
                  {" "}
                  / {quota.limit}
                </span>
                <span className="text-zinc-500 font-normal ml-1">left </span>
              </span>
            )}
          </motion.div>
        )}

        <form
          onSubmit={startBattle}
          className="mt-8 flex flex-col items-center justify-center w-full max-w-md gap-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-3">
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              disabled={aiLoading}
              placeholder="Developer 1"
              className="w-full sm:flex-1 bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 text-center disabled:opacity-50"
            />
            <div className="text-zinc-600 font-bold text-xs py-1 sm:py-0">
              VS
            </div>
            <input
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              disabled={aiLoading}
              placeholder="Developer 2"
              className="w-full sm:flex-1 bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 text-center disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={
              aiLoading ||
              !player1Name.trim() ||
              !player2Name.trim() ||
              (aiVerdict !== null &&
                player1Name.trim() === lastFoughtP1 &&
                player2Name.trim() === lastFoughtP2)
            }
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-8 py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {aiLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Fight !"
            )}
          </button>
        </form>
      </div>

      {/* ── Arena ── */}
      {(p1State.loading || p2State.loading || p1State.data || p2State.data) && (
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <PlayerCard state={p1State} isP1={true} aiVerdict={aiVerdict} />
            <PlayerCard state={p2State} isP1={false} aiVerdict={aiVerdict} />

            {/* Center VS overlap */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black border-4 border-zinc-900 items-center justify-center z-20 shadow-2xl">
              <span className="text-emerald-500 font-black italic text-xl tracking-tighter">
                VS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Conclusion / Verdict ── */}
      <AnimatePresence>
        {aiLoading &&
          p1State.data &&
          p2State.data &&
          !aiVerdict &&
          !aiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-8 flex flex-col items-center justify-center py-12 text-zinc-500"
            >
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500/50" />
              <p className="text-sm font-mono tracking-widest uppercase animate-pulse">
                Analyzing metrics...
              </p>
            </motion.div>
          )}

        {aiError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-200 text-center text-sm"
          >
            {aiError}
          </motion.div>
        )}

        {aiVerdict && (
          <div className="mt-12 flex flex-col gap-6">
            {/* Scoreboard Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/40 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-xl shadow-2xl"
            >
              <div className="grid grid-cols-1 divide-y divide-white/5 py-2">
                {Object.entries(
                  aiVerdict.categoryScores || aiVerdict.categoryWinners || {},
                ).map(([cat, info]: any, idx) => {
                  const p1Score =
                    typeof info.player1Score === "number"
                      ? info.player1Score
                      : 0;
                  const p2Score =
                    typeof info.player2Score === "number"
                      ? info.player2Score
                      : 0;

                  return (
                    <div
                      key={idx}
                      className="flex items-center py-4 px-2 sm:px-6 gap-2 sm:gap-4 group hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Player 1 Score */}
                      <div className="flex-1 flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2 sm:gap-3">
                        <span className="text-sm font-bold text-white">
                          {p1Score}
                          <span className="text-zinc-600 font-normal">/10</span>
                        </span>
                        <div className="h-1.5 w-16 sm:w-24 bg-zinc-800 rounded-full overflow-hidden flex justify-end">
                          <div
                            className={`h-full bg-emerald-500 ${p1Score < p2Score ? "opacity-30" : ""}`}
                            style={{ width: `${(p1Score / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Category Name */}
                      <div className="w-24 sm:w-32 text-center shrink-0">
                        <div className="text-[10px] sm:text-xs font-black text-zinc-500 uppercase tracking-widest">
                          {cat.replace(/_/g, " ")}
                        </div>
                      </div>

                      {/* Player 2 Score */}
                      <div className="flex-1 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-start gap-2 sm:gap-3">
                        <div className="h-1.5 w-16 sm:w-24 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-emerald-500 ${p2Score < p1Score ? "opacity-30" : ""}`}
                            style={{ width: `${(p2Score / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-white">
                          {p2Score}
                          <span className="text-zinc-600 font-normal">/10</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Final Score & Verdict Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/40 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col"
            >
              {/* Massive Score UI on Top */}
              <div className="bg-emerald-500/5 p-8 md:py-12 flex flex-col items-center justify-center text-center relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-50 pointer-events-none" />

                <h3 className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-8 relative z-10">
                  Match Result
                </h3>

                <div className="flex items-center justify-center gap-8 w-full max-w-sm mx-auto relative z-10">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold truncate w-full">
                      {aiVerdict.player1}
                    </span>
                    <span
                      className={`text-6xl tracking-tighter font-black ${aiVerdict.score?.player1 > aiVerdict.score?.player2 ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" : "text-zinc-400 opacity-80"}`}
                    >
                      {aiVerdict.score?.player1 || 0}
                    </span>
                  </div>

                  <div className="text-emerald-500/20 font-black italic text-2xl">
                    VS
                  </div>

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold truncate w-full">
                      {aiVerdict.player2}
                    </span>
                    <span
                      className={`text-6xl tracking-tighter font-black ${aiVerdict.score?.player2 > aiVerdict.score?.player1 ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" : "text-zinc-400 opacity-80"}`}
                    >
                      {aiVerdict.score?.player2 || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Final Verdict Text Below */}
              <div className="p-8 md:p-12 text-center max-w-4xl mx-auto flex flex-col items-center justify-center">
                <h3 className="text-[20px] uppercase tracking-widest text-zinc-500 font-bold mb-6">
                  Final Verdict
                </h3>
                <p className="text-xl md:text-xl text-white/90 leading-relaxed font-sans font-light tracking-wide mb-8">
                  "{aiVerdict.verdict}"
                </p>
                <div className="text-lg  text-emerald-400 italic tracking-tight">
                  {aiVerdict.closingRemark}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlayerCard({
  state,
  isP1,
  aiVerdict,
}: {
  state: PvpPlayerState;
  isP1: boolean;
  aiVerdict: any;
}) {
  if (state.loading) {
    return (
      <div
        className={`p-6 rounded-2xl border border-white/5 bg-zinc-900/20 flex flex-col items-center justify-center min-h-[300px] ${isP1 ? "border-l-indigo-500/20" : "border-r-purple-500/20"}`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/10 flex flex-col items-center justify-center min-h-[300px] text-red-300 text-sm text-center">
        <Ghost className="w-8 h-8 mb-2 opacity-50" />
        <p className="font-bold">Failed to find challenger</p>
        <span className="opacity-70 text-xs mt-1">{state.error}</span>
      </div>
    );
  }

  if (!state.data) return <div />;

  const p = state.data;
  const isWinner =
    aiVerdict && aiVerdict.overallWinner === (isP1 ? "player1" : "player2");
  const isLoser = aiVerdict && aiVerdict.overallWinner !== "tie" && !isWinner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-6 rounded-2xl border transition-colors duration-500 overflow-hidden ${
        isWinner
          ? "border-emerald-500/40 bg-zinc-900/60 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
          : isLoser
            ? "border-white/5 bg-zinc-900/20 opacity-60 grayscale-[10%]"
            : "border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60"
      }`}
    >
      {/* Background gradient hint */}
      <div
        className={`absolute top-0 w-full h-1/2 opacity-10 blur-3xl pointer-events-none`}
      />

      {isWinner && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2 py-1 rounded-sm bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
            Winner
          </span>
        </div>
      )}

      {isLoser && (
        <div className="absolute top-4 right-4 rotate-12 z-10">
          <span className="px-2 py-1 rounded-sm bg-zinc-800/80 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border border-zinc-700">
            Runner-up
          </span>
        </div>
      )}

      <div
        className={`flex flex-col items-center text-center ${isP1 ? "sm:items-start sm:text-left" : "sm:items-end sm:text-right"}`}
      >
        <img
          src={p.avatar}
          alt={p.username}
          className="w-20 h-20 rounded-full mb-4 border-2 border-white/10"
        />
        <h3 className="text-xl font-bold text-white mb-1">
          {p.name || p.username}
        </h3>
        <a
          href={p.profileUrl}
          target="_blank"
          className="text-sm font-mono text-zinc-500 hover:text-white transition-colors mb-6"
        >
          @{p.username}
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 relative z-10">
        <StatBox label="Streak" value={p.contributions.longestStreak} />
        <StatBox
          label="Commits"
          value={p.contributions.totalCommits.toLocaleString()}
        />
        <StatBox label="Stars" value={p.totalStars.toLocaleString()} />
        <StatBox label="Followers" value={p.followers.toLocaleString()} />
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500 uppercase tracking-wider font-bold">
            Lvl {Math.floor(p.accountAgeYears * 10)}
          </span>
          <span className="text-zinc-600">
            {p.uniqueLanguages} langs • {p.repoCount} repos
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-black/30 border border-white/5 rounded-lg p-3 flex flex-col gap-1 items-start group hover:border-white/10 transition-colors">
      <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
        {label}
      </div>
      <div className="text-emerald-400 font-mono text-base font-medium">
        {value}
      </div>
    </div>
  );
}
