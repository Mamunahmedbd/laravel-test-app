import { MindMap } from '@/types/mindmap';
import {
    Background,
    Connection,
    Controls,
    Edge,
    MarkerType,
    MiniMap,
    Node,
    NodeTypes,
    ReactFlow as ReactFlowComponent,
    ReactFlowProvider,
    addEdge,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import CustomNode from './CustomNode';

interface CustomNodeData extends Record<string, unknown> {
    label: string;
    type?: string;
    description?: string;
}

const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

const colors = [
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Sage Green
    '#FFEEAD', // Cream Yellow
    '#D4A5A5', // Dusty Rose
    '#9B59B6', // Purple
    '#3498DB', // Blue
    '#E67E22', // Orange
    '#2ECC71', // Emerald Green
    '#F1C40F', // Yellow
    '#E74C3C', // Red
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Flow = ({ mindMap }: { mindMap: MindMap }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { fitView } = useReactFlow();
    const [isLoading, setIsLoading] = useState(true);

    const processNodes = useCallback((inputNodes: Node<CustomNodeData>[]) => {
        return inputNodes.map((node) => ({
            ...node,
            type: 'custom',
            data: {
                ...node.data,
                color: getRandomColor(),
            },
        }));
    }, []);

    const getEdgeStyle = useCallback((color: string) => {
        return {
            stroke: color,
            strokeWidth: 2,
        };
    }, []);

    useEffect(() => {
        if (mindMap?.structure) {
            const processedNodes = processNodes(mindMap.structure.nodes as Node<CustomNodeData>[]);
            setNodes(processedNodes);

            const processedEdges = mindMap.structure.edges.map((edge) => {
                const sourceNode = processedNodes.find((n) => n.id === edge.source);
                const color = sourceNode?.data.color || '#171717';
                return {
                    ...edge,
                    type: 'smoothstep',
                    style: getEdgeStyle(color),
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: color,
                    },
                    animated: true,
                };
            });
            setEdges(processedEdges);
        }
    }, [mindMap, processNodes, setNodes, setEdges, getEdgeStyle]);

    useEffect(() => {
        if (nodes.length > 0) {
            setTimeout(() => {
                fitView({ duration: 800, padding: 0.3 });
                setIsLoading(false);
            }, 200);
        }
    }, [nodes, fitView]);

    const onConnect = useCallback(
        (params: Connection) => {
            const sourceNode = nodes.find((n) => n.id === params.source);
            const color = sourceNode?.data.color || '#171717';
            const edgeOptions = {
                type: 'smoothstep' as const,
                style: getEdgeStyle(color),
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: color,
                },
                animated: true,
            };
            setEdges((eds) => addEdge({ ...params, ...edgeOptions }, eds));
        },
        [nodes, setEdges, getEdgeStyle],
    );

    if (isLoading) {
        return (
            <div className="flex h-[800px] w-full items-center justify-center">
                <div className="text-lg font-medium text-gray-500">Loading mind map...</div>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <ReactFlowComponent
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={1.5}
                className="bg-white"
            >
                <Background color="#e5e7eb" gap={16} />
                <Controls className="bg-white" />
                <MiniMap
                    className="!right-1 !bottom-20"
                    nodeColor={(node: Node) => (node.data as CustomNodeData).color || '#171717'}
                    maskColor="rgba(255, 255, 255, 0.7)"
                />
            </ReactFlowComponent>
        </div>
    );
};

export default function MindMapViewer({ mindMap }: { mindMap: MindMap }) {
    return (
        <ReactFlowProvider>
            <Flow mindMap={mindMap} />
        </ReactFlowProvider>
    );
}
