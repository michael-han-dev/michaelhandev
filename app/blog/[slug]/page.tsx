'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { articles } from '@/data/articles';
import Footer from '@/components/Footer';
import Masthead from '@/components/Masthead';
import ViewModeToggle from '@/components/ViewModeToggle';
import { getBlogContent } from '@/lib/blog';
import { getBlogImages, BlogImage } from '@/lib/images';
import { useEffect, useMemo, useState } from 'react';
import BookIntro, { BOOK_INTRO_SLUG, titlesFrom } from '@/components/book/BookIntro';
import ShelfIntro, { SHELF_INTRO_SLUG } from '@/components/shelf/ShelfIntro';
import { entriesFrom } from '@/components/shelf/titles';
import Prism from 'prismjs';
import { formatDateLong } from '@/utils/date';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');
  const [article, setArticle] = useState<any>(null);
  const [images, setImages] = useState<BlogImage[]>([]);
  const routeSlug = useParams<{ slug: string }>()?.slug;
  const [intro, setIntro] = useState<'playing' | 'revealing' | 'off'>(
    routeSlug === BOOK_INTRO_SLUG || routeSlug === SHELF_INTRO_SLUG ? 'playing' : 'off'
  );

  const introTitles = useMemo(
    () => (intro !== 'off' && routeSlug === BOOK_INTRO_SLUG && !loading && content ? titlesFrom(content) : null),
    [intro, routeSlug, loading, content]
  );

  const shelfEntries = useMemo(
    () => (intro !== 'off' && routeSlug === SHELF_INTRO_SLUG && !loading && content ? entriesFrom(content) : null),
    [intro, routeSlug, loading, content]
  );

  useEffect(() => {
    params.then(({ slug }) => {
      setSlug(slug);
      const foundArticle = articles.find(article => article.slug === slug);
      setArticle(foundArticle);
    });
  }, [params]);

  useEffect(() => {
    if (article) {
      getBlogContent(article.slug).then(async (content) => {
        const blogImages = content.includes('{{image:')
          ? await getBlogImages(article.id)
          : [];
        let processedContent = content;
        blogImages.forEach((image) => {
          const placeholder = `{{image:${image.display_order}}}`;
          const imageHtml = `
            <figure>
              <img src="${image.url}" alt="${image.alt_text || ''}" loading="lazy" />
              ${image.alt_text ? `<figcaption>${image.alt_text}</figcaption>` : ''}
            </figure>
          `;
          processedContent = processedContent.replace(placeholder, imageHtml);
        });

        setContent(processedContent);
        setImages(blogImages);
        setLoading(false);
        setTimeout(() => Prism.highlightAll(), 0);
      });
    } else {
      setLoading(false);
    }
  }, [article]);


  if (slug && !article && !loading) {
    notFound();
  }

  return (
    <div className="bg-main min-h-screen">
      <main
        className={`${intro === 'playing' ? '' : 'page-enter '}mx-auto max-w-2xl px-6 pb-32 pt-16 md:pt-20`}
        style={intro === 'playing' ? { opacity: 0 } : intro === 'revealing' ? { animationDuration: '700ms' } : undefined}
      >
        <Masthead />

        <div className="mt-14">
          <Link
            href="/"
            className="meta transition-colors duration-150 hover:text-[var(--ink)]"
          >
            &larr; home
          </Link>

          {article && (
            <header className="mt-8">
              <div className="eyebrow">
                {formatDateLong(article.date)}
                {article.readTime ? ` · ${article.readTime} min read` : ''}
              </div>
              <h1
                className="mt-3 font-medium leading-tight text-[var(--ink)]"
                style={{ fontSize: 'var(--text-title)' }}
              >
                {article.title}
              </h1>
              <p className="mt-4 leading-relaxed text-[var(--ink-2)]">
                {article.excerpt}
              </p>
            </header>
          )}

          <div className="hairline-t mt-10 pt-8">
            {loading ? (
              <div className="meta">Loading...</div>
            ) : (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </div>

        <Footer />
      </main>

      <ViewModeToggle />

      {intro !== 'off' && routeSlug === SHELF_INTRO_SLUG && (
        <ShelfIntro
          entries={shelfEntries}
          onReveal={() => setIntro('revealing')}
          onDone={() => setIntro('off')}
        />
      )}

      {intro !== 'off' && routeSlug === BOOK_INTRO_SLUG && (
        <BookIntro
          titles={introTitles}
          excerpt={article?.excerpt ?? ''}
          ready={!loading && Boolean(content)}
          onReveal={() => setIntro('revealing')}
          onDone={() => setIntro('off')}
        />
      )}
    </div>
  );
}
