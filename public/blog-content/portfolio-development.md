# Building This Portfolio: A Technical Deep Dive

Creating a personal portfolio is both an exciting and challenging endeavor. In this post, I'll walk you through the technical decisions, design choices, and development process behind this website.

## Tech Stack Overview

This portfolio is built using modern web technologies:

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Deployment**: Vercel

## Design Philosophy

### Minimalist Approach
I wanted the portfolio to be clean and focused on content rather than flashy animations. The dark theme provides a professional look while being easy on the eyes.

### Mobile-First Design
Every component was designed with mobile devices in mind first, then enhanced for larger screens:

```css
/* Mobile-first responsive design */
.container {
  @apply px-4 py-8;
}

@media (min-width: 768px) {
  .container {
    @apply px-8 py-12;
  }
}
```

## Key Features

### GitHub Contributions Chart
One of the most interesting features is the real-time GitHub contributions display:

```tsx
import GitHubCalendar from 'react-github-calendar';

export default function GitHubChart() {
  return (
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
    />
  );
}
```

### Smooth Animations
Using Framer Motion for subtle yet engaging animations:

```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

<motion.div variants={fadeInUp}>
  Content here
</motion.div>
```

## Development Challenges

### Performance Optimization
Ensuring fast load times was crucial. I implemented several optimizations:

1. **Image Optimization**: Using Next.js `Image` component
2. **Code Splitting**: Automatic with Next.js
3. **Font Loading**: Optimized Google Fonts loading

### Responsive GitHub Chart
Making the GitHub calendar responsive required some creative CSS:

```tsx
const selectLastNMonths = (contributions, n) => {
  const now = new Date();
  const cutoffDate = new Date(now);
  cutoffDate.setMonth(now.getMonth() - n);

  return contributions.filter((activity) => {
    const activityDate = new Date(activity.date);
    return activityDate >= cutoffDate && activityDate <= now;
  });
};
```

## Blog System Architecture

The blog system uses a hybrid approach:

```typescript
// Dynamic route for blog posts
export default function BlogPost({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState<string>('');
  
  useEffect(() => {
    getBlogContent(params.slug).then(setContent);
  }, [params.slug]);

  return (
    <article dangerouslySetInnerHTML={{ __html: content }} />
  );
}
```

### Markdown Processing
Articles are written in Markdown and processed server-side:

```typescript
import { marked } from 'marked';

export async function getBlogContent(slug: string): Promise<string> {
  const response = await fetch(`/blog-content/${slug}.md`);
  const markdown = await response.text();
  
  const html = marked(markdown);
  return html;
}
```

## Deployment and CI/CD

The portfolio is deployed on Vercel with automatic deployments from the main branch:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev"
  }
}
```

## Future Enhancements

Several features are planned for future iterations:

- [ ] Dark/Light theme toggle
- [ ] Blog search functionality
- [ ] Comments system for blog posts
- [ ] Portfolio analytics dashboard
- [ ] Enhanced SEO optimization
