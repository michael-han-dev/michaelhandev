'use client';

import GitHubCalendar from 'react-github-calendar';

export default function GitHubChart() {
  return (
    <div className="w-full bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-base font-medium mb-4 text-white">Recent GitHub Activity</h3>
      <div className="w-full">
        <style jsx>{`
          .github-calendar-container :global(.react-activity-calendar) {
            width: 100% !important;
          }
          .github-calendar-container :global(.react-activity-calendar svg) {
            width: 100% !important;
            height: auto !important;
          }
        `}</style>
        <div className="github-calendar-container">
          <GitHubCalendar 
            username="michael-han-dev"
            theme={{
              dark: [
                '#0d1117',
                '#0e4429',
                '#006d32',
                '#26a641',
                '#39d353',
              ]
            }}
            colorScheme="dark"
            fontSize={10}
            blockSize={10}
            transformData={(data) => selectLastNMonths(data, 11)}
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