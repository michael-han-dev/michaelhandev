import { getRecentArticles } from '@/data/articles';

export const dynamic = 'force-static';

export function GET() {
  const writing = getRecentArticles(4)
    .map((article) =>
      `- [${article.title}](/blog-content/${article.slug}.md): ${article.excerpt} (${article.date})`
    )
    .join('\n');

  const markdown = `# Michael Han

> Software engineer, occasional chilli chef, lifelong baseball guy.

Currently spending my time exploring the mountains, backend development, content creation, and prediction markets. Also looking for swe roles for June 2027. I study Mathematics and Computer Engineering at [Queen's University](https://www.queensu.ca/). Expected to graduate in 2027.

I previously was the #10 ranked player globally in [Brawl Stars](https://supercell.com/en/games/brawlstars/), top 200 in [Clash Royale](https://supercell.com/en/games/clashroyale/) (in beta), played Baseball at the national level in Canada, and did mathematical modelling for a pharmacokinetics researcher. Find me at me[at]michaelyhan[dot]com.

## As of late

- Working on the engineering team at [Rootly (YC S21)](https://rootly.com/).
- Worked on the engineering team at [Questrade](https://www.questrade.com/).
- Climbed Kilimanjaro and hiked Everest Base Camp.

## Writing

${writing}
- [All writing](/writing): Recent writing and an archive of older articles.

## Site

- [Home](/): Human-readable portfolio.
- [Projects](/ai/projects): Projects in the machine view.
- [Experience](/ai/experience): Experience in the machine view.
- [Writing](/ai/writing): Writing and archive in the machine view.
- [Resume](https://drive.google.com/file/d/1ZFW5fRLvqyCL8EXznTIbUMOWPd9z4VF1/view?usp=sharing)

## Profiles

- [LinkedIn](https://www.linkedin.com/in/michael-y-han/)
- [GitHub](https://github.com/michael-han-dev)
- [X](https://x.com/michaelyhan_)
- [Source](https://github.com/michael-han-dev/michaelhandev)
`;

  return new Response(markdown, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
