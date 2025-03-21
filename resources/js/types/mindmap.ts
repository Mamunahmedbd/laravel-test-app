import { Edge, Node } from '@xyflow/react';

export interface MindMapNode extends Node {
    data: {
        label: string;
    };
    type?: 'default' | 'input';
    parentId?: string;
}

export interface MindMapEdge extends Edge {
    type: 'smoothstep';
}

export interface MindMapStyle {
    centralNode: { color: string };
    primaryNodes: { color: string };
    secondaryNodes: { color: string };
    tertiaryNodes: { color: string };
}

export interface MindMapSettings {
    maxDepth: number;
    style: MindMapStyle;
}

export interface MindMap {
    id: number;
    title: string;
    content: string;
    structure: {
        nodes: MindMapNode[];
        edges: MindMapEdge[];
    };
    settings: MindMapSettings;
    created_at: string;
    updated_at: string;
}

export interface FormData {
    title: string;
    content: string;
    settings: {
        maxDepth: number;
        style: {
            centralNode: { color: string };
            primaryNodes: { color: string };
            secondaryNodes: { color: string };
            tertiaryNodes: { color: string };
        };
    };
}
