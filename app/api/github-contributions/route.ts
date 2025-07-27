import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'yourusername';

const query = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN environment variable is not set');
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const contributionData = data.data.user.contributionsCollection.contributionCalendar;
    
    return NextResponse.json({
      totalContributions: contributionData.totalContributions,
      weeks: contributionData.weeks.map((week: any) => ({
        days: week.contributionDays.map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          level: day.contributionLevel as 0 | 1 | 2 | 3 | 4,
        })),
      })),
    });
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub contributions' },
      { status: 500 }
    );
  }
}