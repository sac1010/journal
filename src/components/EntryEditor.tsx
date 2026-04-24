"use client";

import { useState } from "react";

type Props = {
  date: string;
  initialContent?: string;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
};

function formatDisplayDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EntryEditor({ date, initialContent = "", onSave, onCancel }: Props) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!content.trim()) return;
    setSaving(true);
    await onSave(content.trim());
    setSaving(false);
  }

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-serif text-stone-500 text-sm">{formatDisplayDate(date)}</p>
        <button onClick={onCancel} className="text-stone-400 hover:text-stone-600 text-sm transition-colors">
          Cancel
        </button>
      </div>

      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        className="font-serif text-stone-800 text-base leading-relaxed resize-none outline-none min-h-[240px] placeholder:text-stone-300"
      />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save entry"}
        </button>
      </div>
    </div>
  );
}
