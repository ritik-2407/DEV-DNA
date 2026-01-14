import React from 'react';
import { Star, Users,Book,  Calendar, Github } from 'lucide-react';

export default function UserProfile({ data }: { data: any }) {
  // Increase to 24 weeks for a denser, more "pro" look
  const recentWeeks = data.contributions.weeks.slice(-41); 

  return (
    <div className="cursor-default w-full rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden group">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-700" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Left Side: Identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={data.avatar} 
              alt={data.name} 
              className="w-16 h-16 rounded-full border border-white/30 p-0.5 object-cover"
            />
            
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-none mb-1">{data.name}</h2>
            <p className="text-emerald-500/80 tracking-wide text-[11px]  ">@{data.username}</p>
          </div>
        </div>

        {/* Right Side: Quick Stats */}
        <div className="flex gap-10 md:gap-14 items-center">
            <BigStat label="Commits" value={data.contributions.total} />
            <BigStat label="Repos" value={data.repoCount} />
            <BigStat label="Stars" value={data.stars} />
          </div>
      </div>

      {/* Heatmap Section - Tightened Grid */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Activity</span>
          
        </div>

        {/* The Grid */}
        <div className="flex gap-0.75 overflow-hidden">
          {recentWeeks.map((week: any, i: number) => (
            <div key={i} className="flex flex-col gap-0.75 shrink-0">
              {week.map((day: any) => {
                // Logic for Emerald color depth based on commit count
                let cellColor = "bg-zinc-800/50"; // Default
                if (day.count > 0 && day.count < 3) cellColor = "bg-emerald-900/60";
                if (day.count >= 3 && day.count < 6) cellColor = "bg-emerald-700/90";
                if (day.count >= 6) cellColor = "bg-emerald-500";

                return (
                  <div
                    key={day.date}
                    className={`w-2.5 h-2.5 sm:w-2.75 sm:h-2.75 rounded-[1.5px] transition-all duration-300 hover:scale-125 hover:z-10 cursor-default ${cellColor}`}
                    title={`${day.count} contributions on ${day.date}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">
        {label}
      </span>
      <span className="text-2xl font-roboto font-black text-white/70 tabular-nums leading-none">
        {value || 0}
      </span>
    </div>
  );
}