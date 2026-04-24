type Props = {
  date: string;
  content: string;
  onEdit: () => void;
  onBack: () => void;
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

export default function EntryViewer({ date, content, onEdit, onBack }: Props) {
  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-stone-400 hover:text-stone-600 text-sm transition-colors">
          ← Back
        </button>
        <button onClick={onEdit} className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors">
          Edit
        </button>
      </div>

      <p className="font-serif text-stone-500 text-sm">{formatDisplayDate(date)}</p>

      <p className="font-serif text-stone-800 text-base leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}
