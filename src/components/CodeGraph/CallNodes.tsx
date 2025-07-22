import React from 'react';
import { Call, mockFunctions } from '@/data/mockPythonProject';
import { ChevronDown } from 'lucide-react';

interface CallNodesProps {
  calls: Call[];
  focusedIndex: number;
  onFunctionSelect: (functionId: string) => void;
}

export const CallNodes: React.FC<CallNodesProps> = ({ 
  calls, 
  focusedIndex,
  onFunctionSelect 
}) => {
  if (calls.length === 0) {
    return (
      <div className="h-16 bg-muted/30 border-t border-border flex items-center justify-center">
        <div className="text-muted-foreground text-sm">No function calls</div>
      </div>
    );
  }

  return (
    <div className="h-24 bg-gradient-node border-t border-border p-4">
      <div className="flex items-center space-x-2 mb-2">
        <ChevronDown className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-foreground">Function Calls ({calls.length})</span>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto">
        {calls.map((call, index) => {
          // Only show calls that have valid functions
          const isValidFunction = mockFunctions[call.function_id];
          if (!isValidFunction) return null;
          
          return (
            <div
              key={`${call.function_id}-${index}`}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg border text-sm cursor-pointer
                transition-all duration-200 hover:scale-105
                ${focusedIndex === index 
                  ? 'bg-accent border-accent text-accent-foreground shadow-accent-glow' 
                  : 'bg-card border-border text-card-foreground hover:bg-node-hover hover:border-accent'
                }
              `}
              onClick={() => onFunctionSelect(call.function_id)}
            >
              <div className="font-medium">{call.function_id}</div>
              <div className="text-xs opacity-70 mt-1">
                Line {call.called_at_location.start_line}
              </div>
            </div>
          );
        }).filter(Boolean)}
      </div>
    </div>
  );
};