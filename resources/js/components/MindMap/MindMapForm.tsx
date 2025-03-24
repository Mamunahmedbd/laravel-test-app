import { FormData, MindMap } from '@/types/mindmap';
import { FormEvent, useState } from 'react';

interface MindMapFormProps {
    onMindMapGenerated: (data: MindMap) => void;
    formData: FormData;
    setFormData: (data: FormData) => void;
}

const demoContent = {
    title: 'UI/UX Design Principles',
    content: `UI/UX Design Principles including basic principles, key components, applications, and practical examples.

Key areas to cover:
1. Basic Principles
   - User-Centered Design
   - Consistency
   - Visual Hierarchy

2. Key Components
   - Navigation
   - Layout
   - Color Scheme

3. applications
   - Web Applications
   - Mobile Applications
   - Desktop Applications
`,
};

export default function MindMapForm({ onMindMapGenerated, formData, setFormData }: MindMapFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/mindmap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to generate mind map');
            }

            const data = await response.json();
            onMindMapGenerated(data);
        } catch (error) {
            console.error('Error generating mind map:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExampleClick = () => {
        setFormData({
            ...formData,
            title: demoContent.title,
            content: demoContent.content,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleExampleClick}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:outline-none"
                >
                    Fill Example Content
                </button>
            </div>
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-500">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="block w-full rounded-lg border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-200 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                    placeholder="Enter mind map title"
                    required
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-500">
                    Content
                </label>
                <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="block w-full rounded-lg border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-200 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                    placeholder="Enter your content here..."
                    required
                />
            </div>
            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${
                        isLoading
                            ? 'cursor-not-allowed bg-gray-300'
                            : 'bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:outline-none'
                    }`}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Generating...
                        </div>
                    ) : (
                        'Generate Mind Map'
                    )}
                </button>
            </div>
        </form>
    );
}
