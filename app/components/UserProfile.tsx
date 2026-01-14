import React from 'react';

export default function UserProfile({ data }: { data: any }) {
  // Clone and reverse so the end of the year (today) is at the start of the array
  const recentWeeks = [...data.contributions.weeks].slice(-41).reverse(); 

  return (
    <div className="cursor-default w-full rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-700" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <img 
            src={data.avatar} 
            alt={data.name} 
            className="w-16 h-16 rounded-full border border-white/20 p-0.5 object-cover"
          />
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-none mb-1">{data.name}</h2>
            <p className="text-emerald-500  text-[12px] tracking-wide">@{data.username}</p>
          </div>
        </div>

        <div className="flex gap-8 md:gap-12 items-center">
          <BigStat label="Commits" value={data.contributions.total} />
          <BigStat label="Repos" value={data.repoCount} />
          <BigStat label="Stars" value={data.stars} />
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Activity</span>
        
        {/* flex-row-reverse anchors the most recent days to the right side */}
        <div className="flex flex-row-reverse gap-1 overflow-hidden justify-start">
          {recentWeeks.map((week: any, i: number) => (
            <div key={i} className="flex flex-col gap-1 shrink-0">
              {week.map((day: any) => {
                let cellColor = "bg-zinc-800/50";
                if (day.count > 0 && day.count < 3) cellColor = "bg-emerald-900/60";
                if (day.count >= 3 && day.count < 6) cellColor = "bg-emerald-700/90";
                if (day.count >= 6) cellColor = "bg-emerald-500";

                return (
                  <div
                    key={day.date}
                    className={`w-2.75 h-2.75 rounded-[1.5px] transition-all duration-300 hover:scale-125 hover:z-10 ${cellColor}`}
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
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">
        {label}
      </span>
      <span className="text-xl  font-black text-emerald-500/90 tabular-nums leading-none">
        {value || 0}
      </span>
    </div>
  );
}