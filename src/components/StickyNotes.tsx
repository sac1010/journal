"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type StickyNote } from "@/lib/supabase";

type EditState = { id?: string; title: string; content: string };

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
    if (!editing?.title.trim() && !editing?.content.trim()) return;
    setSaving(true);
    try {
      if (editing.id) {
        await supabase
          .from("sticky_notes")
          .update({
            title: editing.title.trim(),
            content: editing.content.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", editing.id);
      } else {
        await supabase.from("sticky_notes").insert({
          user_id: userId,
          title: editing.title.trim(),
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
      <div className="flex items-center justify-between">
        <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Pinboard</p>
        {!editing && (
          <button
            onClick={() => setEditing({ title: "", content: "" })}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            + add note
          </button>
        )}
      </div>

      {notes.map((note) =>
        editing?.id === note.id ? (
          <NoteEditor
            key={note.id}
            value={editing}
            onChange={(v) => setEditing((prev) => prev ? { ...prev, ...v } : null)}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        ) : (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={() => setEditing({ id: note.id, title: note.title, content: note.content })}
            onDelete={() => handleDelete(note.id)}
          />
        )
      )}

      {editing && !editing.id && (
        <NoteEditor
          value={editing}
          onChange={(v) => setEditing((prev) => prev ? { ...prev, ...v } : null)}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      {notes.length === 0 && !editing && (
        <button
          onClick={() => setEditing({ title: "", content: "" })}
          className="border border-dashed border-amber-200 rounded-xl p-4 text-xs text-amber-500 opacity-50 hover:opacity-75 transition-opacity text-left"
        >
          Nothing pinned yet — tap to add a note
        </button>
      )}
    </div>
  );
}

function NoteCard({
  note, onEdit, onDelete,
}: {
  note: StickyNote;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onEdit}
      className="bg-amber-50 border border-amber-100 rounded-xl p-4 group relative cursor-pointer hover:bg-amber-100 transition-colors"
    >
      {note.title && (
        <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide pr-5">
          {note.title}
        </p>
      )}
      {note.content && (
        <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap pr-5">
          {note.content}
        </p>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-3 right-3 text-stone-300 hover:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity text-base leading-none"
        aria-label="Delete note"
      >
        ×
      </button>
    </div>
  );
}

function NoteEditor({
  value, onChange, onSave, onCancel, saving,
}: {
  value: EditState;
  onChange: (v: Partial<EditState>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col gap-2">
      <input
        autoFocus
        type="text"
        value={value.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Title (optional)"
        className="w-full bg-transparent text-xs font-semibold text-amber-700 uppercase tracking-wide outline-none placeholder:text-amber-300 placeholder:normal-case placeholder:tracking-normal"
      />
      <textarea
        value={value.content}
        onChange={(e) => onChange({ content: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSave();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Write a note…"
        rows={3}
        className="w-full bg-transparent text-sm text-stone-700 resize-none outline-none placeholder:text-stone-300 leading-relaxed"
      />
      <div className="flex items-center justify-end gap-2">
        <button onClick={onCancel} className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving || (!value.title.trim() && !value.content.trim())}
          className="text-xs bg-stone-800 hover:bg-stone-900 text-white px-3 py-1 rounded-lg transition-colors disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
