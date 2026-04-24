"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Entry } from "@/lib/supabase";
import Calendar from "@/components/Calendar";
import TodayPrompt from "@/components/TodayPrompt";
import EntryEditor from "@/components/EntryEditor";
import EntryViewer from "@/components/EntryViewer";

type View =
  | { type: "dashboard" }
  | { type: "editor"; date: string; existing?: Entry }
  | { type: "viewer"; entry: Entry };

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [view, setView] = useState<View>({ type: "dashboard" });
  const [userId, setUserId] = useState<string | null>(null);

  const loadEntries = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", uid)
      .order("date", { ascending: false });
    if (data) setEntries(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      setUserId(session.user.id);
      loadEntries(session.user.id);
    });
  }, [router, loadEntries]);

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
      await supabase
        .from("entries")
        .insert({ user_id: userId, date, content });
    }

    await loadEntries(userId);
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

  const today = todayStr();
  const todayEntry = entries.find((e) => e.date === today);
  const entryDates = entries.map((e) => e.date);

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
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-12 px-4 pb-12">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-serif text-2xl text-stone-800">My Journal</h1>
          <button
            onClick={handleSignOut}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            Sign out
          </button>
        </div>

        {!todayEntry && (
          <TodayPrompt onWrite={() => setView({ type: "editor", date: today })} />
        )}

        {todayEntry && (
          <button
            onClick={() => setView({ type: "viewer", entry: todayEntry })}
            className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-left hover:bg-amber-100 transition-colors"
          >
            <p className="text-xs text-amber-600 font-medium mb-0.5 uppercase tracking-wide">Today</p>
            <p className="font-serif text-stone-700 text-sm line-clamp-2">{todayEntry.content}</p>
          </button>
        )}

        <Calendar entryDates={entryDates} onDayClick={handleDayClick} />
      </div>
    </div>
  );
}
