"use client";

import { motion } from "framer-motion";
import { Star, GitFork, BookOpen, Users } from "lucide-react";

interface StatsRowProps {
  stars: number;
  forks: number;
  repos: number;
  followers: number;
}

const stats = (data: StatsRowProps) => [
  {
    label: "Stars",
    value: data.stars,
    icon: <Star className="w-3.5 h-3.5" />,
    color: "text-white/80",
    glow: "group-hover:shadow-yellow-500/20",
    border: "group-hover:border-yellow-500/20",
  },
  {
    label: "Forks",
    value: data.forks,
    icon: <GitFork className="w-3.5 h-3.5" />,
    color: "text-white/80",
    glow: "group-hover:shadow-blue-500/20",
    border: "group-hover:border-blue-500/20",
  },
  {
    label: "Repos",
    value: data.repos,
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "text-white/80",
    glow: "group-hover:shadow-emerald-500/20",
    border: "group-hover:border-emerald-500/20",
  },
  {
    label: "Followers",
    value: data.followers,
    icon: <Users className="w-3.5 h-3.5" />,
    color: "text-white/80",
    glow: "group-hover:shadow-purple-500/20",
    border: "group-hover:border-purple-500/20",
  },
];

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function StatsRow(props: StatsRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-4 gap-3"
    >
      {stats(props).map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.06 }}
          className={`group relative flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border border-white/5 bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 hover:shadow-lg ${s.glow} ${s.border}`}
        >
          <span className={`${s.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
            {s.icon}
          </span>
          <span className={`text-lg font-bold font-mono ${s.color}`}>
            {formatNum(s.value)}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">
            {s.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}