"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, Check, AlertCircle, Target, TrendingUp, Zap, Shield } from "lucide-react";

// --- TYPES ---
interface ActionResponse {
  // Analyze fields
  skillLevel?: string;
  developerType?: string;
  currentReality?: string;
  whatYouAreDoingWell?: string[];
  whatIsHoldingYouBack?: string[];
  yourPotentialIfYouAct?: string;
  
  // Suggest fields
  focusSkills?: string[];
  projectIdeas?: string[];
  stopDoing?: string[];
  doubleDownOn?: string[];
  
  // Improve fields
  improvements?: string[];
  missingPractices?: string[];
  refactorSuggestions?: string[];
  
  // Roast fields
  hardTruths?: string[];
  badSignalsYouAreSending?: string[];
  wakeUpCall?: string;
  
  [key: string]: any;
}

// --- SUB-COMPONENTS ---

const SkillLevelBadge = ({ level }: { level: string }) => {
  const colors = {
    beginner: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    intermediate: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    advanced: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  };
  
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium uppercase tracking-widest ${colors[level as keyof typeof colors] || colors.intermediate}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-current" />
      {level}
    </div>
  );
};

const InfoSection = ({ 
  title, 
  items, 
  icon: Icon,
  variant = "default" 
}: { 
  title: string;
  items: string[];
  icon?: any;
  variant?: "default" | "positive" | "negative" | "warning";
}) => {
  const variants = {
    default: { bullet: "bg-zinc-700", border: "border-zinc-800" },
    positive: { bullet: "bg-emerald-500", border: "border-emerald-900" },
    negative: { bullet: "bg-red-500/50", border: "border-red-900" },
    warning: { bullet: "bg-amber-500", border: "border-amber-900" }
  };
  
  const colors = variants[variant];
  
  return (
    <div className={`space-y-6 border-l-2 ${colors.border} pl-6`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
        <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {title}
        </h4>
      </div>
      <ul className="space-y-4">
        {items?.map((item, i) => (
          <motion.li 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="text-[15px] text-zinc-300 leading-relaxed flex gap-4"
          >
            <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${colors.bullet}`} />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

const QuoteBlock = ({ text }: { text: string }) => (
  <div className="relative py-12 px-8 bg-linear-to-br from-zinc-900/50 to-zinc-900/20 border border-zinc-800 rounded-lg">
    <div className="absolute top-6 left-6 text-6xl text-zinc-800 font-serif">"</div>
    <p className="text-white text-xl font-light leading-relaxed italic relative z-10 pl-8">
      {text}
    </p>
  </div>
);

const TruthCard = ({ text, index }: { text: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="group relative p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg hover:border-red-900 transition-all"
  >
    <div className="absolute top-4 right-4 text-zinc-800 text-sm font-mono">
      {String(index + 1).padStart(2, '0')}
    </div>
    <p className="text-zinc-300 text-base leading-relaxed pr-8">
      {text}
    </p>
  </motion.div>
);

export const ResultDisplay = ({ action, data }: { action: string, data: ActionResponse }) => {
  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-16 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2 text-zinc-500 text-xs font-medium uppercase tracking-widest">
          <Check className="w-3 h-3" /> Analysis Complete
        </div>
        <h2 className="text-5xl font-light text-white tracking-tight capitalize">
          {action}
        </h2>
      </motion.div>

      {/* ANALYZE VIEW */}
      {action === "analyze" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-16"
        >
          {/* Skill Level & Developer Type */}
          <div className="space-y-6">
            {data.skillLevel && <SkillLevelBadge level={data.skillLevel} />}
            {data.developerType && (
              <h3 className="text-3xl text-white font-light tracking-tight">
                {data.developerType}
              </h3>
            )}
          </div>

          {/* Current Reality */}
          {data.currentReality && (
            <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-lg">
              <p className="text-zinc-300 text-lg font-light leading-relaxed">
                {data.currentReality}
              </p>
            </div>
          )}

          {/* Strengths & Weaknesses Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {data.whatYouAreDoingWell && data.whatYouAreDoingWell.length > 0 && (
              <InfoSection 
                title="What You're Doing Well" 
                items={data.whatYouAreDoingWell}
                icon={Shield}
                variant="positive"
              />
            )}
            {data.whatIsHoldingYouBack && data.whatIsHoldingYouBack.length > 0 && (
              <InfoSection 
                title="What's Holding You Back" 
                items={data.whatIsHoldingYouBack}
                icon={AlertCircle}
                variant="negative"
              />
            )}
          </div>

          {/* Potential */}
          {data.yourPotentialIfYouAct && (
            <div className="pt-12 border-t border-zinc-800">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6">
                Your Potential
              </h4>
              <p className="text-xl text-zinc-200 font-light leading-relaxed">
                {data.yourPotentialIfYouAct}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* SUGGEST VIEW */}
      {action === "suggest" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-16"
        >
          <div className="grid md:grid-cols-2 gap-12">
            {data.focusSkills && data.focusSkills.length > 0 && (
              <InfoSection 
                title="Skills to Focus On" 
                items={data.focusSkills}
                icon={Target}
                variant="positive"
              />
            )}
            {data.doubleDownOn && data.doubleDownOn.length > 0 && (
              <InfoSection 
                title="Double Down On" 
                items={data.doubleDownOn}
                icon={TrendingUp}
                variant="positive"
              />
            )}
          </div>

          {data.projectIdeas && data.projectIdeas.length > 0 && (
            <InfoSection 
              title="Project Ideas" 
              items={data.projectIdeas}
              icon={Zap}
              variant="warning"
            />
          )}

          {data.stopDoing && data.stopDoing.length > 0 && (
            <InfoSection 
              title="Stop Doing" 
              items={data.stopDoing}
              icon={AlertCircle}
              variant="negative"
            />
          )}
        </motion.div>
      )}

      {/* IMPROVE VIEW */}
      {action === "improve" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-16"
        >
          {data.improvements && data.improvements.length > 0 && (
            <InfoSection 
              title="Key Improvements" 
              items={data.improvements}
              icon={TrendingUp}
              variant="warning"
            />
          )}

          {data.missingPractices && data.missingPractices.length > 0 && (
            <InfoSection 
              title="Missing Practices" 
              items={data.missingPractices}
              icon={AlertCircle}
              variant="negative"
            />
          )}

          {data.refactorSuggestions && data.refactorSuggestions.length > 0 && (
            <InfoSection 
              title="Refactor Suggestions" 
              items={data.refactorSuggestions}
              icon={Zap}
              variant="default"
            />
          )}
        </motion.div>
      )}

      {/* ROAST VIEW */}
      {action === "roast" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-16"
        >
          {/* Hard Truths */}
          {data.hardTruths && data.hardTruths.length > 0 && (
            <div className="space-y-6">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-red-400/70 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Hard Truths
              </h4>
              <div className="grid gap-4">
                {data.hardTruths.map((truth, i) => (
                  <TruthCard key={i} text={truth} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Bad Signals */}
          {data.badSignalsYouAreSending && data.badSignalsYouAreSending.length > 0 && (
            <InfoSection 
              title="Signals You're Sending" 
              items={data.badSignalsYouAreSending}
              icon={AlertCircle}
              variant="negative"
            />
          )}

          {/* Wake Up Call */}
          {data.wakeUpCall && (
            <div className="pt-8">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-8">
                Wake-Up Call
              </h4>
              <QuoteBlock text={data.wakeUpCall} />
            </div>
          )}
        </motion.div>
      )}
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
    { key: "analyze", label: "Analyze", desc: "A comprehensive review of your profile", icon: Target },
    { key: "suggest", label: "Suggest", desc: "Growth recommendations and roadmaps", icon: TrendingUp },
    { key: "roast", label: "Roast", desc: "A candid critique of your code history", icon: Zap },
    { key: "improve", label: "Improve", desc: "Specific repository optimizations", icon: Shield },
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
      <div className="max-w-4xl mx-auto px-8 py-32 relative z-10">
        <AnimatePresence mode="wait">
          {!activeAction ? (
             <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }} 
               className="space-y-16"
             >
                <div className="space-y-4">
                  <h1 className="text-4xl font-light text-white tracking-tight">GitHub Assistant</h1>
                  <p className="text-lg text-zinc-500 font-light">Choose an analysis to perform on your profile.</p>
                </div>

                <div className="space-y-2">
                  {actions.map(a => (
                    <button 
                      key={a.key} 
                      onClick={() => runAction(a.key)}
                      className="group flex items-center justify-between py-8 px-6 border border-zinc-900 rounded-lg w-full text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/30"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                          <a.icon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-white text-lg font-medium block">{a.label}</span>
                          <span className="text-sm text-zinc-500 font-light">{a.desc}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
             </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button 
                onClick={() => { setActiveAction(null); setResult(null); setError(null); }}
                className="mb-16 inline-flex items-center gap-3 text-sm text-zinc-500 hover:text-white transition-colors group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
                Back to dashboard
              </button>
              
              {loading ? (
                 <div className="flex flex-col items-center justify-center py-32 space-y-8">
                    <div className="w-16 h-16 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
                    <p className="text-sm text-zinc-500 font-light tracking-widest uppercase">Analyzing your profile</p>
                 </div>
              ) : error ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-base text-red-400 bg-red-400/5 rounded-lg border border-red-400/20 flex items-start gap-4"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium mb-1">Analysis Failed</div>
                    <div className="text-sm text-red-400/70">{error}</div>
                  </div>
                </motion.div>
              ) : (
                <ResultDisplay action={activeAction} data={result!} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}