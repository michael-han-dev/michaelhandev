'use client';

import { useEffect, useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4 | 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

interface ContributionWeek {
  days: ContributionDay[];
}

const getContributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

const getLevelColor = (level: 0 | 1 | 2 | 3 | 4): string => {
  const colors = {
    0: '#0d1117',
    1: '#0e4429',
    2: '#006d32', 
    3: '#26a641',
    4: '#39d353'
  };
  return colors[level];
};


const getMonthLabels = (weeks: ContributionWeek[]): { month: string; position: number }[] => {
  const labels: { month: string; position: number }[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  weeks.forEach((week, weekIndex) => {
    const firstDay = week.days[0];
    if (firstDay) {
      const date = new Date(firstDay.date);
      const day = date.getDate();
      
      if (day <= 7) {
        labels.push({
          month: months[date.getMonth()],
          position: weekIndex
        });
      }
    }
  });
  
  return labels;
};

export default function GitHubChart() {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await fetch('/api/github-contributions');
        if (response.ok) {
          const data = await response.json();
          setWeeks(data.weeks);
          setTotalContributions(data.totalContributions);
        } else {
          console.error('GitHub API failed');
        }
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      }
    };

    fetchGitHubData();
  }, []);

  const monthLabels = getMonthLabels(weeks);

  return (
    <div className="w-full bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-base font-medium mb-4 text-white">Recent GitHub Activity</h3>
      
      <div className="w-full">
        <div className="relative w-full">
          {/* Month labels */}
          <div className="flex mb-3 justify-between px-1">
            {monthLabels.slice(0, 12).map((label, index) => (
              <div
                key={index}
                className="text-xs text-slate-400 flex-1 text-center"
              >
                {label.month}
              </div>
            ))}
          </div>
          
          {/* Contribution grid - full width */}
          <div className="w-full flex justify-center">
            <div className="flex gap-[1px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[1px]">
                  {week.days.map((day, dayIndex) => {
                    const color = getLevelColor(day.level);
                    return (
                      <div
                        key={dayIndex}
                        className="w-[11px] h-[11px] rounded-[2px] cursor-pointer hover:ring-1 hover:ring-white/50 transition-all"
                        style={{ backgroundColor: color }}
                        title={`${day.count} contributions (level ${day.level}) on ${new Date(day.date).toLocaleDateString()}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-slate-400">
          {totalContributions} contributions in the last year
        </span>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-[11px] h-[11px] rounded-[2px]"
                style={{ backgroundColor: getLevelColor(level as 0 | 1 | 2 | 3 | 4) }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">More</span>
        </div>
      </div>
    </div>
  );
}