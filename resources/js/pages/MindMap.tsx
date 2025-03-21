import MindMapForm from '@/components/MindMap/MindMapForm';
import MindMapViewer from '@/components/MindMap/MindMapViewer';
import { FormData, MindMap as MindMapType } from '@/types/mindmap';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const initialNodes = [
    {
        id: 'horizontal-1',
        sourcePosition: 'right',
        type: 'input',
        data: { label: 'Input' },
        position: { x: 0, y: 80 },
    },
    {
        id: 'horizontal-2',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'A Node' },
        position: { x: 250, y: 0 },
    },
    {
        id: 'horizontal-3',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'Node 3' },
        position: { x: 250, y: 160 },
    },
    {
        id: 'horizontal-4',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'Node 4' },
        position: { x: 500, y: 0 },
    },
    {
        id: 'horizontal-5',
        sourcePosition: 'top',
        targetPosition: 'bottom',
        data: { label: 'Node 5' },
        position: { x: 500, y: 100 },
    },
    {
        id: 'horizontal-6',
        sourcePosition: 'bottom',
        targetPosition: 'top',
        data: { label: 'Node 6' },
        position: { x: 500, y: 230 },
    },
    {
        id: 'horizontal-7',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'Node 7' },
        position: { x: 750, y: 50 },
    },
    {
        id: 'horizontal-8',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'Node 8' },
        position: { x: 750, y: 300 },
    },
];

const initialEdges = [
    {
        id: 'horizontal-e1-2',
        source: 'horizontal-1',
        type: 'smoothstep',
        target: 'horizontal-2',
        animated: true,
    },
    {
        id: 'horizontal-e1-3',
        source: 'horizontal-1',
        type: 'smoothstep',
        target: 'horizontal-3',
        animated: true,
    },
    {
        id: 'horizontal-e1-4',
        source: 'horizontal-2',
        type: 'smoothstep',
        target: 'horizontal-4',
        label: 'edge label',
    },
    {
        id: 'horizontal-e3-5',
        source: 'horizontal-3',
        type: 'smoothstep',
        target: 'horizontal-5',
        animated: true,
    },
    {
        id: 'horizontal-e3-6',
        source: 'horizontal-3',
        type: 'smoothstep',
        target: 'horizontal-6',
        animated: true,
    },
    {
        id: 'horizontal-e5-7',
        source: 'horizontal-5',
        type: 'smoothstep',
        target: 'horizontal-7',
        animated: true,
    },
    {
        id: 'horizontal-e6-8',
        source: 'horizontal-6',
        type: 'smoothstep',
        target: 'horizontal-8',
        animated: true,
    },
];

export default function MindMap() {
    const [mindMapData, setMindMapData] = useState<MindMapType | null>({
        id: 1,
        title: 'Mind Map',
        content: 'This is a mind map',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        structure: {
            nodes: [],
            edges: [],
        },
        settings: {
            maxDepth: 3,
            style: {
                centralNode: { color: '#4A90E2' },
                primaryNodes: { color: '#50C878' },
                secondaryNodes: { color: '#FFB366' },
                tertiaryNodes: { color: '#FF7F7F' },
            },
        },
    });

    const [formData, setFormData] = useState<FormData>({
        title: '',
        content: '',
        settings: {
            maxDepth: 3,
            style: {
                centralNode: { color: '#4A90E2' },
                primaryNodes: { color: '#50C878' },
                secondaryNodes: { color: '#FFB366' },
                tertiaryNodes: { color: '#FF7F7F' },
            },
        },
    });

    const handleMindMapGenerated = (data: MindMapType) => {
        setMindMapData(data);
    };

    return (
        <div className="w-full">
            <Head title="Mind Map Generator" />
            <div className="flex w-full">
                <div className="w-full">
                    <div className="overflow-hidden bg-white shadow-sm">
                        <div className="min-h-screen p-6 text-gray-900">
                            <h1 className="mb-6 text-2xl font-semibold">Mind Map Generator</h1>
                            <div className="grid min-h-[calc(100vh-8rem)] grid-cols-1 gap-6 lg:grid-cols-3">
                                <div className="col-span-1 rounded-lg bg-gray-50">
                                    <MindMapForm onMindMapGenerated={handleMindMapGenerated} formData={formData} setFormData={setFormData} />
                                </div>
                                <div className="col-span-2 rounded-lg bg-gray-50">{mindMapData && <MindMapViewer mindMap={mindMapData} />}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
