"use client";

import { useState } from "react";

type Props = {
  entryDates: string[];
  onDayClick: (date: string) => void;
};

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toLocalDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function Calendar({ entryDates, onDayClick }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const entrySet = new Set(entryDates);

  const firstDay = new Date(viewYear, viewMonth, 1);
  // Monday-based: getDay() returns 0=Sun, convert to Mon-based index
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="text-stone-400 hover:text-stone-700 px-1 transition-colors"
        >
          ‹
        </button>
        <span className="font-serif text-stone-700 font-medium">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="text-stone-400 hover:text-stone-700 px-1 transition-colors"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-stone-400 font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === toLocalDateString(today);
          const hasEntry = entrySet.has(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick(dateStr)}
              className={`
                relative flex flex-col items-center justify-center rounded-lg py-1.5 text-sm transition-colors
                ${isToday ? "bg-amber-50 text-amber-700 font-semibold" : "hover:bg-stone-50 text-stone-700"}
              `}
            >
              {day}
              {hasEntry && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
