"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import UserProfile from "../../components/UserProfile";
import TopLanguages from "../components/TopLanguages";
import StatsRow from "../components/StatsRow";
import CommitActivity from "../components/CommitActivity";

export default function StatsSection({ username }: { username: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          `/api/github/profile?username=${encodeURIComponent(username)}`,
        );
        if (res.ok) {
          setData(await res.json());
        } else {
          const json = await res.json();
          setError(json.error || `Error ${res.status}`);
        }
      } catch (err: any) {
        console.error("Failed to fetch stats", err);
        setError("Failed to load profile stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [username]);

  const weeklyCommits: number[] =
    data?.contributions?.weeks?.map((week: any[]) =>
      week.reduce((sum, day) => sum + day.count, 0),
    ) ?? [];

  if (loading) {
    return (
      <div className="space-y-4 pt-2">
        <div className="w-full h-48 rounded-xl bg-zinc-900/50 animate-pulse border border-white/5" />
        <div className="w-full h-16 rounded-xl bg-zinc-900/50 animate-pulse border border-white/5" />
        <div className="w-full h-32 rounded-xl bg-zinc-900/50 animate-pulse border border-white/5" />
        <div className="w-full h-32 rounded-xl bg-zinc-900/50 animate-pulse border border-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-8 p-8 text-base text-red-400 bg-red-400/5 rounded-lg border border-red-400/20 flex flex-col items-center justify-center text-center gap-4"
      >
        <AlertCircle className="w-8 h-8 opacity-80" />
        <div>
          <div className="font-bold text-lg mb-1">Could not load stats</div>
          <div className="text-red-400/70">{error}</div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      {/* Profile Card */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <UserProfile data={data} />
        </motion.div>
      )}

      {/* Stars / Forks / Repos / Followers */}
      <StatsRow
        stars={data?.stars ?? 0}
        forks={data?.forks ?? 0}
        repos={data?.repoCount ?? 0}
        followers={data?.followers ?? 0}
      />

      {/* Top Languages */}
      <TopLanguages languages={data?.languages ?? {}} />

      {/* Commit Activity */}
      <CommitActivity weeklyCommits={weeklyCommits} />
    </div>
  );
}
