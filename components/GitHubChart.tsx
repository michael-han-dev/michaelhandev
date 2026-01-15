'use client';

import GitHubCalendar, { Activity } from 'react-github-calendar';

export default function GitHubChart() {
  return (
    <div className="w-full bg-card-light rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-base font-medium mb-4 text-white">Recent GitHub Activity</h3>
      <div className="w-full">
        <style jsx>{`
          .github-calendar-container :global(.react-activity-calendar) {
            width: 100% !important;
            color: #cbd5e1 !important;
          }
          .github-calendar-container :global(.react-activity-calendar svg) {
            width: 100% !important;
            height: auto !important;
          }
          .github-calendar-container :global(.react-activity-calendar text) {
            fill: #94a3b8 !important;
          }
        `}</style>
        <div className="github-calendar-container">
          <GitHubCalendar 
            username="michael-han-dev"
            theme={{
              dark: [
                '#191919',
                '#3a3a3a',
                '#5a5a5a',
                '#7a7a7a',
                '#9a9a9a',
              ]
            }}
            colorScheme="dark"
            fontSize={10}
            blockSize={10}
            transformData={(data) => selectLastNMonths(data, 12)}
            blockMargin={2}
            hideColorLegend={false}
            hideMonthLabels={false}
            hideTotalCount={false}
            showWeekdayLabels={false}
          />
        </div>
      </div>
    </div>
  );
}
const selectLastNMonths = (contributions: Activity[], n: number) => {
  const now = new Date();
  const cutoffDate = new Date(now);
  cutoffDate.setMonth(now.getMonth() - n);

  return contributions.filter((activity) => {
    const activityDate = new Date(activity.date);
    return activityDate >= cutoffDate && activityDate <= now;
  });
};