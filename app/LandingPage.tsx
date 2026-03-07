"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  Github,
  Search,
  Lightbulb,
  Gavel,
  Flame,
  BarChart,
  ArrowRight,
  Lock,
  Zap,
  Terminal,
  Activity,
  ChevronRight,
  Globe,
  Shield,
} from "lucide-react";

// ─── Animations ────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const stagger: Variants = {
  show: { transition: { staggerChildren: 0.08 } },
};

// ─── Landing Page ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleGo() {
    const trimmed = username.trim();
    if (trimmed) {
      router.push(`/dashboard?username=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-400 font-sans selection:bg-emerald-500/30 antialiased overflow-x-hidden cursor-default">
      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Main emerald glow — top left */}
        <div className="absolute top-[5%] left-[5%] w-[700px] h-[700px] bg-emerald-500/[0.15] rounded-full blur-[150px] mix-blend-screen" />
        {/* Secondary glow — bottom right */}
        <div className="absolute bottom-[-5%] right-[5%] w-[600px] h-[600px] bg-emerald-500/[0.12] rounded-full blur-[150px] mix-blend-screen" />
        {/* Subtle center fill */}
        <div className="absolute top-[50%] left-[40%] w-[400px] h-[400px] bg-emerald-500/[0.05] rounded-full blur-[120px] mix-blend-screen" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
        {/* Noise/grain texture for depth */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#030303]/80 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="DEV DNA"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <span className="font-bold text-white text-sm tracking-[0.25em] uppercase">
              Dev DNA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGo()}
              placeholder="GitHub username"
              className="px-3 py-1.5 text-xs font-mono bg-zinc-900 border border-white/10 rounded-md text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 w-36 transition-colors"
            />
            <button
              onClick={handleGo}
              className="cursor-pointer flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-white text-black hover:bg-emerald-400 transition-all duration-300 rounded-md"
            >
              Go
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ── Hero ── */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-6xl mx-auto px-6 pt-24 pb-32 lg:pt-32 lg:pb-40"
        >
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
            <div className="space-y-8">
              

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-[-0.03em] leading-[1.05]"
              >
                Know what your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-600">
                  GitHub says
                </span>
                <br />
                about you.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="max-w-lg text-base sm:text-lg text-zinc-500 font-light leading-relaxed"
              >
                Your repos, commits, and activity tell a story. We read it the
                way a senior engineer would — and tell you what they&apos;d
                actually think.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGo()}
                      placeholder="Enter GitHub username"
                      className="px-5 py-4 text-sm font-mono bg-zinc-900/80 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 w-64 transition-all duration-300 focus:shadow-[0_0_20px_rgba(5,150,105,0.15)]"
                    />
                  </div>
                  <button
                    onClick={handleGo}
                    className="cursor-pointer group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-[0_8px_32px_rgba(5,150,105,0.25)] hover:shadow-[0_12px_40px_rgba(5,150,105,0.35)]"
                  >
                    <span className="flex items-center gap-2">
                      Analyze
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/*Simulated Terminal */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Glow behind the terminal */}
                <div className="absolute -inset-4 bg-emerald-500/[0.04] rounded-2xl blur-xl" />

                <div className="relative border border-white/[0.06] bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                  {/* Title bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono ml-2">
                      dev-dna — analysis
                    </span>
                  </div>

                  {/* Terminal content */}
                  <div className="p-5 font-mono text-[11px] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">→</span>
                      <span className="text-zinc-500">
                        Scanning repositories...
                      </span>
                      <span className="text-emerald-500">✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">→</span>
                      <span className="text-zinc-500">
                        Analyzing commit patterns...
                      </span>
                      <span className="text-emerald-500">✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500">→</span>
                      <span className="text-zinc-500">
                        Evaluating code signals...
                      </span>
                      <span className="text-emerald-500">✓</span>
                    </div>

                    <div className="pt-3 border-t border-white/[0.04] space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-600">SKILL_LEVEL</span>
                        <span className="text-emerald-400">intermediate</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">DEVELOPER_TYPE</span>
                        <span className="text-white">
                          full-stack generalist
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">CONSISTENCY</span>
                        <span className="text-amber-400">needs work ⚠</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">SIGNAL_STRENGTH</span>
                        <span className="text-emerald-400">strong</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-700">$</span>
                        <span className="text-zinc-400">
                          verdict:
                        </span>
                        <span className="text-emerald-400/80">
                          &quot;You build fast but leave a trail of TODOs.&quot;
                        </span>
                      </div>
                    </div>

                    {/* Cursor blink */}
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-700">$</span>
                      <span className="w-2 h-4 bg-emerald-500/70 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Actions Showcase ── */}
        <section className="relative border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="space-y-16"
            >
              <motion.div
                variants={fadeUp}
                custom={0}
                className="text-center space-y-4"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Five ways to decode your profile
                </h2>
                <p className="text-zinc-500 text-base max-w-lg mx-auto font-light">
                  Each action analyzes your GitHub from a different angle.
                  Every result is structured, grounded, and actionable.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  {
                    icon: Search,
                    label: "Analyze",
                    desc: "Full profile evaluation — skill level, strengths, blind spots",
                    iconBox: "bg-emerald-500/10 border-emerald-500/20",
                    iconColor: "text-emerald-400",
                  },
                  {
                    icon: Gavel,
                    label: "Judge",
                    desc: "Commit history verdict — discipline, intent, quality",
                    iconBox: "bg-orange-500/10 border-orange-500/20",
                    iconColor: "text-orange-400",
                  },
                  {
                    icon: BarChart,
                    label: "Improve",
                    desc: "Missing practices and structural weaknesses",
                    iconBox: "bg-blue-500/10 border-blue-500/20",
                    iconColor: "text-blue-400",
                  },
                  {
                    icon: Lightbulb,
                    label: "Suggest",
                    desc: "High-leverage skills and project ideas to pursue",
                    iconBox: "bg-yellow-500/10 border-yellow-500/20",
                    iconColor: "text-yellow-400",
                  },
                  {
                    icon: Flame,
                    label: "Roast",
                    desc: "Brutally honest reality check with analogies that sting",
                    iconBox: "bg-red-500/10 border-red-500/20",
                    iconColor: "text-red-400",
                  },
                ].map((action, i) => (
                  <motion.div
                    key={action.label}
                    variants={fadeUp}
                    custom={i + 1}
                    className="group relative p-6 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-500 cursor-default"
                  >
                    <div className="space-y-4">
                      <div
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${action.iconBox}`}
                      >
                        <action.icon
                          className={`w-4.5 h-4.5 ${action.iconColor}`}
                        />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-2">
                          {action.label}
                        </h3>
                        <p className="text-zinc-500 text-xs leading-relaxed font-light">
                          {action.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="relative border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="space-y-16"
            >
              <motion.div
                variants={fadeUp}
                custom={0}
                className="text-center space-y-4"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  How it works
                </h2>
                <p className="text-zinc-500 text-base max-w-lg mx-auto font-light">
                  Three steps. No data stored. Live GitHub data every time.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    step: "01",
                    title: "Enter Username",
                    desc: "Just type any GitHub username. No sign-in, no OAuth, no permissions. We only read public data.",
                    icon: Terminal,
                  },
                  {
                    step: "02",
                    title: "Pick an Action",
                    desc: "Choose analyze, judge, improve, suggest, or roast. Each one hits different signals in your profile.",
                    icon: Zap,
                  },
                  {
                    step: "03",
                    title: "Get Your Verdict",
                    desc: "Our LLM processes your data and returns structured, honest feedback. Cached for speed, fresh on demand.",
                    icon: Activity,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    variants={fadeUp}
                    custom={i + 1}
                    className="relative p-8 rounded-xl border border-white/[0.04] bg-white/[0.01]"
                  >
                    <span className="absolute top-6 right-6 text-[40px] font-bold text-white/[0.03] font-mono leading-none">
                      {item.step}
                    </span>
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <item.icon className="w-4.5 h-4.5 text-emerald-400" />
                      </div>
                      <h3 className="text-white text-lg font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="relative border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="relative p-12 sm:p-16 rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.04] to-transparent overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.06] rounded-full blur-[100px]" />

              <div className="relative space-y-6 max-w-xl">
                <motion.h2
                  variants={fadeUp}
                  custom={0}
                  className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
                >
                  Ready to see what your
                  <br />
                  GitHub actually says?
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  custom={1}
                  className="text-zinc-500 text-base font-light"
                >
                  10 seconds to connect. No signup forms. No credit card. Just
                  your GitHub and honest feedback.
                </motion.p>
                <motion.div variants={fadeUp} custom={2} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGo()}
                    placeholder="GitHub username"
                    className="px-5 py-4 text-sm font-mono bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 w-56 transition-all duration-300"
                  />
                  <button
                    onClick={handleGo}
                    className="cursor-pointer group flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-bold rounded-lg hover:bg-emerald-400 transition-all duration-300"
                  >
                    Analyze
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon.png"
                  alt="DEV DNA"
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5 opacity-50"
                />
                <span className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
                  Dev DNA
                </span>
              </div>
              <span className="text-[10px] text-zinc-800">•</span>
              <span className="text-[10px] text-zinc-600 font-mono">
                v1.0
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                <Lock className="w-3 h-3" />
                <span>No data stored</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                <Shield className="w-3 h-3" />
                <span>Read-only access</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                <Globe className="w-3 h-3" />
                <span>Open source</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}