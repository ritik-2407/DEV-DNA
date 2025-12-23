"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Check } from "lucide-react";

// --- TYPES ---
interface ActionResponse {
  developerType?: string;
  currentReality?: string;
  whatYouAreDoingWell?: string[];
  whatIsHoldingYouBack?: string[];
  hardTruths?: string[];
  wakeUpCall?: string;
  [key: string]: any;
}

// --- SUB-COMPONENTS ---

const InfoSection = ({ title, items, isNegative = false }: { title: string, items: string[], isNegative?: boolean }) => (
  <div className="space-y-5">
    <h4 className="text-[12px] font-semibold uppercase tracking-widest text-zinc-500">
      {title}
    </h4>
    <ul className="space-y-4">
      {items?.map((item, i) => (
        <li key={i} className="text-[15px] text-zinc-300 leading-relaxed flex gap-4">
          <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isNegative ? 'bg-zinc-700' : 'bg-white'}`} />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export const ResultDisplay = ({ action, data }: { action: string, data: ActionResponse }) => {
  if (!data) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-16 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Refined Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-zinc-500 text-[12px] font-medium uppercase tracking-widest">
          <Check className="w-3 h-3" /> Analysis Completed
        </div>
        <h2 className="text-4xl font-medium text-white tracking-tight capitalize">
          {action}
        </h2>
      </div>

      <div className="space-y-16">
        {action === "analyze" && (
          <>
            <div className="space-y-6 border-l border-zinc-800 pl-8">
              <h3 className="text-2xl text-white font-medium">{data.developerType}</h3>
              <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-xl">
                {data.currentReality}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
              <InfoSection title="Strengths" items={data.whatYouAreDoingWell || []} />
              <InfoSection title="Areas for Growth" items={data.whatIsHoldingYouBack || []} isNegative />
            </div>
          </>
        )}

        {action === "roast" && (
          <div className="space-y-12">
            <div className="space-y-8">
              {data.hardTruths?.map((item, i) => (
                <div key={i} className="group border-b border-zinc-900 pb-8 last:border-0">
                  <p className="text-zinc-300 text-lg font-light leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-zinc-800">
              <p className="text-white text-2xl font-light leading-snug italic">
                "{data.wakeUpCall}"
              </p>
            </div>
          </div>
        )}

        {(action === "suggest" || action === "improve") && (
          <div className="grid gap-16">
            {Object.entries(data).map(([key, value]) => {
              if (typeof value === 'string') return null;
              return (
                <InfoSection 
                  key={key} 
                  title={key.replace(/([A-Z])/g, ' $1')} 
                  items={Array.isArray(value) ? value : []} 
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function AIActionsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActionResponse | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const actions = [
    { key: "analyze", label: "Analyze", desc: "A comprehensive review of your profile" },
    { key: "suggest", label: "Suggest", desc: "Growth recommendations and roadmaps" },
    { key: "roast", label: "Roast", desc: "A candid critique of your code history" },
    { key: "improve", label: "Improve", desc: "Specific repository optimizations" },
  ];

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
      if (!json.success) throw new Error(json.error);
      setResult(json.data);
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans antialiased selection:bg-white selection:text-black">
      <div className="max-w-xl mx-auto px-8 py-32 relative z-10">
        <AnimatePresence mode="wait">
          {!activeAction ? (
             <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }} 
               className="space-y-16"
             >
                <div className="space-y-4">
                  <h1 className="text-3xl font-medium text-white tracking-tight">GitHub Assistant</h1>
                  <p className="text-base text-zinc-500 font-light">Choose an analysis to perform on your profile.</p>
                </div>

                <div className="space-y-2">
                  {actions.map(a => (
                    <button 
                      key={a.key} 
                      onClick={() => runAction(a.key)}
                      className="group flex items-center justify-between py-8 border-b border-zinc-900 w-full text-left transition-all hover:border-zinc-500"
                    >
                      <div className="space-y-1">
                        <span className="text-white text-lg font-medium block">{a.label}</span>
                        <span className="text-[14px] text-zinc-500 font-light">{a.desc}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
             </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button 
                onClick={() => { setActiveAction(null); setResult(null); }}
                className="mb-16 inline-flex items-center gap-3 text-[14px] text-zinc-500 hover:text-white transition-colors group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
                Back to dashboard
              </button>
              
              {loading ? (
                 <div className="flex flex-col items-center justify-center py-32 space-y-8">
                    <div className="w-12 h-px bg-zinc-800 overflow-hidden relative">
                      <div className="absolute inset-0 bg-white w-1/2 animate-[progress_1.5s_infinite_ease-in-out]" />
                    </div>
                    <p className="text-sm text-zinc-500 font-light tracking-widest uppercase">Analyzing</p>
                 </div>
              ) : error ? (
                <div className="p-6 text-[15px] text-red-400 bg-red-400/5 rounded border border-red-400/10">
                  {error}
                </div>
              ) : (
                <ResultDisplay action={activeAction} data={result!} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}