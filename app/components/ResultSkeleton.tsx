"use client";

import { motion } from "framer-motion";

/**
 * Skeleton loading UI that mimics the shape of the actual result layout.
 * Shows pulsing placeholder blocks where real content will appear.
 *
 * This tells the user:
 * 1. Something IS loading (not broken)
 * 2. What the result will roughly LOOK like (sets expectations)
 */

const Pulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-zinc-800/50 rounded ${className}`} />
);

export default function ResultSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-12 py-8"
    >
      {/* Top loading indicator — visible at top on mobile/desktop */}
      <div className="flex items-center justify-center gap-3 pb-4">
        <div className="relative">
          <div className="w-8 h-8 border border-zinc-800 rounded-full" />
          <div className="absolute inset-0 w-8 h-8 border border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[10px] text-emerald-500/60 uppercase tracking-[0.3em] font-bold">
          Analyzing...
        </p>
      </div>
      {/* Header skeleton — matches the action title */}
      <div className="flex flex-col items-center space-y-4">
        <Pulse className="h-8 w-48 rounded-lg" />
      </div>

      {/* Badge skeleton — matches SkillLevelBadge */}
      <div className="space-y-3">
        <Pulse className="h-3 w-24" />
        <Pulse className="h-8 w-36 rounded-full" />
      </div>

      {/* Two-column grid skeleton — matches the strengths/weaknesses grid */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left column */}
        <div className="space-y-5 border-l-2 border-zinc-800/50 pl-6">
          <Pulse className="h-3 w-32" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <Pulse className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" />
                <Pulse className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5 border-l-2 border-zinc-800/50 pl-6">
          <Pulse className="h-3 w-28" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <Pulse className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" />
                <Pulse className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote block skeleton — matches the summary/potential section */}
      <div className="space-y-4 pt-8 border-t border-zinc-800/30">
        <Pulse className="h-3 w-24" />
        <div className="p-8 rounded-lg border border-zinc-800/30 space-y-3">
          <Pulse className="h-4 w-full" />
          <Pulse className="h-4 w-4/5" />
          <Pulse className="h-4 w-3/5" />
        </div>
      </div>

    </motion.div>
  );
}
