"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Server, Activity, Bug, Clock, ShieldAlert, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TroubleshootingPage() {
  const router = useRouter();

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-400 font-sans selection:bg-emerald-500/30 relative overflow-hidden flex flex-col">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-[700px] h-[700px] bg-emerald-500/[0.15] rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-5%] right-[5%] w-[600px] h-[600px] bg-emerald-500/[0.12] rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#030303]/80 backdrop-blur-2xl px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="DEV DNA" width={20} height={20} className="h-5 w-5" />
            <span className="font-bold text-white text-sm tracking-[0.25em] uppercase">Dev DNA</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-32 space-y-12 grow">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Quick help</h1>
        </motion.div>

        <div className="space-y-4">
          <QACard
            iconColor="text-emerald-400"
            bg="bg-emerald-500/10 border-emerald-500/20"
            title="Why is it taking so long to load?"
            description="DevDNA uses Groq as its primary AI engine which is decently fast. But if too many users are analyzing profiles at once, we temporarily hit Groq's rate limits. When this happens, our system automatically falls back to secondary AI engine which is slower than Groq. It provides the exact same high-quality analysis, but it is not that reliable and can take minutes to process. Have to bear it for now :)"
          />

          <QACard
            
            iconColor="text-blue-400"
            bg="bg-blue-500/10 border-blue-500/20"
            title="How much can a user request?"
            description="To keep DevDNA free and fast for everyone, the main AI model allows around 5 requests per minute globally. The app is using github PAT which has around 5000 requests per hour for all the users combined. Therefore it has rate limits on the stats section too of around 10 requests per minute per ip address.  "
          />

          <QACard
            iconColor="text-red-400"
            bg="bg-red-500/10 border-red-500/20"
            title="Why isn't my profile loading at all?"
            description="There can be two reasons for this: The username you entered is incorrect or you are currently rate limited."
          />
          <QACard
            iconColor="text-red-400"
            bg="bg-red-500/10 border-red-500/20"
            title="The stats are different from my github profile."
            description="DevDNA deals with public data only. If you have private repositories, they will not be counted in the stats."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl border border-white/[0.04] bg-zinc-900/40 text-center space-y-6 mt-12 backdrop-blur-xl"
        >
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Need more help?</h2>
          </div>
          <a
            href="https://www.linkedin.com/in/ritik-yadav-06a8aa361/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-lg hover:bg-zinc-200 transition-all duration-300"
          >
            Connect on LinkedIn
          </a>
        </motion.div>
      </main>
    </div>
  );
}

function QACard({ title, description, iconColor, bg }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl border border-white/[0.04] bg-zinc-900/40 hover:bg-zinc-800/60 transition-colors backdrop-blur-lg"
    >
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="space-y-2 mt-1 sm:mt-0">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
