import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getAllSlugs, blogPosts } from "@/lib/blog";
import { BASE_URL } from "@/lib/config";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: `${BASE_URL}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function renderContent(content: string) {
  const paragraphs = content.trim().split(/\n\n+/);

  return paragraphs.map((block, i) => {
    if (block.startsWith("**") && block.endsWith("**") && !block.includes("\n")) {
      return (
        <h3
          key={i}
          className="text-xl font-semibold text-stone-900 mt-10 mb-3"
        >
          {block.replace(/\*\*/g, "")}
        </h3>
      );
    }

    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-stone-600 leading-relaxed mb-5 text-lg">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="text-stone-800 font-semibold">
              {part.replace(/\*\*/g, "")}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.date,
    publisher: {
      "@type": "Organization",
      name: "Journal",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
  };

  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#faf9f7] text-stone-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-stone-900"
        >
          Journal
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/login"
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto px-6 pt-12 pb-20">
        <Link
          href="/blog"
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-8 inline-block"
        >
          ← All posts
        </Link>

        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
            {post.category}
          </span>
          <span className="text-stone-200">·</span>
          <span className="text-xs text-stone-400">{post.readTime}</span>
        </div>

        <h1 className="text-4xl font-semibold text-stone-900 leading-tight mb-5">
          {post.title}
        </h1>

        <p className="text-stone-500 text-lg leading-relaxed mb-8 border-b border-stone-100 pb-8">
          {post.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-stone-400 mb-12">
          <span className="font-medium text-stone-600">{post.author}</span>
          <span>·</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <div className="prose-custom">{renderContent(post.content)}</div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-amber-50 border border-amber-100 text-center">
          <h2 className="text-xl font-semibold text-stone-900 mb-2">
            Ready to start your own journal?
          </h2>
          <p className="text-stone-500 text-sm mb-5">
            Free, private, and takes less than a minute to set up.
          </p>
          <Link
            href="/register"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Create your free journal
          </Link>
        </div>
      </article>

      {/* More posts */}
      {otherPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="text-xl font-semibold text-stone-900 mb-6">
            More from the blog
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {otherPosts.map((p) => (
              <Link
                href={`/blog/${p.slug}`}
                key={p.slug}
                className="group block p-6 rounded-2xl border border-stone-100 hover:border-stone-200 bg-white hover:shadow-sm transition-all"
              >
                <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                  {p.category}
                </span>
                <h3 className="font-semibold text-stone-900 mt-2 mb-2 leading-snug text-sm group-hover:text-amber-700 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-stone-400">{p.readTime}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-stone-100 py-14 text-center px-6">
        <div className="max-w-sm mx-auto">
          <p className="text-lg font-serif text-stone-700 mb-1">
            Enjoying Journal?
          </p>
          <p className="text-sm text-stone-400 mb-6 leading-relaxed">
            It&apos;s free and built with care. If it&apos;s brought you some clarity, a
            coffee helps keep it running.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://buymeacoffee.com/yourname"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#FFDD00] hover:bg-yellow-300 text-stone-900 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              ☕ Buy me a coffee
            </a>
            <a
              href="https://ko-fi.com/yourname"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium px-5 py-2.5 rounded-xl border border-stone-200 transition-colors"
            >
              Ko-fi
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <span>© {new Date().getFullYear()} Journal. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-stone-600 transition-colors">
              Home
            </Link>
            <Link href="/blog" className="hover:text-stone-600 transition-colors">
              Blog
            </Link>
            <Link href="/register" className="hover:text-stone-600 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
