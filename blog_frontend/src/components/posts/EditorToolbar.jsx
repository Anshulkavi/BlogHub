// components/posts/EditorToolbar.jsx
import React, { useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Unlink,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Palette,
  Highlighter,
  Type,
  Minus
} from 'lucide-react';

const EditorToolbar = ({ editor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  if (!editor) {
    return null;
  }

  const colors = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F97316', 
    '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'
  ];

  const highlights = [
    '#FEF3C7', '#DBEAFE', '#D1FAE5', '#FED7D7', '#E9D5FF', 
    '#F3E8FF', '#FCE7F3', '#FFF7ED', '#F0FDF4', '#EFF6FF'
  ];

  const setLink = useCallback(() => {
    if (showLinkInput) {
      if (linkUrl) {
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      }
      setShowLinkInput(false);
      setLinkUrl('');
    } else {
      const previousUrl = editor.getAttributes('link').href;
      setLinkUrl(previousUrl || '');
      setShowLinkInput(true);
    }
  }, [editor, linkUrl, showLinkInput]);

  const ToolbarButton = ({ onClick, isActive, disabled, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-all duration-200 ${
        isActive
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      } flex items-center justify-center min-w-[32px] h-8`}
    >
      {children}
    </button>
  );

  const ToolbarSeparator = () => (
    <div className="w-px h-6 bg-gray-300 mx-1" />
  );

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2">
      <div className="flex flex-wrap items-center gap-1">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().toggleBold()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().toggleItalic()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().toggleStrike()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Text Color */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </ToolbarButton>
          
          {showColorPicker && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowColorPicker(false)}
              />
              <div className="absolute top-10 left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorPicker(false);
                  }}
                  className="w-full text-xs text-gray-600 hover:text-gray-900 py-1"
                >
                  Remove Color
                </button>
              </div>
            </>
          )}
        </div>

        {/* Highlight */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            isActive={editor.isActive('highlight')}
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </ToolbarButton>
          
          {showHighlightPicker && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowHighlightPicker(false)}
              />
              <div className="absolute top-10 left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {highlights.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().toggleHighlight({ color }).run();
                        setShowHighlightPicker(false);
                      }}
                      className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run();
                    setShowHighlightPicker(false);
                  }}
                  className="w-full text-xs text-gray-600 hover:text-gray-900 py-1"
                >
                  Remove Highlight
                </button>
              </div>
            </>
          )}
        </div>

        <ToolbarSeparator />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Quote & Code */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().toggleCode()}
          isActive={editor.isActive('code')}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Type className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Link */}
        <div className="relative">
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Add Link (Ctrl+K)"
          >
            <Link className="w-4 h-4" />
          </ToolbarButton>

          {showLinkInput && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl('');
                }}
              />
              <div className="absolute top-10 left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[300px]">
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Enter URL:
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setLink();
                      } else if (e.key === 'Escape') {
                        setShowLinkInput(false);
                        setLinkUrl('');
                      }
                    }}
                    placeholder="https://example.com"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={setLink}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkInput(false);
                      setLinkUrl('');
                    }}
                    className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {editor.isActive('link') && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove Link"
          >
            <Unlink className="w-4 h-4" />
          </ToolbarButton>
        )}

        <ToolbarSeparator />

        {/* Horizontal Rule */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Line"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};

export default EditorToolbar;