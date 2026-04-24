"use client";

import { useEffect, useState } from "react";

type Props = {
  onWrite: () => void;
  recentEntries?: { date: string; content: string }[];
};

const FALLBACK_PROMPTS = [
  "What's on your mind today?",
  "How are you feeling right now?",
  "What made today different?",
  "What are you grateful for today?",
  "What do you want to remember about today?",
];

export default function TodayPrompt({ onWrite, recentEntries = [] }: Props) {
  const [prompt, setPrompt] = useState(
    FALLBACK_PROMPTS[new Date().getDate() % FALLBACK_PROMPTS.length]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrompt() {
      try {
        const res = await fetch("/api/prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recentEntries }),
        });
        const data = await res.json();
        if (data.prompt) setPrompt(data.prompt);
      } catch {
        // keep fallback
      } finally {
        setLoading(false);
      }
    }
    fetchPrompt();
  }, []);

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-amber-600 font-medium mb-0.5 uppercase tracking-wide">Today</p>
        <p className={`font-serif text-stone-700 text-base ${loading ? "animate-pulse text-stone-400" : ""}`}>
          {prompt}
        </p>
      </div>
      <button
        onClick={onWrite}
        className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        Write →
      </button>
    </div>
  );
}
