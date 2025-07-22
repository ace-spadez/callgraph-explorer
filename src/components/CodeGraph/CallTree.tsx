import React, { useState } from 'react';
import { Function, mockFunctions } from '@/data/mockPythonProject';
import { ChevronRight, ChevronDown, MoreHorizontal } from 'lucide-react';

interface TreeNode {
  id: string;
  function: Function;
  level: number;
  children?: TreeNode[];
  isExpanded?: boolean;
}

interface CallTreeProps {
  currentFunction: Function;
  onFunctionSelect: (functionId: string) => void;
}

export const CallTree: React.FC<CallTreeProps> = ({ currentFunction, onFunctionSelect }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([currentFunction.id]));
  const [maxLevels] = useState(4);

  const buildTree = (func: Function, level: number = 0, visited: Set<string> = new Set()): TreeNode | null => {
    if (visited.has(func.id) || level >= maxLevels) {
      return null;
    }

    const newVisited = new Set(visited);
    newVisited.add(func.id);

    const children: TreeNode[] = [];
    for (const call of func.calls) {
      const callFunc = mockFunctions[call.function_id];
      if (callFunc) {
        const childNode = buildTree(callFunc, level + 1, newVisited);
        if (childNode) {
          children.push(childNode);
        }
      }
    }

    return {
      id: func.id,
      function: func,
      level,
      children: children.length > 0 ? children : undefined,
      isExpanded: expandedNodes.has(func.id)
    };
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (node: TreeNode, index: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const indent = node.level * 16;

    return (
      <div key={`${node.id}-${node.level}-${index}`}>
        <div 
          className={`
            flex items-center py-2 px-3 cursor-pointer hover:bg-node-hover
            transition-colors duration-150 group
            ${node.id === currentFunction.id ? 'bg-node-focused border-l-2 border-l-primary' : ''}
          `}
          style={{ paddingLeft: `${12 + indent}px` }}
          onClick={() => onFunctionSelect(node.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.id);
                }}
                className="mr-2 p-0.5 hover:bg-muted rounded transition-colors"
              >
                {node.isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            ) : (
              <div className="w-4 mr-2" />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{node.function.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {node.function.module_id}
              </div>
            </div>
            
            {node.level === maxLevels - 1 && hasChildren && (
              <MoreHorizontal className="w-3 h-3 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        {hasChildren && node.isExpanded && (
          <div>
            {node.children?.map((child, childIndex) => renderTreeNode(child, childIndex))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(currentFunction);

  return (
    <div className="h-full bg-gradient-node">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mb-1">Call Tree</h3>
        <p className="text-xs text-muted-foreground">
          Navigate through function calls (max {maxLevels} levels)
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {tree && renderTreeNode(tree)}
      </div>
    </div>
  );
};