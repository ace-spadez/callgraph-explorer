import React from 'react';
import { Function } from '@/data/mockPythonProject';
import { FileText, AlertCircle } from 'lucide-react';

interface ArgumentsPanelProps {
  currentFunction: Function;
  highlightedArgs: string[];
}

export const ArgumentsPanel: React.FC<ArgumentsPanelProps> = ({ 
  currentFunction, 
  highlightedArgs 
}) => {
  return (
    <div className="h-full bg-gradient-node flex flex-col">
      {/* Arguments Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-3">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Parameters</h3>
        </div>
        
        {currentFunction.signature.parameters.length === 0 ? (
          <div className="text-xs text-muted-foreground italic">No parameters</div>
        ) : (
          <div className="space-y-2">
            {currentFunction.signature.parameters.map((param, index) => (
              <div
                key={index}
                className={`
                  p-3 rounded-lg border text-xs transition-all duration-200
                  ${highlightedArgs.includes(param.name)
                    ? 'bg-accent/20 border-accent shadow-accent-glow' 
                    : 'bg-card/50 border-border hover:border-accent/50'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{param.name}</span>
                  <span className="text-accent text-xs">{param.type}</span>
                </div>
                <div className="text-muted-foreground">
                  {param.kind} {param.default && `= ${param.default}`}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 p-2 bg-muted/30 rounded-lg">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Returns:</span> {currentFunction.signature.return_type}
          </div>
        </div>
      </div>

      {/* External Variables Section */}
      <div className="flex-1 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-semibold text-foreground">External Dependencies</h3>
        </div>
        
        {currentFunction.external_variables_used.length === 0 ? (
          <div className="text-xs text-muted-foreground italic">No external variables</div>
        ) : (
          <div className="space-y-2">
            {currentFunction.external_variables_used.map((variable, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border bg-card/50 border-border hover:border-yellow-500/50 text-xs transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground">{variable.name}</span>
                  <span className="text-yellow-500 text-xs">{variable.type}</span>
                </div>
                <div className="text-muted-foreground">
                  Used on line {variable.line}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Function Info */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Module:</span>
            <span className="text-foreground font-medium">{currentFunction.module_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lines:</span>
            <span className="text-foreground">{currentFunction.location.start_line}-{currentFunction.location.end_line}</span>
          </div>
          {currentFunction.class_id && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Class:</span>
              <span className="text-foreground">{currentFunction.class_id}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};