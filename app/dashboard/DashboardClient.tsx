"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { ResultDisplay } from "../components/ResultDisplay";
import { ErrorBoundary } from "../components/ErrorBoundary";
import ResultSkeleton from "../components/ResultSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BarChart2, Zap } from "lucide-react";
import StatsSection from "./sections/StatsSection";
import ActionsSection from "./sections/ActionsSection";

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeAction = searchParams.get("action");

  const [activeTab, setActiveTab] = useState<"stats" | "actions">("stats");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const executeAction = useCallback(async (actionKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionKey }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unknown error");
      setResult(json.data);
    } catch (err: any) {
      setError(err?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeAction) {
      if (!result && !loading) {
        executeAction(activeAction);
      }
    } else {
      setResult(null);
      setError(null);
    }
  }, [activeAction, result, loading, executeAction]);

  const runAction = (actionKey: string) => {
    router.push(`?action=${actionKey}`);
  };

  const handleReturn = () => {
    router.push("/dashboard");
  };

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Background Layers */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[10%] left-[10%] w-125 h-125 bg-emerald-500/17 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-1%] right-[10%] w-125 h-125 bg-emerald-500/15 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />
      </div>

      {/* Navbar */}
      <AnimatePresence>
        {!activeAction && (
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex items-center justify-center pt-8 pb-4 px-6"
          >
            <div className="flex items-center gap-1 border border-white/5 bg-zinc-900/60 backdrop-blur-xl rounded-full p-1">
              <NavTab
                label="Stats"
                icon={<BarChart2 className="w-3.5 h-3.5" />}
                active={activeTab === "stats"}
                onClick={() => setActiveTab("stats")}
              />
              <NavTab
                label="Actions"
                icon={<Zap className="w-3.5 h-3.5" />}
                active={activeTab === "actions"}
                onClick={() => setActiveTab("actions")}
              />
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto relative z-10 px-6 py-8">
        <AnimatePresence mode="wait">
          {!activeAction ? (
            <motion.div
              key="hub"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {activeTab === "stats" ? (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                  >
                    <StatsSection />
                  </motion.div>
                ) : (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ActionsSection
                      onRunAction={runAction}
                      onLogout={handleLogout}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              {loading ? (
                <ResultSkeleton />
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl border border-red-500/20 bg-red-500/10 backdrop-blur-md text-sm text-red-200 text-center"
                >
                  <p className="font-bold mb-1">Execution Failed</p>
                  <span className="opacity-70">{error}</span>
                </motion.div>
              ) : (
                <ErrorBoundary fallbackAction={handleReturn}>
                  <div className="bg-zinc-900/40 rounded-2xl border border-white/10 px-8 backdrop-blur-xl shadow-2xl">
                    <ResultDisplay action={activeAction} data={result} />
                  </div>
                </ErrorBoundary>
              )}

              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <button
                  onClick={handleReturn}
                  className="cursor-pointer flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest group"
                >
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  Return to Hub
                </button>
                <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono bg-white/5 px-2 py-1 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ACTION::{activeAction?.toUpperCase()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── NavTab sub-component ──────────────────────────────────────────────────────
function NavTab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer relative flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
        active
          ? "text-emerald-400"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10">{label}</span>
    </button>
  );
}