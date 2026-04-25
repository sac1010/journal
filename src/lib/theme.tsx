"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = "amber" | "rose" | "emerald" | "sky" | "slate";

export interface Palette {
  bg50: string;
  bg100: string;
  hoverBg100: string;
  border100: string;
  border200: string;
  focusBorder: string;
  text300: string;
  text500: string;
  text600: string;
  hoverText700: string;
  text700: string;
  btnPrimary: string;
  dot: string;
  spinnerBorder: string;
  toolbarActive: string;
  placeholder300: string;
  todayCell: string;
  swatch: string;
  label: string;
}

export const THEMES: Record<ThemeId, Palette> = {
  amber: {
    bg50: "bg-amber-50",
    bg100: "bg-amber-100",
    hoverBg100: "hover:bg-amber-100",
    border100: "border-amber-100",
    border200: "border-amber-200",
    focusBorder: "focus:border-amber-400",
    text300: "text-amber-300",
    text500: "text-amber-500",
    text600: "text-amber-600",
    hoverText700: "hover:text-amber-700",
    text700: "text-amber-700",
    btnPrimary: "bg-amber-600 hover:bg-amber-700",
    dot: "bg-amber-400",
    spinnerBorder: "border-amber-400",
    toolbarActive: "bg-amber-100 text-amber-700",
    placeholder300: "placeholder:text-amber-300",
    todayCell: "bg-amber-50 text-amber-700",
    swatch: "#fbbf24",
    label: "Amber",
  },
  rose: {
    bg50: "bg-rose-50",
    bg100: "bg-rose-100",
    hoverBg100: "hover:bg-rose-100",
    border100: "border-rose-100",
    border200: "border-rose-200",
    focusBorder: "focus:border-rose-400",
    text300: "text-rose-300",
    text500: "text-rose-500",
    text600: "text-rose-600",
    hoverText700: "hover:text-rose-700",
    text700: "text-rose-700",
    btnPrimary: "bg-rose-600 hover:bg-rose-700",
    dot: "bg-rose-400",
    spinnerBorder: "border-rose-400",
    toolbarActive: "bg-rose-100 text-rose-700",
    placeholder300: "placeholder:text-rose-300",
    todayCell: "bg-rose-50 text-rose-700",
    swatch: "#fb7185",
    label: "Rose",
  },
  emerald: {
    bg50: "bg-emerald-50",
    bg100: "bg-emerald-100",
    hoverBg100: "hover:bg-emerald-100",
    border100: "border-emerald-100",
    border200: "border-emerald-200",
    focusBorder: "focus:border-emerald-400",
    text300: "text-emerald-300",
    text500: "text-emerald-500",
    text600: "text-emerald-600",
    hoverText700: "hover:text-emerald-700",
    text700: "text-emerald-700",
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700",
    dot: "bg-emerald-400",
    spinnerBorder: "border-emerald-400",
    toolbarActive: "bg-emerald-100 text-emerald-700",
    placeholder300: "placeholder:text-emerald-300",
    todayCell: "bg-emerald-50 text-emerald-700",
    swatch: "#34d399",
    label: "Emerald",
  },
  sky: {
    bg50: "bg-sky-50",
    bg100: "bg-sky-100",
    hoverBg100: "hover:bg-sky-100",
    border100: "border-sky-100",
    border200: "border-sky-200",
    focusBorder: "focus:border-sky-400",
    text300: "text-sky-300",
    text500: "text-sky-500",
    text600: "text-sky-600",
    hoverText700: "hover:text-sky-700",
    text700: "text-sky-700",
    btnPrimary: "bg-sky-600 hover:bg-sky-700",
    dot: "bg-sky-400",
    spinnerBorder: "border-sky-400",
    toolbarActive: "bg-sky-100 text-sky-700",
    placeholder300: "placeholder:text-sky-300",
    todayCell: "bg-sky-50 text-sky-700",
    swatch: "#38bdf8",
    label: "Sky",
  },
  slate: {
    bg50: "bg-slate-100",
    bg100: "bg-slate-200",
    hoverBg100: "hover:bg-slate-200",
    border100: "border-slate-200",
    border200: "border-slate-300",
    focusBorder: "focus:border-slate-400",
    text300: "text-slate-300",
    text500: "text-slate-500",
    text600: "text-slate-600",
    hoverText700: "hover:text-slate-700",
    text700: "text-slate-700",
    btnPrimary: "bg-slate-600 hover:bg-slate-700",
    dot: "bg-slate-400",
    spinnerBorder: "border-slate-400",
    toolbarActive: "bg-slate-200 text-slate-700",
    placeholder300: "placeholder:text-slate-300",
    todayCell: "bg-slate-100 text-slate-700",
    swatch: "#94a3b8",
    label: "Slate",
  },
};

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

const ThemeContext = createContext<{
  theme: ThemeId;
  t: Palette;
  setTheme: (id: ThemeId) => void;
}>({
  theme: "amber",
  t: THEMES.amber,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("amber");

  useEffect(() => {
    const saved = localStorage.getItem("journal-theme") as ThemeId;
    if (saved && THEMES[saved]) setThemeState(saved);
  }, []);

  function setTheme(id: ThemeId) {
    setThemeState(id);
    localStorage.setItem("journal-theme", id);
  }

  return (
    <ThemeContext.Provider value={{ theme, t: THEMES[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
