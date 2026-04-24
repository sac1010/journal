"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Entry } from "@/lib/supabase";
import Calendar from "@/components/Calendar";
import TodayPrompt from "@/components/TodayPrompt";
import EntryEditor from "@/components/EntryEditor";
import EntryViewer from "@/components/EntryViewer";
import StickyNotes from "@/components/StickyNotes";

type View =
  | { type: "dashboard" }
  | { type: "editor"; date: string; existing?: Entry }
  | { type: "viewer"; entry: Entry };

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sevenDaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [todayEntry, setTodayEntry] = useState<Entry | null | undefined>(undefined);
  const [view, setView] = useState<View>({ type: "dashboard" });
  const [userId, setUserId] = useState<string | null>(null);

  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [askQuestion, setAskQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [askLoading, setAskLoading] = useState(false);

  // Tracks which month the calendar is showing so reloads stay in sync
  const currentMonthRef = useRef({ year: new Date().getFullYear(), month: new Date().getMonth() });

  const loadMonthEntries = useCallback(async (uid: string, year: number, month: number) => {
    const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const to = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", uid)
      .gte("date", from)
      .lte("date", to)
      .order("date", { ascending: false });
    if (data) setEntries(data);
  }, []);

  const loadTodayEntry = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", uid)
      .eq("date", todayStr())
      .maybeSingle();
    setTodayEntry(data ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUserId(session.user.id);
      const now = new Date();
      loadMonthEntries(session.user.id, now.getFullYear(), now.getMonth());
      loadTodayEntry(session.user.id);
    });
  }, [router, loadMonthEntries, loadTodayEntry]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function saveEntry(date: string, content: string, existingId?: string) {
    if (!userId) return;
    if (existingId) {
      await supabase
        .from("entries")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", existingId);
    } else {
      await supabase.from("entries").insert({ user_id: userId, date, content });
    }
    const { year, month } = currentMonthRef.current;
    await Promise.all([loadMonthEntries(userId, year, month), loadTodayEntry(userId)]);
  }

  async function handleDeleteEntry(id: string) {
    if (!userId) return;
    await supabase.from("entries").delete().eq("id", id);
    const { year, month } = currentMonthRef.current;
    await Promise.all([loadMonthEntries(userId, year, month), loadTodayEntry(userId)]);
    setView({ type: "dashboard" });
  }

  function handleDayClick(date: string) {
    const existing = entries.find((e) => e.date === date);
    if (existing) {
      setView({ type: "viewer", entry: existing });
    } else {
      setView({ type: "editor", date });
    }
  }

  function handleMonthChange(year: number, month: number) {
    currentMonthRef.current = { year, month };
    if (userId) loadMonthEntries(userId, year, month);
  }

  async function handleWeeklySummary() {
    if (!userId) return;
    setSummary(null);
    setSummaryLoading(true);
    try {
      const { data: weekEntries } = await supabase
        .from("entries")
        .select("date, content")
        .eq("user_id", userId)
        .gte("date", sevenDaysAgo())
        .order("date", { ascending: false });
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: weekEntries || [] }),
      });
      const data = await res.json();
      setSummary(data.summary || "Couldn't generate a summary right now.");
    } catch {
      setSummary("Couldn't generate a summary right now.");
    } finally {
      setSummaryLoading(false);
    }
  }

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!askQuestion.trim() || !userId) return;
    setAskAnswer(null);
    setAskLoading(true);
    try {
      const { data: allEntries } = await supabase
        .from("entries")
        .select("date, content")
        .eq("user_id", userId)
        .order("date", { ascending: false });
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: askQuestion.trim(), entries: allEntries || [] }),
      });
      const data = await res.json();
      setAskAnswer(data.answer || "Couldn't find an answer right now.");
    } catch {
      setAskAnswer("Couldn't find an answer right now.");
    } finally {
      setAskLoading(false);
    }
  }

  const today = todayStr();
  const entryDates = entries.map((e) => e.date);
  const recentEntries = entries.slice(0, 5).map((e) => ({ date: e.date, content: e.content }));

  if (view.type === "editor") {
    return (
      <div className="min-h-screen flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-xl">
          <EntryEditor
            date={view.date}
            initialContent={view.existing?.content}
            onSave={(content) => saveEntry(view.date, content, view.existing?.id)}
            onCancel={() => setView({ type: "dashboard" })}
          />
        </div>
      </div>
    );
  }

  if (view.type === "viewer") {
    return (
      <div className="min-h-screen flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-xl">
          <EntryViewer
            date={view.entry.date}
            content={view.entry.content}
            onEdit={() => setView({ type: "editor", date: view.entry.date, existing: view.entry })}
            onBack={() => setView({ type: "dashboard" })}
            onDelete={() => handleDeleteEntry(view.entry.id)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-12 px-4 pb-16">
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-serif text-2xl text-stone-800">My Journal</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleWeeklySummary}
              disabled={summaryLoading}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors disabled:opacity-50"
            >
              {summaryLoading ? "Summarising…" : "Week in review"}
            </button>
            <button
              onClick={handleSignOut}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Weekly summary panel */}
        {summary && (
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 relative">
            <button
              onClick={() => setSummary(null)}
              className="absolute top-3 right-3 text-stone-300 hover:text-stone-500 text-lg leading-none"
            >
              ×
            </button>
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">
              Week in review
            </p>
            <p className="font-serif text-stone-700 text-sm leading-relaxed whitespace-pre-line">
              {summary}
            </p>
          </div>
        )}

        {/* Today prompt or today's entry */}
        {todayEntry === undefined ? null : todayEntry === null ? (
          <TodayPrompt
            onWrite={() => setView({ type: "editor", date: today })}
            recentEntries={recentEntries}
          />
        ) : (
          <button
            onClick={() => setView({ type: "viewer", entry: todayEntry })}
            className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-left hover:bg-amber-100 transition-colors"
          >
            <p className="text-xs text-amber-600 font-medium mb-0.5 uppercase tracking-wide">Today</p>
            <p className="font-serif text-stone-700 text-sm line-clamp-2">{todayEntry.content}</p>
          </button>
        )}

        <Calendar
          entryDates={entryDates}
          onDayClick={handleDayClick}
          onMonthChange={handleMonthChange}
        />

        {/* Pinboard */}
        {userId && <StickyNotes userId={userId} />}

        {/* Ask your journal */}
        <div className="mt-2">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">
            Ask your journal
          </p>
          <form onSubmit={handleAsk} className="flex gap-2">
            <input
              type="text"
              value={askQuestion}
              onChange={(e) => setAskQuestion(e.target.value)}
              placeholder="What was I anxious about last month?"
              className="flex-1 text-sm bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 placeholder:text-stone-300 transition-colors"
            />
            <button
              type="submit"
              disabled={askLoading || !askQuestion.trim()}
              className="shrink-0 bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-40"
            >
              {askLoading ? "…" : "Ask"}
            </button>
          </form>

          {askAnswer && (
            <div className="mt-3 bg-white border border-stone-100 rounded-xl p-4 relative">
              <button
                onClick={() => { setAskAnswer(null); setAskQuestion(""); }}
                className="absolute top-2 right-3 text-stone-300 hover:text-stone-500 text-lg leading-none"
              >
                ×
              </button>
              <p className="font-serif text-stone-700 text-sm leading-relaxed pr-4">{askAnswer}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
