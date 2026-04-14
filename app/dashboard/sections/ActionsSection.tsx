"use client";

import { motion } from "framer-motion";
import {
  Search,
  Lightbulb,
  ArrowLeft,
  Gavel,
  ArrowRightLeft,
  BarChart,
  Flame
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
  return (
    <div className="space-y-12 pt-2">
      <div className="cursor-default flex flex-col items-center text-center space-y-4">
        <p className="text-zinc-400 text-base max-w-md font-medium leading-relaxed">
          Select an operation below !
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {actions.map((a, i) => (
          <motion.button
            key={a.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRunAction(a.key)}
            className={`cursor-pointer group relative p-5 rounded-xl border border-white/5 bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 text-left flex items-center gap-6 ${a.border} hover:shadow-2xl hover:shadow-black/50`}
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