'use client';

import { useEffect, useState } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
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
    0: '#161b22',
    1: '#0e4429',
    2: '#006d32',
    3: '#26a641',
    4: '#39d353'
  };
  return colors[level];
};

const generateMockData = (): ContributionWeek[] => {
  const weeks: ContributionWeek[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364); // ~52 weeks ago
  
  // Start from the Sunday of the week containing startDate
  const startDay = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDay);
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= today) {
    const week: ContributionDay[] = [];
    
    for (let i = 0; i < 7; i++) {
      if (currentDate <= today) {
        const count = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 15);
        week.push({
          date: currentDate.toISOString().split('T')[0],
          count,
          level: getContributionLevel(count)
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (week.length > 0) {
      weeks.push({ days: week });
    }
  }
  
  return weeks;
};

const getMonthLabels = (weeks: ContributionWeek[]): { month: string; position: number }[] => {
  const labels: { month: string; position: number }[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  weeks.forEach((week, weekIndex) => {
    const firstDay = week.days[0];
    if (firstDay) {
      const date = new Date(firstDay.date);
      const day = date.getDate();
      
      // Show month label if it's the first week of the month (day <= 7)
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
          // Fall back to mock data if API fails
          const mockWeeks = generateMockData();
          setWeeks(mockWeeks);
          const total = mockWeeks.reduce((sum, week) => 
            sum + week.days.reduce((daySum, day) => daySum + day.count, 0), 0
          );
          setTotalContributions(total);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
        // Fall back to mock data
        const mockWeeks = generateMockData();
        setWeeks(mockWeeks);
        const total = mockWeeks.reduce((sum, week) => 
          sum + week.days.reduce((daySum, day) => daySum + day.count, 0), 0
        );
        setTotalContributions(total);
      }
    };

    fetchGitHubData();
  }, []);

  const monthLabels = getMonthLabels(weeks);

  return (
    <div className="w-full bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-base font-medium mb-4 text-white">Recent GitHub Activity</h3>
      
      <div className="overflow-x-auto">
        <div className="relative min-w-[800px]">
          {/* Month labels */}
          <div className="flex mb-2 ml-10">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className="text-xs text-slate-400 absolute"
                style={{ left: `${label.position * 11}px` }}
              >
                {label.month}
              </div>
            ))}
          </div>
          
          {/* Chart container */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col justify-between text-xs text-slate-400 pr-2 w-8" style={{ height: '77px' }}>
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>
            
            {/* Contribution grid */}
            <div className="flex gap-[1px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[1px]">
                  {week.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="w-[10px] h-[10px] rounded-[1px] cursor-pointer hover:ring-1 hover:ring-white/50 transition-all"
                      style={{ backgroundColor: getLevelColor(day.level) }}
                      title={`${day.count} contributions on ${new Date(day.date).toLocaleDateString()}`}
                    />
                  ))}
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
                className="w-[10px] h-[10px] rounded-[1px]"
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