"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, AlertCircle, Target, TrendingUp, Zap, Shield } from "lucide-react";

// --- TYPES ---
interface ActionResponse {
  // Analyze fields
  skillLevel?: string;
  coreIdentity?: string;
  developerType?: string;
  currentReality?: string;
  strengths?: string[];
  weaknesses?: string[];
  
  // Suggest fields
  focusSkills?: string[];
  projectIdeas?: string[];
  stopDoing?: string[];
  doubleDownOn?: string[];
  
  // Improve fields
  improvements?: string[];
  missingPractices?: string[];
  refactorSuggestions?: string[];

  //judge fields
  verdict?: string;
  commitDiscipline?: string;
  commitsReveal?: string;
  redFlags?: string[];
  biggestOffenses?: string[];
  finalRuling?: string;
  
  // Roast fields
  brutalCritique?: string[];
  savageAnalogies?: string[];
  roastClosing?: string;
  
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
  <div className="p-8 bg-zinc-900/30 border border-zinc-800 rounded-lg">
    <p className="text-zinc-200 text-lg font-light leading-relaxed">
      "{text}"
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
        <h2 className="text-4xl  font-bold text-center uppercase  text-white tracking-wider ">
          {action}
        </h2>
      </motion.div>

      {/* ANALYZE VIEW */}
      {action === "analyze" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Skill Level & Core Identity */}
          <div className="mb-16 space-y-6">
            <div>
              {data.developerType && (
                <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                  Current Level
                </h4>
              )}
              {data.skillLevel && <SkillLevelBadge level={data.skillLevel} />}
            </div>
            
            {data.coreIdentity && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                  Core Identity
                </h4>
                <p className="text-lg text-white font-medium">
                  {data.coreIdentity}
                </p>
              </div>
            )}
          </div>

            

          {/* Strengths & Weaknesses Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {data.strengths && data.strengths.length > 0 && (
              <InfoSection 
                title="Strengths" 
                items={data.strengths}
                icon={Shield}
                variant="positive"
              />
            )}
            {data.weaknesses && data.weaknesses.length > 0 && (
              <InfoSection 
                title="Weaknesses" 
                items={data.weaknesses}
                icon={AlertCircle}
                variant="negative"
              />
            )}
          </div>

          <h4 className="text-xl font-semibold uppercase tracking-widest text-zinc-300 mb-3">
                Current Reality
              </h4>
          {/* Current Reality */}
          {data.currentReality && (
            <div className="p-8 mt-1 bg-zinc-900/30 border border-zinc-800 rounded-lg">
              <p className="text-zinc-300 text-md font-light leading-relaxed">
                {data.currentReality}
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

      {/* JUDGE VIEW */}
      {action === "judge" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-16"
        >
          {/* Verdict Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-zinc-800 pb-8">
            <div className="space-y-2">
              <h3 className="text-3xl text-white font-light tracking-tight flex items-center gap-3">
                <Gavel className="w-6 h-6 text-zinc-500" />
                Engineering Verdict
              </h3>
              <p className="text-zinc-500 text-sm font-mono">
                Based on commit discipline & consistency
              </p>
            </div>
            
            {data.verdict && (
              <div className={`px-5 py-2 rounded-full border text-sm font-bold uppercase tracking-widest ${
                data.verdict.toLowerCase().includes("positive") 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : data.verdict.toLowerCase().includes("negative")
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                {data.verdict}
              </div>
            )}
          </div>

          {/* Analysis Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {data.commitDiscipline && (
              <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg space-y-3">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ">Commit Discipline</span>
                <p className="text-zinc-300 leading-relaxed mt-4">{data.commitDiscipline}</p>
              </div>
            )}
            {data.commitsReveal && (
              <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg space-y-3">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Code DNA</span>
                <p className="text-zinc-300 leading-relaxed mt-4">{data.commitsReveal}</p>
              </div>
            )}
          </div>

          {/* Actionable Feedback Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {data.redFlags && data.redFlags.length > 0 && (
              <InfoSection 
                title="Red Flags Detected" 
                items={data.redFlags}
                icon={AlertCircle}
                variant="negative"
              />
            )}
            {data.biggestOffenses && data.biggestOffenses.length > 0 && (
              <InfoSection 
                title="" 
                items={data.biggestOffenses}
                variant="negative"
              />
            )}
          </div>

          {/* Final Verdict Quote */}
          {data.finalRuling && (
            <div className="pt-8">
              <QuoteBlock text={data.finalRuling} />
            </div>
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
          {/* Brutal Critique */}
          {data.brutalCritique && data.brutalCritique.length > 0 && (
            <div className="space-y-6">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-red-400/70 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Brutal Critique
              </h4>
              <div className="grid gap-4">
                {data.brutalCritique.map((critique: string, i: number) => (
                  <TruthCard key={i} text={critique} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Savage Analogies */}
          {data.savageAnalogies && data.savageAnalogies.length > 0 && (
            <InfoSection 
              title="Analogies" 
              items={data.savageAnalogies}
              icon={Zap}
              variant="negative"
            />
          )}

          {/* Final Burn */}
          {data.roastClosing && (
            <div className="pt-8">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-8">
                Final Burn
              </h4>
              <QuoteBlock text={data.roastClosing} />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
