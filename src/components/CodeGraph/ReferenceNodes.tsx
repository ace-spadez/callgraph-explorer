import React from 'react';
import { Call, mockFunctions } from '@/data/mockPythonProject';
import { ChevronUp } from 'lucide-react';

interface ReferenceNodesProps {
  references: Call[];
  focusedIndex: number;
  onFunctionSelect: (functionId: string) => void;
}

export const ReferenceNodes: React.FC<ReferenceNodesProps> = ({ 
  references, 
  focusedIndex,
  onFunctionSelect 
}) => {
  if (references.length === 0) {
    return (
      <div className="h-16 bg-muted/30 border-b border-border flex items-center justify-center">
        <div className="text-muted-foreground text-sm">No references found</div>
      </div>
    );
  }

  return (
    <div className="h-20 bg-gradient-node border-b border-border p-4">
      <div className="flex items-center space-x-2 mb-2">
        <ChevronUp className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-foreground">References ({references.length})</span>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto">
        {references.map((ref, index) => {
          // Only show references that have valid functions
          const isValidFunction = mockFunctions[ref.function_id];
          if (!isValidFunction) return null;
          
          return (
            <div
              key={`${ref.function_id}-${index}`}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg border text-sm cursor-pointer
                transition-all duration-200 hover:scale-105
                ${focusedIndex === index 
                  ? 'bg-primary border-primary text-primary-foreground shadow-glow' 
                  : 'bg-card border-border text-card-foreground hover:bg-node-hover hover:border-accent'
                }
              `}
              onClick={() => onFunctionSelect(ref.function_id)}
            >
              <div className="font-medium">{ref.function_id}</div>
              <div className="text-xs opacity-70 mt-1">
                Line {ref.called_at_location.start_line}
              </div>
            </div>
          );
        }).filter(Boolean)}
      </div>
    </div>
  );
};