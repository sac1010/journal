"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { blogPosts } from "@/lib/blog";

export default function Home() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      } else {
        setChecked(true);
      }
    });
  }, [router]);

  if (!checked) return null;

  const recentPosts = blogPosts.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#faf9f7] text-stone-800">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="text-xl font-semibold tracking-tight text-stone-900">
          Journal
        </span>
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
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

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-24 text-center">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          AI-powered journaling — free forever
        </p>
        <h1 className="text-5xl sm:text-6xl font-semibold text-stone-900 leading-tight mb-6">
          A journal that thinks
          <br />
          <span className="text-amber-500">with you</span>
        </h1>
        <p className="text-xl text-stone-500 leading-relaxed mb-10 max-w-xl mx-auto">
          Write privately. Get personalised prompts, thoughtful AI reflections,
          weekly summaries, and answers from your own past — in a calm,
          distraction-free space.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="bg-amber-500 hover:bg-amber-600 text-white text-base font-medium px-7 py-3 rounded-xl transition-colors"
          >
            Start journaling free
          </Link>
          <Link
            href="#ai-features"
            className="text-stone-600 hover:text-stone-900 text-base font-medium px-7 py-3 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors"
          >
            See AI features
          </Link>
        </div>
        <p className="mt-5 text-sm text-stone-400">
          No credit card required. Your entries are private and encrypted.
        </p>
      </section>

      {/* AI Features */}
      <section id="ai-features" className="bg-stone-900 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-amber-400 uppercase tracking-widest mb-3">
              Powered by Claude AI
            </p>
            <h2 className="text-3xl font-semibold text-white mb-4">
              Journaling, with an AI companion
            </h2>
            <p className="text-stone-400 max-w-lg mx-auto leading-relaxed">
              Four features that help you go deeper — without getting in the way
              of the writing itself.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: "✦",
                title: "Smart daily prompts",
                body: "Each day's writing prompt is shaped by what you've actually been writing about recently — not a random question from a static list. The more you journal, the more relevant your prompts become.",
              },
              {
                icon: "◎",
                title: "Post-entry reflection",
                body: "After you save an entry, AI offers a warm two-to-three sentence reflection on what you wrote, plus one follow-up question to carry into your day. It notices things you might not have.",
              },
              {
                icon: "◈",
                title: "Week in review",
                body: "One click generates a personal summary of the past seven days — the themes that came up, how things shifted across entries, and one encouraging observation. Your week, seen clearly.",
              },
              {
                icon: "◉",
                title: "Ask your journal",
                body: "Type any question about your past and get an honest answer drawn from your own entries. 'When was I last really happy?' 'What stresses me out most?' Your words, your insights.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-7 rounded-2xl bg-stone-800 border border-stone-700"
              >
                <div className="text-amber-400 text-xl mb-4 font-light">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/register"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-7 py-3 rounded-xl transition-colors"
            >
              Try it free
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits of journaling */}
      <section className="bg-white border-y border-stone-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-stone-900 text-center mb-4">
            Why journaling changes everything
          </h2>
          <p className="text-center text-stone-500 mb-14 max-w-xl mx-auto">
            Decades of research confirm what millions of people already know —
            writing about your life makes it better.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "Clears mental clutter",
                body: "Externalising thoughts onto a page frees up cognitive space, reducing the mental load you carry through the day.",
              },
              {
                icon: "😌",
                title: "Reduces anxiety",
                body: "Studies show that expressive writing lowers cortisol levels and helps regulate the emotional response to stress.",
              },
              {
                icon: "🔍",
                title: "Builds self-awareness",
                body: "Reading back your entries reveals patterns in your thinking and behaviour you can't see in the moment.",
              },
              {
                icon: "🎯",
                title: "Sharpens your goals",
                body: "Writing about what you want — in specific, concrete terms — dramatically increases your chances of achieving it.",
              },
              {
                icon: "💤",
                title: "Improves sleep",
                body: "Journaling before bed offloads the day's unresolved thoughts, making it easier to switch off and rest deeply.",
              },
              {
                icon: "📈",
                title: "Tracks your growth",
                body: "A consistent journal becomes an honest record of who you were and how far you've come — irreplaceable over time.",
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-stone-50">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-stone-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-stone-900 text-center mb-4">
          Up and running in three steps
        </h2>
        <p className="text-center text-stone-500 mb-14 max-w-lg mx-auto">
          No complicated setup, no learning curve. The AI features turn on the
          moment you start writing.
        </p>
        <div className="grid sm:grid-cols-3 gap-10">
          {[
            {
              step: "01",
              title: "Create your account",
              body: "Sign up in under a minute. No personal information required beyond your email.",
            },
            {
              step: "02",
              title: "Write your first entry",
              body: "Open the editor and start writing. AI generates a personalised prompt if you need a nudge — and reflects on your entry when you're done.",
            },
            {
              step: "03",
              title: "Let AI surface insights",
              body: "Review your week in one click, ask questions about your past, and watch patterns emerge across months of entries.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="text-4xl font-bold text-amber-200 mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">
                {item.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy & security */}
      <section className="bg-stone-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Private by design — including the AI
          </h2>
          <p className="text-stone-400 mb-12 max-w-lg mx-auto leading-relaxed">
            AI features process your entries on the fly and are never stored,
            trained on, or shared. Your journal stays yours.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "End-to-end security",
                body: "All data is encrypted in transit and at rest. Your entries are stored securely with Supabase's enterprise-grade infrastructure.",
              },
              {
                title: "AI that doesn't retain your data",
                body: "Entries sent to the AI for prompts, reflections, and summaries are processed in-context only. Nothing is stored or used to train models.",
              },
              {
                title: "No advertising, ever",
                body: "We do not sell your data, show ads, or share your writing with anyone. Your thoughts are not a product.",
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-stone-700">
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-semibold text-stone-900">
              From the blog
            </h2>
            <p className="text-stone-500 mt-1">
              Thoughts on journaling, AI, mental clarity, and building better
              habits.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            All posts →
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.slug}
              className="group block p-6 rounded-2xl border border-stone-100 hover:border-stone-200 bg-white hover:shadow-sm transition-all"
            >
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                {post.category}
              </span>
              <h3 className="font-semibold text-stone-900 mt-2 mb-3 leading-snug group-hover:text-amber-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed line-clamp-3">
                {post.description}
              </p>
              <p className="text-xs text-stone-400 mt-4">{post.readTime}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center px-6">
        <h2 className="text-4xl font-semibold text-stone-900 mb-4">
          Start writing today
        </h2>
        <p className="text-stone-500 mb-8 max-w-md mx-auto">
          Five minutes a day. AI-powered insights. A clearer version of you.
        </p>
        <Link
          href="/register"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white text-base font-medium px-8 py-3 rounded-xl transition-colors"
        >
          Create your free journal
        </Link>
      </section>

      {/* Support */}
      <section className="border-t border-stone-100 py-14 text-center px-6">
        <div className="max-w-sm mx-auto">
          <p className="text-lg font-serif text-stone-700 mb-1">
            Enjoying Journal?
          </p>
          <p className="text-sm text-stone-400 mb-6 leading-relaxed">
            It&apos;s free and built with care. If it&apos;s brought you some clarity, a
            coffee helps keep it running.
          </p>
          <div className="flex justify-center">
            <a
              href="https://ko-fi.com/sac101"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#29ABE0] hover:bg-[#1a9fd4] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              ☕ Support on Ko-fi
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <span>© {new Date().getFullYear()} Journal. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-stone-600 transition-colors">
              Blog
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
