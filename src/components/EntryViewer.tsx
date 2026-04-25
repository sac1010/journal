"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme";

type Props = {
  date: string;
  content: string;
  onEdit: () => void;
  onBack: () => void;
  onDelete: () => void;
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

export default function EntryViewer({ date, content, onEdit, onBack, onDelete }: Props) {
  const { t } = useTheme();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-stone-400 hover:text-stone-600 text-sm transition-colors">
          ← Back
        </button>
        <button onClick={onEdit} className={`${t.text600} ${t.hoverText700} text-sm font-medium transition-colors`}>
          Edit
        </button>
      </div>

      <p className="font-serif text-stone-500 text-sm">{formatDisplayDate(date)}</p>

      {content.trimStart().startsWith("<") ? (
        <div
          className="font-serif text-stone-800 text-base leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_p]:min-h-[1.5em]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="font-serif text-stone-800 text-base leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      )}

      <div className="border-t border-stone-100 pt-3">
        {confirming ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500">Delete this entry?</span>
            <button
              onClick={onDelete}
              className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs text-stone-400 hover:text-rose-500 transition-colors"
          >
            Delete entry
          </button>
        )}
      </div>
    </div>
  );
}
