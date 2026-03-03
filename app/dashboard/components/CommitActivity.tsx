"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CommitActivityProps {
  weeklyCommits: number[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-zinc-400">{label}</p>
        <p className="text-emerald-400 font-bold font-mono">
          {payload[0].value} commits
        </p>
      </div>
    );
  }
  return null;
};

export default function CommitActivity({ weeklyCommits }: CommitActivityProps) {
  if (!weeklyCommits || weeklyCommits.length === 0) return null;

  const last12 = weeklyCommits.slice(-12).map((count, i) => ({
    week: `Week ${i + 1}`,
    commits: count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-xl border border-white/5 bg-zinc-900/60 backdrop-blur-xl p-5"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-7">
        Last 12 Weeks
      </p>

      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={last12} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id="commitGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
            </linearGradient>
          </defs>

          <XAxis dataKey="week" hide />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#ffffff10" }} />
          <Line
            type="monotone"
            dataKey="commits"
            stroke="url(#commitGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}