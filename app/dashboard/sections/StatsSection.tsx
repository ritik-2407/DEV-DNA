"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UserProfile from "../../components/UserProfile";
import TopLanguages from "../components/TopLanguages";
import StatsRow from "../components/StatsRow";
import CommitActivity from "../components/CommitActivity";

export default function StatsSection({ username }: { username: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/github/profile?username=${encodeURIComponent(username)}`);
        if (res.ok) setData(await res.json());
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const weeklyCommits: number[] =
    data?.contributions?.weeks?.map((week: any[]) =>
      week.reduce((sum, day) => sum + day.count, 0)
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