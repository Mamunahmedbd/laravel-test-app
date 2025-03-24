import MindMapForm from '@/components/MindMap/MindMapForm';
import MindMapViewer from '@/components/MindMap/MindMapViewer';
import { useMindMapStore } from '@/store/useMindMapStore';
import { FormData, MindMap as MindMapType } from '@/types/mindmap';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

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

    const { isExpanded, toggleExpand } = useMindMapStore();

    const handleMindMapGenerated = (data: MindMapType) => {
        setMindMapData(data);
    };

    return (
        <div className="px-4 py-8">
            <Head title="Mind Map Generator" />
            <div className="flex min-h-[calc(100vh-4rem)] gap-6 transition-all duration-500 ease-in-out">
                {/* Form Section */}
                <div
                    className={`rounded-lg bg-gray-50 transition-all duration-300 ease-in-out ${
                        isExpanded ? 'w-0 overflow-hidden opacity-0' : 'w-full opacity-100 lg:w-1/3'
                    }`}
                >
                    <MindMapForm onMindMapGenerated={handleMindMapGenerated} formData={formData} setFormData={setFormData} />
                </div>

                {/* Viewer Section */}
                <div
                    className={`relative flex-1 rounded-lg bg-gray-50 transition-all duration-300 ease-in-out`}
                    style={{
                        width: isExpanded ? '100%' : '66.666%',
                        opacity: isExpanded ? 1 : 0.9,
                    }}
                >
                    {mindMapData && <MindMapViewer mindMap={mindMapData} />}

                    {/* Expand/Collapse Button */}
                    <button
                        onClick={toggleExpand}
                        className="absolute top-4 right-4 cursor-pointer rounded-full bg-white p-2 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-100"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isExpanded ? (
                            <ArrowsPointingInIcon className="h-5 w-5 text-gray-600" />
                        ) : (
                            <ArrowsPointingOutIcon className="h-5 w-5 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
