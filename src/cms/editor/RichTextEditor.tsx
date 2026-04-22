import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { useEffect, useState } from "react";
import { MediaPickerDialog } from "./MediaPickerDialog";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Undo2,
  Redo2,
  Minus,
  Eraser,
  Table as TableIcon,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  dir?: "rtl" | "ltr" | "auto";
};

/**
 * Full-featured Tiptap editor. Stores HTML in `value` and emits HTML
 * via `onChange`. Toolbar covers headings, lists, marks, alignment,
 * links, images, highlight, and history. Sanitization happens at render
 * time via DOMPurify (see RichTextBlock).
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "ابدأ الكتابة...",
  minHeight = 200,
  dir = "auto",
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-primary underline underline-offset-2" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-md max-w-full h-auto" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Typography,
      Highlight.configure({ multicolor: false }),
      TextStyle,
      Color,
      Table.configure({ resizable: false, HTMLAttributes: { class: "tiptap-table" } }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: `prose prose-sm dark:prose-invert max-w-none focus:outline-none px-3 py-2`,
        dir,
        style: `min-height: ${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Keep external value in sync (e.g., when switching selected block)
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const count = editor.storage.characterCount as { characters: () => number; words: () => number };

  return (
    <div className="border rounded-md bg-background overflow-hidden flex flex-col">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
      <div className="border-t px-3 py-1.5 text-[11px] text-muted-foreground flex justify-between bg-muted/30">
        <span>{count.words()} كلمة</span>
        <span>{count.characters()} حرف</span>
      </div>
    </div>
  );
}
function Toolbar({ editor }: { editor: Editor }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const Btn = ({
    onClick,
    active,
    title,
    children,
    disabled,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon"
      className="h-7 w-7"
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </Button>
  );

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("الرابط:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="عريض"><Bold className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="مائل"><Italic className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="تحته خط"><UnderlineIcon className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="مشطوب"><Strikethrough className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="تظليل"><Highlighter className="w-3.5 h-3.5" /></Btn>
        <Separator orientation="vertical" className="h-5 mx-0.5" />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="H1"><Heading1 className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="H2"><Heading2 className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="H3"><Heading3 className="w-3.5 h-3.5" /></Btn>
        <Separator orientation="vertical" className="h-5 mx-0.5" />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="قائمة"><List className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="قائمة مرقمة"><ListOrdered className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="اقتباس"><Quote className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="كود"><Code className="w-3.5 h-3.5" /></Btn>
        <Separator orientation="vertical" className="h-5 mx-0.5" />
        <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="يمين"><AlignRight className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="وسط"><AlignCenter className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="يسار"><AlignLeft className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="ضبط"><AlignJustify className="w-3.5 h-3.5" /></Btn>
        <Separator orientation="vertical" className="h-5 mx-0.5" />
        <Btn onClick={setLink} active={editor.isActive("link")} title="رابط"><LinkIcon className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => setPickerOpen(true)} title="إدراج صورة من المكتبة"><ImageIcon className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="فاصل"><Minus className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="مسح التنسيق"><Eraser className="w-3.5 h-3.5" /></Btn>
        <Separator orientation="vertical" className="h-5 mx-0.5" />
        <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="تراجع"><Undo2 className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="إعادة"><Redo2 className="w-3.5 h-3.5" /></Btn>
      </div>
      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(item) => {
          editor.chain().focus().setImage({ src: item.public_url, alt: item.filename }).run();
          setPickerOpen(false);
        }}
      />
    </>
  );
}
