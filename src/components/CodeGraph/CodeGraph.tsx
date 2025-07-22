import React, { useState, useEffect, useCallback } from 'react';
import { mockFunctions, currentFunctionId, Function } from '@/data/mockPythonProject';
import { CodeEditor } from './CodeEditor';
import { ReferenceNodes } from './ReferenceNodes';
import { CallNodes } from './CallNodes';
import { CallTree } from './CallTree';
import { ArgumentsPanel } from './ArgumentsPanel';
import { CodePopover } from './CodePopover';

export interface FocusState {
  type: 'main' | 'reference' | 'call';
  index: number;
  functionId?: string;
}

export const CodeGraph: React.FC = () => {
  const [currentFunction, setCurrentFunction] = useState<Function>(mockFunctions[currentFunctionId]);
  const [focusState, setFocusState] = useState<FocusState>({ type: 'main', index: 0 });
  const [popoverData, setPopoverData] = useState<{ function: Function; location?: any } | null>(null);
  const [highlightedArgs, setHighlightedArgs] = useState<string[]>([]);

  const handleFunctionChange = useCallback((functionId: string) => {
    if (mockFunctions[functionId]) {
      setCurrentFunction(mockFunctions[functionId]);
      setFocusState({ type: 'main', index: 0 });
      setPopoverData(null);
      setHighlightedArgs([]);
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.target && (event.target as HTMLElement).closest('.cm-editor')) {
      return; // Don't handle keys when editor is focused
    }

    event.preventDefault();
    
    switch (event.key) {
      case 'ArrowUp':
        if (focusState.type === 'main' && currentFunction.references.length > 0) {
          const firstRef = currentFunction.references[0];
          const refFunction = mockFunctions[firstRef.function_id];
          setFocusState({ type: 'reference', index: 0, functionId: firstRef.function_id });
          setPopoverData({ function: refFunction, location: firstRef.called_at_location });
        } else if (focusState.type === 'call') {
          setFocusState({ type: 'main', index: 0 });
          setPopoverData(null);
          setHighlightedArgs([]);
        }
        break;
        
      case 'ArrowDown':
        if (focusState.type === 'main' && currentFunction.calls.length > 0) {
          const firstCall = currentFunction.calls[0];
          const callFunction = mockFunctions[firstCall.function_id];
          setFocusState({ type: 'call', index: 0, functionId: firstCall.function_id });
          setPopoverData({ function: callFunction, location: firstCall.called_at_location });
          // Highlight arguments used by this call
          if (callFunction) {
            setHighlightedArgs(callFunction.signature.parameters.map(p => p.name));
          }
        } else if (focusState.type === 'reference') {
          setFocusState({ type: 'main', index: 0 });
          setPopoverData(null);
        }
        break;
        
      case 'ArrowLeft':
        if (focusState.type === 'reference' && focusState.index > 0) {
          const newIndex = focusState.index - 1;
          const ref = currentFunction.references[newIndex];
          const refFunction = mockFunctions[ref.function_id];
          setFocusState({ type: 'reference', index: newIndex, functionId: ref.function_id });
          setPopoverData({ function: refFunction, location: ref.called_at_location });
        } else if (focusState.type === 'call' && focusState.index > 0) {
          const newIndex = focusState.index - 1;
          const call = currentFunction.calls[newIndex];
          const callFunction = mockFunctions[call.function_id];
          setFocusState({ type: 'call', index: newIndex, functionId: call.function_id });
          setPopoverData({ function: callFunction, location: call.called_at_location });
          if (callFunction) {
            setHighlightedArgs(callFunction.signature.parameters.map(p => p.name));
          }
        }
        break;
        
      case 'ArrowRight':
        if (focusState.type === 'reference' && focusState.index < currentFunction.references.length - 1) {
          const newIndex = focusState.index + 1;
          const ref = currentFunction.references[newIndex];
          const refFunction = mockFunctions[ref.function_id];
          setFocusState({ type: 'reference', index: newIndex, functionId: ref.function_id });
          setPopoverData({ function: refFunction, location: ref.called_at_location });
        } else if (focusState.type === 'call' && focusState.index < currentFunction.calls.length - 1) {
          const newIndex = focusState.index + 1;
          const call = currentFunction.calls[newIndex];
          const callFunction = mockFunctions[call.function_id];
          setFocusState({ type: 'call', index: newIndex, functionId: call.function_id });
          setPopoverData({ function: callFunction, location: call.called_at_location });
          if (callFunction) {
            setHighlightedArgs(callFunction.signature.parameters.map(p => p.name));
          }
        }
        break;
        
      case 'Enter':
        if (focusState.functionId) {
          handleFunctionChange(focusState.functionId);
        }
        break;
    }
  }, [focusState, currentFunction, handleFunctionChange]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-gradient-subtle text-foreground font-mono">
      <div className="flex h-screen">
        {/* Left Panel - Arguments and External Variables */}
        <div className="w-80 border-r border-border">
          <ArgumentsPanel 
            currentFunction={currentFunction}
            highlightedArgs={highlightedArgs}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative">
          {/* References (Top) */}
          <div className="border-b border-border">
            <ReferenceNodes 
              references={currentFunction.references}
              focusedIndex={focusState.type === 'reference' ? focusState.index : -1}
              onFunctionSelect={handleFunctionChange}
            />
          </div>

          {/* Central Editor */}
          <div className="flex-1 relative">
            <CodeEditor 
              function={currentFunction}
              highlightLines={focusState.type === 'call' && focusState.index >= 0 
                ? [currentFunction.calls[focusState.index]?.called_at_location] 
                : []}
            />
            
            {/* Code Popover */}
            {popoverData && (
              <CodePopover 
                function={popoverData.function}
                location={popoverData.location}
                onClose={() => setPopoverData(null)}
              />
            )}
          </div>

          {/* Calls (Bottom) */}
          <div className="border-t border-border">
            <CallNodes 
              calls={currentFunction.calls}
              focusedIndex={focusState.type === 'call' ? focusState.index : -1}
              onFunctionSelect={handleFunctionChange}
            />
          </div>
        </div>

        {/* Right Panel - Call Tree */}
        <div className="w-80 border-l border-border">
          <CallTree 
            currentFunction={currentFunction}
            onFunctionSelect={handleFunctionChange}
          />
        </div>
      </div>
    </div>
  );
};