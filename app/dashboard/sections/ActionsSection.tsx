"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Search,
  Lightbulb,
  ArrowLeft,
  Gavel,
  ArrowRightLeft,
  BarChart,
  Flame,
  Zap,
} from "lucide-react";

const actions = [
  {
    key: "analyze",
    label: "Analyze",
    icon: <Search className="w-5 h-5" />,
    color: "from-blue-500/10 to-transparent",
    border: "hover:border-blue-500/50",
    text: "text-blue-400",
    desc: "Full profile audit and metadata extraction.",
  },
  {
    key: "judge",
    label: "Judge",
    icon: <Gavel className="w-5 h-5" />,
    color: "from-orange-500/10 to-transparent",
    border: "hover:border-orange-500/50",
    text: "text-orange-400",
    desc: "Strict judgement based on your recent commit activities.",
  },
  {
    key: "improve",
    label: "Improve",
    icon: <BarChart className="w-5 h-5" />,
    color: "from-emerald-500/10 to-transparent",
    border: "hover:border-emerald-500/50",
    text: "text-emerald-400",
    desc: "Automated repo refactoring and optimization tips.",
  },
  {
    key: "roast",
    label: "Roast",
    icon: <Flame className="w-5 h-5" />,
    color: "from-red-500/10 to-transparent",
    border: "hover:border-red-500/50",
    text: "text-red-400",
    desc: "A honest critique of your profile and stats.",
  },
];

interface ActionsSectionProps {
  onRunAction: (key: string) => void;
  onSwitchUser: () => void;
}

export default function ActionsSection({
  onRunAction,
  onSwitchUser,
}: ActionsSectionProps) {
  const [quota, setQuota] = useState<{ remaining: number; limit: number; resetIn: number } | null>(null);

  useEffect(() => {
    fetch("/api/ai/rate-status?tag=ai-action")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setQuota(json);
      })
      .catch(() => {/* silently fail */});
  }, []);

  const isExhausted = quota !== null && quota.remaining === 0;

  return (
    <div className="space-y-12 pt-2">
      <div className="cursor-default flex flex-col items-center text-center space-y-4">
        <p className="text-zinc-400 text-base max-w-md font-medium leading-relaxed">
          Select an operation below !
        </p>

        {/* ── Daily Quota Card ── */}
        {quota !== null && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-full border text-xs font-bold backdrop-blur-sm transition-colors ${
              isExhausted
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : quota.remaining <= 1
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-emerald-500/20 bg-emerald-500/8 text-emerald-400"
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isExhausted ? "text-red-400" : quota.remaining <= 1 ? "text-amber-400" : "text-emerald-400"}`} />
            {isExhausted ? (
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
                <span className="text-zinc-500 font-normal"> / {quota.limit}</span>
                <span className="text-zinc-500 font-normal ml-1">left</span>
              </span>
            )}
          </motion.div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {actions.map((a, i) => (
          <motion.button
            key={a.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={isExhausted ? {} : { scale: 1.02, x: 4 }}
            whileTap={isExhausted ? {} : { scale: 0.98 }}
            onClick={() => !isExhausted && onRunAction(a.key)}
            disabled={isExhausted}
            className={`group relative p-5 rounded-xl border border-white/5 bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 text-left flex items-center gap-6 hover:shadow-2xl hover:shadow-black/50 ${
              isExhausted
                ? "opacity-40 cursor-not-allowed"
                : `cursor-pointer ${a.border}`
            }`}
          >
            <div
              className={`absolute inset-0 bg-linear-to-r ${a.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}
            />
            <div
              className={`${a.text} relative z-10 p-3 bg-black/50 rounded-lg border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300`}
            >
              {a.icon}
            </div>
            <div className="relative z-10 flex-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                {a.label}
                <ArrowLeft className="w-3 h-3 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all rotate-180 text-white/50" />
              </h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                {a.desc}
              </p>
            </div>
          </motion.button>
        ))}

        <motion.button
          onClick={onSwitchUser}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="cursor-pointer mt-8 mx-auto group flex items-center gap-3 px-5 py-2 rounded-full text-zinc-600 hover:text-zinc-300 transition-all duration-300"
        >
          <ArrowRightLeft className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
            SWITCH USER
          </span>
        </motion.button>
      </div>
    </div>
  );
}