import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { mockFunctions, Function } from '@/data/mockPythonProject';

interface FlowGraphProps {
  currentFunction: Function;
  onFunctionSelect: (functionId: string) => void;
}

export const FlowGraph: React.FC<FlowGraphProps> = ({ 
  currentFunction, 
  onFunctionSelect 
}) => {
  const { nodes, edges } = useMemo(() => {
    const nodeMap = new Map<string, Node>();
    const edgesList: Edge[] = [];
    
    // Central node
    nodeMap.set(currentFunction.id, {
      id: currentFunction.id,
      position: { x: 0, y: 0 },
      data: { 
        label: currentFunction.name,
        isMain: true,
        module: currentFunction.module_id 
      },
      type: 'default',
      style: {
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        border: '2px solid hsl(var(--primary-glow))',
        borderRadius: '12px',
        padding: '12px',
        minWidth: '150px',
        fontSize: '14px',
        fontWeight: '600',
      },
    });

    // Level 1 references (functions that call current function)
    const level1Refs = currentFunction.references;
    level1Refs.forEach((ref, index) => {
      const refFunc = mockFunctions[ref.function_id];
      if (refFunc) {
        const x = (index - level1Refs.length / 2) * 250;
        const y = -200;
        
        nodeMap.set(ref.function_id, {
          id: ref.function_id,
          position: { x, y },
          data: { 
            label: refFunc.name,
            module: refFunc.module_id 
          },
          type: 'default',
          style: {
            background: 'hsl(var(--accent))',
            color: 'hsl(var(--accent-foreground))',
            border: '1px solid hsl(var(--accent-glow))',
            borderRadius: '8px',
            padding: '8px',
            minWidth: '120px',
            fontSize: '12px',
          },
        });

        edgesList.push({
          id: `${ref.function_id}-${currentFunction.id}`,
          source: ref.function_id,
          target: currentFunction.id,
          type: 'smoothstep',
          style: { stroke: 'hsl(var(--accent))' },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--accent))' },
        });

        // Level 2 references (functions that call level 1 functions)
        refFunc.references.forEach((level2Ref, level2Index) => {
          const level2Func = mockFunctions[level2Ref.function_id];
          if (level2Func && level2Func.id !== currentFunction.id) {
            const level2X = x + (level2Index - refFunc.references.length / 2) * 150;
            const level2Y = -350;
            
            if (!nodeMap.has(level2Ref.function_id)) {
              nodeMap.set(level2Ref.function_id, {
                id: level2Ref.function_id,
                position: { x: level2X, y: level2Y },
                data: { 
                  label: level2Func.name,
                  module: level2Func.module_id 
                },
                type: 'default',
                style: {
                  background: 'hsl(var(--secondary))',
                  color: 'hsl(var(--secondary-foreground))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  padding: '6px',
                  minWidth: '100px',
                  fontSize: '11px',
                },
              });

              edgesList.push({
                id: `${level2Ref.function_id}-${ref.function_id}`,
                source: level2Ref.function_id,
                target: ref.function_id,
                type: 'smoothstep',
                style: { stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '5,5' },
                markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--muted-foreground))' },
              });
            }
          }
        });
      }
    });

    // Level 1 calls (functions called by current function)
    const level1Calls = currentFunction.calls;
    level1Calls.forEach((call, index) => {
      const callFunc = mockFunctions[call.function_id];
      if (callFunc) {
        const x = (index - level1Calls.length / 2) * 250;
        const y = 200;
        
        nodeMap.set(call.function_id, {
          id: call.function_id,
          position: { x, y },
          data: { 
            label: callFunc.name,
            module: callFunc.module_id 
          },
          type: 'default',
          style: {
            background: 'hsl(var(--accent))',
            color: 'hsl(var(--accent-foreground))',
            border: '1px solid hsl(var(--accent-glow))',
            borderRadius: '8px',
            padding: '8px',
            minWidth: '120px',
            fontSize: '12px',
          },
        });

        edgesList.push({
          id: `${currentFunction.id}-${call.function_id}`,
          source: currentFunction.id,
          target: call.function_id,
          type: 'smoothstep',
          style: { stroke: 'hsl(var(--accent))' },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--accent))' },
        });

        // Level 2 calls (functions called by level 1 functions)
        callFunc.calls.forEach((level2Call, level2Index) => {
          const level2Func = mockFunctions[level2Call.function_id];
          if (level2Func && level2Func.id !== currentFunction.id) {
            const level2X = x + (level2Index - callFunc.calls.length / 2) * 150;
            const level2Y = 350;
            
            if (!nodeMap.has(level2Call.function_id)) {
              nodeMap.set(level2Call.function_id, {
                id: level2Call.function_id,
                position: { x: level2X, y: level2Y },
                data: { 
                  label: level2Func.name,
                  module: level2Func.module_id 
                },
                type: 'default',
                style: {
                  background: 'hsl(var(--secondary))',
                  color: 'hsl(var(--secondary-foreground))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  padding: '6px',
                  minWidth: '100px',
                  fontSize: '11px',
                },
              });

              edgesList.push({
                id: `${call.function_id}-${level2Call.function_id}`,
                source: call.function_id,
                target: level2Call.function_id,
                type: 'smoothstep',
                style: { stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '5,5' },
                markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--muted-foreground))' },
              });
            }
          }
        });
      }
    });

    return {
      nodes: Array.from(nodeMap.values()),
      edges: edgesList
    };
  }, [currentFunction]);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(edges);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.id !== currentFunction.id) {
      onFunctionSelect(node.id);
    }
  }, [currentFunction.id, onFunctionSelect]);

  // Update nodes when currentFunction changes
  React.useEffect(() => {
    setFlowNodes(nodes);
    setFlowEdges(edges);
  }, [nodes, edges, setFlowNodes, setFlowEdges]);

  return (
    <div className="h-full bg-gradient-subtle">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.3,
          includeHiddenNodes: false,
        }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        panOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        style={{ background: 'transparent' }}
      >
        <Background 
          color="hsl(var(--border))" 
          gap={20} 
          size={1}
          style={{ opacity: 0.3 }}
        />
        <Controls 
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
      </ReactFlow>
    </div>
  );
};