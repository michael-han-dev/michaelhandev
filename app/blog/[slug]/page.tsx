import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getBlogPost, getBlogPosts } from '@/lib/blog';

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0f1c' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors duration-200 mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          <span>Back to home</span>
        </Link>

        <article className="bg-slate-800/20 rounded-2xl border border-slate-700/30 overflow-hidden">
          <header className="p-8 border-b border-slate-700/30">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
              <Calendar size={12} />
              <time>{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </header>

          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <MDXRemote source={post.content} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}