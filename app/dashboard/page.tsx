"use client";

import { useState } from "react";
import { ResultDisplay } from "../components/ResultDisplay";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Search, MessageSquareWarning, Lightbulb, 
  ArrowLeft, Cpu
} from "lucide-react";

const actions = [
  { key: "analyze", label: "Analyze", icon: <Search className="w-5 h-5" />, color: "from-blue-500/10 to-transparent", border: "hover:border-blue-500/50", text: "text-blue-400", desc: "Full profile audit and metadata extraction." },
  { key: "suggest", label: "Suggest", icon: <Lightbulb className="w-5 h-5" />, color: "from-yellow-500/10 to-transparent", border: "hover:border-yellow-500/50", text: "text-yellow-400", desc: "AI-driven skill growth and contribution roadmap." },
  { key: "improve", label: "Improve", icon: <Zap className="w-5 h-5" />, color: "from-emerald-500/10 to-transparent", border: "hover:border-emerald-500/50", text: "text-emerald-400", desc: "Automated repo refactoring and optimization tips." },
  { key: "roast", label: "Roast", icon: <MessageSquareWarning className="w-5 h-5" />, color: "from-red-500/10 to-transparent", border: "hover:border-red-500/50", text: "text-red-400", desc: "A brutally honest critique of your commit history." },

];

export default function AIActionsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runAction(action: string) {
    setLoading(true);
    setError(null);
    setActiveAction(action);

    try {
      const res = await fetch("/api/ai/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unknown error");
      setResult(json.data);
    } catch (err: any) {
      setError(err?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-400 font-mono selection:bg-emerald-500/30">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b9810a,transparent_50%)]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10 px-6 py-12">
        <AnimatePresence mode="wait">
          {!activeAction ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center gap-2 text-emerald-500/80 text-[10px] tracking-[0.3em] font-bold uppercase mb-2">
                  <Cpu className="w-3 h-3" />
                  <span>System Ready</span>
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight mt-6">AI ACTION SPACE</h1>
                <p className="text-zinc-500 text-sm max-w-sm mt-3 mb-7">Select an action to initialize analysis.</p>
              </div>

              {/* Vertical Stack Implementation */}
              <div className="flex flex-col gap-4">
                {actions.map((a) => (
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    key={a.key}
                    onClick={() => runAction(a.key)}
                    className={`group relative p-4 rounded-lg border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-all text-left flex items-center gap-6 ${a.border}`}
                  >
                    <div className={`absolute inset-0 bg-linear-to-r ${a.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-lg`} />
                    
                    {/* Icon Column */}
                    <div className={`${a.text} relative z-10 p-3 bg-zinc-950 rounded-md border border-zinc-800`}>
                      {a.icon}
                    </div>

                    {/* Content Column */}
                    <div className="relative z-10 flex-1">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">{a.label}</h3>
                      <p className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-tight group-hover:text-zinc-300 transition-colors">
                        {a.desc}
                      </p>
                    </div>

                    {/* Decorative Terminal End */}
                    <div className="relative z-10 text-[10px] text-zinc-700 font-bold hidden sm:block">
                      RUN_&gt;
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <button 
                  onClick={() => { setActiveAction(null); setResult(null); }}
                  className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors uppercase font-bold tracking-widest"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
                <div className="text-[10px] text-zinc-600 font-mono">
                  ACTION::{activeAction?.toUpperCase()}
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] text-emerald-500 uppercase tracking-[0.2em] animate-pulse font-bold">Processing_Data</p>
                </div>
              ) : error ? (
                <div className="p-4 rounded border border-red-500/20 bg-red-500/5 text-[12px] text-red-400 text-center">
                  {error}
                </div>
              ) : (
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 backdrop-blur-sm">
                   <ResultDisplay action={activeAction} data={result} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}