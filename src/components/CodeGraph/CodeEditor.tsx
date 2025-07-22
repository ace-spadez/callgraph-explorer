import React, { useEffect, useRef } from 'react';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { Function, Location } from '@/data/mockPythonProject';

interface CodeEditorProps {
  function: Function;
  highlightLines?: Location[];
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ function: func, highlightLines = [] }) => {
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
            fontSize: '14px',
            fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace'
          },
          '.cm-content': {
            padding: '16px',
            minHeight: '100%'
          },
          '.cm-focused': {
            outline: 'none'
          },
          '.cm-editor': {
            height: '100%'
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

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [func.code]);

  useEffect(() => {
    if (viewRef.current && highlightLines.length > 0) {
      // Scroll to highlighted line
      const location = highlightLines[0];
      const totalLines = viewRef.current.state.doc.lines;
      const line = Math.min(Math.max(1, location.start_line), totalLines);
      
      try {
        const pos = viewRef.current.state.doc.line(line).from;
        
        viewRef.current.dispatch({
          selection: { anchor: pos, head: pos },
          scrollIntoView: true
        });
      } catch (error) {
        console.warn('Could not scroll to line:', line, 'in', totalLines, 'line document');
      }
    }
  }, [highlightLines]);

  return (
    <div className="h-full bg-code-bg">
      <div className="h-8 bg-muted border-b border-border flex items-center px-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-accent"></div>
        </div>
        <div className="ml-4 text-sm text-muted-foreground">
          {func.location.file}
        </div>
      </div>
      <div 
        ref={editorRef} 
        className="h-[calc(100%-2rem)] overflow-hidden"
      />
    </div>
  );
};