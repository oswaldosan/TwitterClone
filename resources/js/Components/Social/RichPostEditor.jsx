import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useRef } from 'react';

function ToolbarButton({ active, label, onClick, children }) {
    return (
        <button
            type="button"
            title={label}
            onClick={onClick}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                active
                    ? 'bg-writter-indigo text-white shadow-sm'
                    : 'text-writter-indigo/90 hover:bg-white/90'
            }`}
        >
            {children}
        </button>
    );
}

export default function RichPostEditor({
    editorKey = 0,
    placeholder = 'What is happening?',
    onChange,
    minHeightClass = 'min-h-[7rem]',
}) {
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const setLink = useCallback((editor) => {
        const prev = editor.getAttributes('link').href;
        const url = window.prompt('Link URL', prev || 'https://');
        if (url === null) {
            return;
        }
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, []);

    const editor = useEditor(
        {
            immediatelyRender: false,
            extensions: [
                StarterKit.configure({
                    heading: false,
                    bulletList: false,
                    orderedList: false,
                    blockquote: false,
                    code: false,
                    codeBlock: false,
                    horizontalRule: false,
                    link: {
                        openOnClick: false,
                        autolink: true,
                        defaultProtocol: 'https',
                        HTMLAttributes: {
                            rel: 'noopener noreferrer',
                            class: 'text-writter-cyan underline decoration-writter-cyan/60',
                        },
                    },
                }),
                Underline,
                Placeholder.configure({
                    placeholder,
                    emptyEditorClass: 'is-editor-empty',
                }),
                CharacterCount.configure({
                    limit: 280,
                }),
            ],
            content: '',
            editorProps: {
                attributes: {
                    class: `${minHeightClass} w-full max-w-none px-4 py-3.5 text-[15px] text-writter-indigo focus:outline-none md:text-base`,
                },
            },
            onUpdate: ({ editor: ed }) => {
                const html = ed.getHTML();
                const textLen = ed.getText().trim().length;
                onChangeRef.current(html, {
                    isEmpty: textLen === 0,
                    characters:
                        ed.storage.characterCount?.characters() ??
                        ed.getText().length,
                });
            },
        },
        [editorKey, placeholder, minHeightClass],
    );

    if (!editor) {
        return (
            <div
                className={`${minHeightClass} animate-pulse rounded-2xl bg-gradient-to-br from-writter-sky/25 to-white`}
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-writter-indigo/[0.09] bg-gradient-to-b from-white to-writter-sky/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="flex flex-wrap gap-1 border-b border-writter-indigo/[0.07] bg-writter-indigo/[0.05] px-3 py-2">
                <ToolbarButton
                    label="Bold"
                    active={editor.isActive('bold')}
                    onClick={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                >
                    B
                </ToolbarButton>
                <ToolbarButton
                    label="Italic"
                    active={editor.isActive('italic')}
                    onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                >
                    I
                </ToolbarButton>
                <ToolbarButton
                    label="Underline"
                    active={editor.isActive('underline')}
                    onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                >
                    U
                </ToolbarButton>
                <ToolbarButton
                    label="Strikethrough"
                    active={editor.isActive('strike')}
                    onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                    }
                >
                    S
                </ToolbarButton>
                <ToolbarButton
                    label="Link"
                    active={editor.isActive('link')}
                    onClick={() => setLink(editor)}
                >
                    🔗
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} className="tiptap-root font-sans" />
        </div>
    );
}
