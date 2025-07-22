import React, { useState, useCallback } from 'react';
import { mockFunctions, currentFunctionId, Function } from '@/data/mockPythonProject';
import { CodeEditor } from './CodeEditor';
import { FlowGraph } from './FlowGraph';
import { ArgumentsPanel } from './ArgumentsPanel';

export const CodeGraph: React.FC = () => {
  const [currentFunction, setCurrentFunction] = useState<Function>(mockFunctions[currentFunctionId]);
  const [highlightedArgs, setHighlightedArgs] = useState<string[]>([]);

  const handleFunctionChange = useCallback((functionId: string) => {
    if (mockFunctions[functionId]) {
      setCurrentFunction(mockFunctions[functionId]);
      setHighlightedArgs([]);
    }
  }, []);

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

        {/* Main Content Area - React Flow Graph */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 relative">
            <FlowGraph 
              currentFunction={currentFunction}
              onFunctionSelect={handleFunctionChange}
            />
            
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-80 border-l border-border">
          <CodeEditor 
            function={currentFunction}
            highlightLines={[]}
          />
        </div>
      </div>
    </div>
  );
};