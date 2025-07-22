import React, { useEffect, useRef } from 'react';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { Function, Location } from '@/data/mockPythonProject';
import { X } from 'lucide-react';

interface CodePopoverProps {
  function: Function;
  location?: Location;
  onClose: () => void;
}

export const CodePopover: React.FC<CodePopoverProps> = ({ function: func, location, onClose }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Clean up previous editor
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const state = EditorState.create({
      doc: func.code,
      extensions: [
        keymap.of(defaultKeymap),
        python(),
        oneDark,
        EditorView.theme({
          '&': {
            fontSize: '12px',
            fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace'
          },
          '.cm-content': {
            padding: '12px',
            minHeight: '100%'
          },
          '.cm-focused': {
            outline: 'none'
          },
          '.cm-editor': {
            height: '100%',
            maxHeight: '400px'
          },
          '.cm-scroller': {
            fontFamily: 'inherit'
          }
        }),
        EditorView.editable.of(false)
      ]
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current
    });

    // Scroll to the highlighted location if provided
    if (location && viewRef.current) {
      const line = Math.max(1, location.start_line);
      const pos = viewRef.current.state.doc.line(line).from;
      
      viewRef.current.dispatch({
        selection: { anchor: pos, head: pos },
        scrollIntoView: true
      });
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [func.code, location]);

  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
      <div className="w-96 bg-card border border-border rounded-lg shadow-elevated overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-muted border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <span className="text-sm font-medium text-foreground">{func.name}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-background rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* Location info */}
        {location && (
          <div className="px-3 py-2 bg-accent/10 border-b border-border">
            <div className="text-xs text-muted-foreground">
              Called at line {location.start_line} • {func.module_id}
            </div>
          </div>
        )}
        
        {/* Code Editor */}
        <div className="h-64">
          <div 
            ref={editorRef} 
            className="h-full overflow-hidden"
          />
        </div>
        
        {/* Footer */}
        <div className="p-3 bg-muted/50 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Press Enter to navigate to this function
          </div>
        </div>
      </div>
    </div>
  );
};