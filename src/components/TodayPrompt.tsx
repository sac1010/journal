type Props = {
  onWrite: () => void;
};

const PROMPTS = [
  "What's on your mind today?",
  "How are you feeling right now?",
  "What made today different?",
  "What are you grateful for today?",
  "What do you want to remember about today?",
];

export default function TodayPrompt({ onWrite }: Props) {
  const prompt = PROMPTS[new Date().getDate() % PROMPTS.length];

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-amber-600 font-medium mb-0.5 uppercase tracking-wide">Today</p>
        <p className="font-serif text-stone-700 text-base">{prompt}</p>
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
