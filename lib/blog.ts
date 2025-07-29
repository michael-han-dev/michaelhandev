import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true,
  sanitize: false
});

export async function getBlogContent(slug: string): Promise<string> {
  try {
    const url = `/blog-content/${slug}.md`;
    console.log('Fetching from:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Blog post not found: ${response.status} ${response.statusText}`);
    }
    
    const markdown = await response.text();
    console.log('Markdown content length:', markdown.length);
    
    const html = marked(markdown);
    return html;
  } catch (error) {
    console.error('Error loading blog content:', error);
    return `<p>Content not available: ${error instanceof Error ? error.message : 'Unknown error'}</p>`;
  }
}