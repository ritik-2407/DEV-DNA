"use client";

import { useState } from "react";
import { ResultDisplay } from "../components/ResultDisplay";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Search, MessageSquareWarning, Lightbulb, 
  ArrowLeft, Cpu, Sparkles
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
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      
      {/* --- VIBRANT BACKGROUND LAYERS --- */}
      <div className="fixed inset-0 z-0">
        {/* Deep ambient glow (Top Left) */}
        <div className="absolute top-[10%] left-[10%] w-125 h-125 bg-emerald-500/17 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Secondary ambient glow (Bottom Right) */}
        <div className="absolute bottom-[-1%] right-[10%] w-125 h-125 bg-emerald-500/15 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />
        
        {/* Grain/Noise Texture for "premium" feel */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10 px-6 py-8">
        <AnimatePresence mode="wait">
          {!activeAction ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div className="flex flex-col items-center text-center space-y-4 ">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 mb-20 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] tracking-[0.3em] font-bold uppercase backdrop-blur-md shadow-lg shadow-emerald-900/20"
                >
                  <Cpu className="w-3 h-3 " />
                  <span>LLM CONNECTED</span>
                </motion.div>
                
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-white via-zinc-200 to-zinc-600 drop-shadow-2xl mb-6">
                  COMMAND HUB
                </h1>
                
                <p className="text-zinc-400 text-base max-w-md font-medium leading-relaxed">
                  Select an operation below
                </p>
              </div>

              {/* Vertical Stack Implementation */}
              <div className="flex flex-col gap-4">
                {actions.map((a, i) => (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + (i * 0.05) }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    key={a.key}
                    onClick={() => runAction(a.key)}
                    // Keeping the card structure exactly as requested, focusing on how it sits on the background
                    className={`group relative p-5 rounded-xl border border-white/5 bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 text-left flex items-center gap-6 ${a.border} hover:shadow-2xl hover:shadow-black/50`}
                  >
                    <div className={`absolute inset-0 bg-linear-to-r ${a.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`} />
                    
                    {/* Icon Column */}
                    <div className={`${a.text} relative z-10 p-3 bg-black/50 rounded-lg border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                      {a.icon}
                    </div>

                    {/* Content Column */}
                    <div className="relative z-10 flex-1">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                        {a.label}
                        <ArrowLeft className="w-3 h-3 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all rotate-180 text-white/50" />
                      </h3>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                        {a.desc}
                      </p>
                    </div>

                    {/* Decorative Terminal End */}
                    <div className="relative z-10 text-[10px] text-zinc-800 font-mono font-bold hidden sm:block group-hover:text-white/20 transition-colors">
                      EXEC_
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <button 
                  onClick={() => { setActiveAction(null); setResult(null); }}
                  className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest group"
                >
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
                  Return to Hub
                </button>
                <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono bg-white/5 px-2 py-1 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ACTION::{activeAction?.toUpperCase()}
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                  <div className="relative">
                    <div className="w-12 h-12 border-2 border-white/10 rounded-full" />
                    <div className="absolute inset-0 w-12 h-12 border-2 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-xs text-emerald-500/80 uppercase tracking-[0.3em] animate-pulse font-bold">
                    Analyzing Data Stream...
                  </p>
                </div>
              ) : error ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl border border-red-500/20 bg-red-500/10 backdrop-blur-md text-sm text-red-200 text-center shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                >
                  <p className="font-bold mb-1">Execution Failed</p>
                  <span className="opacity-70">{error}</span>
                </motion.div>
              ) : (
                <div className="bg-zinc-900/40 rounded-2xl border border-white/10 p-8 backdrop-blur-xl shadow-2xl">
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