import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { BASE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Blog — Journaling Tips, Research & Stories",
  description:
    "Read about the science of journaling, personal stories, morning routines, mental health, and practical tips to build a journaling habit that sticks.",
  openGraph: {
    title: "Blog — Journaling Tips, Research & Stories",
    description:
      "Read about the science of journaling, personal stories, morning routines, mental health, and practical tips to build a journaling habit that sticks.",
    url: `${BASE_URL}/blog`,
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] text-stone-800">
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
            className="text-sm text-stone-800 font-medium"
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

      <section className="max-w-3xl mx-auto px-6 pt-14 pb-10">
        <h1 className="text-4xl font-semibold text-stone-900 mb-3">
          The Journal Blog
        </h1>
        <p className="text-stone-500 text-lg leading-relaxed">
          Stories, science, and practical wisdom about journaling, mental
          clarity, and building a writing practice that lasts.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="flex flex-col gap-6">
          {blogPosts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.slug}
              className="group block p-8 rounded-2xl border border-stone-100 hover:border-stone-200 bg-white hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                  {post.category}
                </span>
                <span className="text-stone-200">·</span>
                <span className="text-xs text-stone-400">{post.readTime}</span>
              </div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2 leading-snug group-hover:text-amber-700 transition-colors">
                {post.title}
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                {post.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>{post.author}</span>
                <span>·</span>
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-stone-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <span>© {new Date().getFullYear()} Journal. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-stone-600 transition-colors">
              Home
            </Link>
            <Link href="/login" className="hover:text-stone-600 transition-colors">
              Sign in
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
