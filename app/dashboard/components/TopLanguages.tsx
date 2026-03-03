"use client";

import { motion } from "framer-motion";


const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript:  "#1f6fe0",
JavaScript:  "#c0ad20",
Python:      "#2f78a8",
Rust:        "#b85c28",
Go:          "#1aa0a0",
CSS:         "#6a35b8",
HTML:        "#c0432a",
Java:        "#b86f18",
"C++":       "#b83070",
C:           "#6a6a6a",
Ruby:        "#a81f2f",
Swift:       "#c88718",
Kotlin:      "#5630c8",
Dart:        "#1f8f8a",
Shell:       "#4f8f1f",
Vue:         "#1f8f55",
Svelte:      "#b83220",
PHP:         "#2f3fb0",
};

interface TopLanguagesProps {
  languages: Record<string, number>;
}

export default function TopLanguages({ languages }: TopLanguagesProps) {
  if (!languages || Object.keys(languages).length === 0) return null;

  const sorted = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const total = sorted.reduce((sum, [, v]) => sum + v, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-white/5 bg-zinc-900/60 backdrop-blur-xl p-5"
    >
      

      <div className="space-y-4">
        {sorted.map(([lang, bytes], i) => {
          const pct = Math.round((bytes / total) * 100);
          const color = LANGUAGE_COLORS[lang] ?? "#4a6a5a";

          return (
            <div key={lang}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  
                  <span className="text-xs text-zinc-200 font-medium">{lang}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-600">{pct}%</span>
              </div>

              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full opacity-60"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%`}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}