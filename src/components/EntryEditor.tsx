"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import type { Editor } from "@tiptap/core";

const FontSizeTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

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

const FONT_SIZES = ["12px", "14px", "16px", "18px", "22px", "28px"];

function ToolbarBtn({
  active,
  onClick,
  title,
  children,
  className = "",
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center justify-center w-7 h-7 rounded text-sm transition-colors ${
        active
          ? "bg-amber-100 text-amber-700"
          : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const currentFontSize = editor.getAttributes("textStyle").fontSize || "16px";
  const currentColor = editor.getAttributes("textStyle").color || "#292524";
  const currentHighlight = editor.getAttributes("highlight").color || "#fef08a";

  return (
    <div className="flex items-center gap-0.5 flex-wrap pb-3 border-b border-stone-100 mb-1">
      <ToolbarBtn
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
        className="font-bold"
      >
        B
      </ToolbarBtn>

      <ToolbarBtn
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
        className="italic"
      >
        I
      </ToolbarBtn>

      <ToolbarBtn
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
        className="underline"
      >
        U
      </ToolbarBtn>

      <div className="w-px h-5 bg-stone-200 mx-1" />

      <ToolbarBtn
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="2" cy="4" r="1.5" />
          <rect x="5" y="3.25" width="10" height="1.5" rx="0.75" />
          <circle cx="2" cy="8" r="1.5" />
          <rect x="5" y="7.25" width="10" height="1.5" rx="0.75" />
          <circle cx="2" cy="12" r="1.5" />
          <rect x="5" y="11.25" width="10" height="1.5" rx="0.75" />
        </svg>
      </ToolbarBtn>

      <div className="w-px h-5 bg-stone-200 mx-1" />

      <select
        value={currentFontSize}
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) =>
          editor.chain().focus().setMark("textStyle", { fontSize: e.target.value }).run()
        }
        className="text-xs text-stone-500 border border-stone-200 rounded px-1.5 outline-none focus:border-amber-400 bg-white h-7"
        title="Font size"
      >
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size.replace("px", "")}px
          </option>
        ))}
      </select>

      <div className="w-px h-5 bg-stone-200 mx-1" />

      {/* Text color */}
      <label
        className="relative flex flex-col items-center justify-center w-7 h-7 rounded text-stone-500 hover:bg-stone-100 cursor-pointer transition-colors"
        title="Text color"
      >
        <span className="text-sm font-medium leading-none">A</span>
        <div className="w-4 h-1 rounded-sm" style={{ backgroundColor: currentColor }} />
        <input
          type="color"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          value={currentColor}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
      </label>

      {/* Highlight */}
      <label
        className={`relative flex items-center justify-center w-7 h-7 rounded cursor-pointer transition-colors ${
          editor.isActive("highlight") ? "bg-amber-100" : "hover:bg-stone-100"
        }`}
        title="Highlight color"
      >
        <span
          className="text-sm font-medium text-stone-600 px-0.5 rounded-sm leading-tight"
          style={editor.isActive("highlight") ? { backgroundColor: currentHighlight } : {}}
        >
          H
        </span>
        <input
          type="color"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          value={currentHighlight}
          onChange={(e) =>
            editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
          }
        />
      </label>
    </div>
  );
}

export default function EntryEditor({ date, initialContent = "", onSave, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);
  const [reflecting, setReflecting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      FontSizeTextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: initialContent || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "font-serif text-stone-800 text-base leading-relaxed outline-none min-h-[240px] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:min-h-[1.5em]",
      },
    },
    autofocus: true,
  });

  async function handleSave() {
    if (!editor) return;
    const html = editor.getHTML();
    const text = editor.getText();
    if (!text.trim()) return;

    setSaving(true);
    await onSave(html);
    setSaving(false);

    setReflecting(true);
    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim(), date }),
      });
      const data = await res.json();
      if (data.reflection) setReflection(data.reflection);
      else onCancel();
    } catch {
      onCancel();
    } finally {
      setReflecting(false);
    }
  }

  if (reflecting) {
    return (
      <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4 min-h-[200px] items-center justify-center">
        <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-stone-400">Reflecting on your entry…</p>
      </div>
    );
  }

  if (reflection) {
    return (
      <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
        <div>
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-3">
            A reflection
          </p>
          <p className="font-serif text-stone-700 text-base leading-relaxed">{reflection}</p>
        </div>
        <button
          onClick={onCancel}
          className="self-end bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-serif text-stone-500 text-sm">{formatDisplayDate(date)}</p>
        <button
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-600 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>

      {editor && <Toolbar editor={editor} />}

      <EditorContent editor={editor} />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !editor?.getText().trim()}
          className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save entry"}
        </button>
      </div>
    </div>
  );
}
