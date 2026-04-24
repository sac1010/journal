"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type StickyNote, type StickyCategory } from "@/lib/supabase";

type CategoryConfig = {
  key: StickyCategory;
  label: string;
  bg: string;
  border: string;
  text: string;
  header: string;
};

const CATEGORIES: CategoryConfig[] = [
  { key: "objective",  label: "Core Objectives",  bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-900",   header: "text-amber-600"   },
  { key: "short-term", label: "Short-Term Goals",  bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-900", header: "text-emerald-600" },
  { key: "long-term",  label: "Long-Term Goals",   bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-900",     header: "text-sky-600"     },
  { key: "reminder",   label: "Reminders",          bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-900",    header: "text-rose-600"    },
];

type EditState = { id?: string; category: StickyCategory; content: string };

export default function StickyNotes({ userId }: { userId: string }) {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("sticky_notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (data) setNotes(data);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    if (!editing?.content.trim()) return;
    setSaving(true);
    try {
      if (editing.id) {
        await supabase
          .from("sticky_notes")
          .update({ content: editing.content.trim(), updated_at: new Date().toISOString() })
          .eq("id", editing.id);
      } else {
        await supabase.from("sticky_notes").insert({
          user_id: userId,
          category: editing.category,
          content: editing.content.trim(),
        });
      }
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("sticky_notes").delete().eq("id", id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Pinboard</p>

      {CATEGORIES.map((cat) => {
        const catNotes = notes.filter((n) => n.category === cat.key);
        const isAddingHere = editing != null && editing.id == null && editing.category === cat.key;

        return (
          <div key={cat.key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${cat.header} uppercase tracking-wide`}>
                {cat.label}
              </span>
              {!isAddingHere && (
                <button
                  onClick={() => setEditing({ category: cat.key, content: "" })}
                  className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  + add
                </button>
              )}
            </div>

            {catNotes.map((note) =>
              editing?.id === note.id ? (
                <NoteEditor
                  key={note.id}
                  cat={cat}
                  value={editing.content}
                  onChange={(v) => setEditing((prev) => prev ? { ...prev, content: v } : null)}
                  onSave={handleSave}
                  onCancel={() => setEditing(null)}
                  saving={saving}
                />
              ) : (
                <NoteCard
                  key={note.id}
                  note={note}
                  cat={cat}
                  onEdit={() => setEditing({ id: note.id, category: note.category, content: note.content })}
                  onDelete={() => handleDelete(note.id)}
                />
              )
            )}

            {isAddingHere && (
              <NoteEditor
                cat={cat}
                value={editing!.content}
                onChange={(v) => setEditing((prev) => prev ? { ...prev, content: v } : null)}
                onSave={handleSave}
                onCancel={() => setEditing(null)}
                saving={saving}
              />
            )}

            {catNotes.length === 0 && !isAddingHere && (
              <button
                onClick={() => setEditing({ category: cat.key, content: "" })}
                className={`border border-dashed ${cat.border} rounded-xl p-3 text-xs ${cat.header} opacity-40 hover:opacity-70 transition-opacity text-left`}
              >
                Nothing yet — tap to add
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function NoteCard({
  note, cat, onEdit, onDelete,
}: {
  note: StickyNote;
  cat: CategoryConfig;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onEdit}
      className={`${cat.bg} border ${cat.border} rounded-xl p-3 group relative cursor-pointer hover:brightness-95 transition-all`}
    >
      <p className={`text-sm ${cat.text} leading-relaxed pr-5 whitespace-pre-wrap`}>{note.content}</p>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-2 right-2.5 text-stone-300 hover:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity text-base leading-none"
        aria-label="Delete note"
      >
        ×
      </button>
    </div>
  );
}

function NoteEditor({
  cat, value, onChange, onSave, onCancel, saving,
}: {
  cat: CategoryConfig;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className={`${cat.bg} border ${cat.border} rounded-xl p-3`}>
      <textarea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSave();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Write a note…"
        rows={3}
        className={`w-full bg-transparent text-sm ${cat.text} resize-none outline-none placeholder:opacity-40 leading-relaxed`}
      />
      <div className="flex items-center justify-end gap-2 mt-2">
        <button
          onClick={onCancel}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving || !value.trim()}
          className="text-xs bg-stone-800 hover:bg-stone-900 text-white px-3 py-1 rounded-lg transition-colors disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
