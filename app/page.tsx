"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import {
  Github,
  Terminal,
  Zap,
  Search,
  MessageSquareWarning,
  Lightbulb,
  ArrowRight,
  Activity,
  Globe,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-emerald-500/30 antialiased overflow-x-hidden">
      {/* Structural Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-size-[32px_32px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-3 border-b border-zinc-900 bg-zinc-950 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Image src="/icon.png" alt="app-icon" width={16} height={16} className="h-6 w-6"/>

          <div className="flex flex-col">
            <span className="font-bold text-white text-xl tracking-widest uppercase">
              Dev DNA
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-zinc-100 text-black hover:bg-emerald-400 transition-all rounded-sm"
          >
            <Github className="w-3.5 h-3.5" />
            Login
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-24">
        {/* Hero Area: More Filled & Balanced */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LLM Engine Active
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
              Decode your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-emerald-200 to-zinc-500">
                Developer Identity.
              </span>
            </h1>

            <p className="max-w-xl text-lg text-zinc-500 font-light leading-relaxed">
              We bridge the gap between commit history and career trajectory.
              Get instant, LLM-powered audits on your code quality,
              architecture, and professional reputation.
            </p>

            <div className="flex flex-wrap gap-4 pt-4 font-mono">
              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className=" rounded-md px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-[0_10px_30px_rgba(5,150,105,0.2)]"
              >
                START ANALYSIS
              </button>
              <div className="flex items-center gap-4 px-6 border border-zinc-800 text-[10px] text-zinc-600 uppercase tracking-widest rounded-md">
                <Activity className="w-3 h-3" /> 1,240 Profiles Scanned
              </div>
            </div>
          </div>

          {/* Fill the "Empty Space" on the right with a dense visual */}
          <div className="hidden lg:block">
            <div className="p-8 border border-zinc-800 bg-zinc-950/50 rounded-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-emerald-500/20">
                LOG_v01.12
              </div>
              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">ANALYSIS_TYPE</span>
                  <span className="text-emerald-500">DEEP_SCAN</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <p className="text-zinc-600">
                    Checking: react-hooks-architecture...
                  </p>
                  <p className="text-zinc-600">Scanning: complexity_index...</p>
                  <p className="text-yellow-500/80 tracking-tighter">
                    ! Warning: Circular dependency in /lib/auth
                  </p>
                  <p className="text-red-500/80">
                    ! Critical: Hardcoded API Key in .env.example
                  </p>
                </div>
                <div className="pt-4 flex gap-2">
                  <div className="h-1 flex-1 bg-emerald-500/20 overflow-hidden">
                    <div className="h-full bg-emerald-500 w-2/3 animate-pulse" />
                  </div>
                </div>
                <p className="text-white uppercase font-bold text-[10px]">
                  Processing DNA Sequence...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dense Feature Section */}
        <section className="mt-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900">
            <FeatureBox
              icon={<Search className="w-5 h-5 " />}
              label=""
              title="ANALYZE"
              desc="Deep-layer scanning of your repository patterns to classify your developer persona."
            />
            <FeatureBox
              icon={<Lightbulb className="w-5 h-5" />}
              label=""
              title="SUGGESTION"
              desc="AI-driven suggestions for specific skills and projects to level up your market value."
            />
            <FeatureBox
              icon={<Zap className="w-5 h-5" />}
              label=""
              title="IMPROVE"
              desc="Targeted improvements for repository structure and modern best-practice implementation."
            />
            <FeatureBox
              icon={<MessageSquareWarning className="w-5 h-5" />}
              label=""
              title="ROAST"
              desc="Brutal feedback on your 'temp' fixes, spaghetti logic, and inconsistent commit messages."
            />
          </div>
        </section>

        {/* Security / Trust Bar */}
        <div className="mt-12 flex flex-wrap justify-between items-center px-8 py-6 border border-zinc-900 bg-zinc-950/20 gap-8">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-zinc-700" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              Privacy First: We never store your code source.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] text-zinc-500">API_CONNECTED</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <span className="text-[10px]">v1.0.4-STABLE</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureBox({
  icon,
  label,
  title,
  desc,
}: {
  icon: any;
  label: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-[#050505] p-8 space-y-4 hover:bg-zinc-950 transition-all group">
      <div className="text-emerald-500 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
          {label}
        </span>
        <h3 className="text-white text-lg font-bold tracking-tight mt-1">
          {title}
        </h3>
      </div>
      <p className="text-zinc-500 text-xs leading-relaxed font-light">{desc}</p>
    </div>
  );
}
