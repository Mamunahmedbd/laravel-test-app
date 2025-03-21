import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

interface NodeData {
    label: string;
    type?: string;
    description?: string;
    color?: string;
    opacity?: number;
    parentColor?: string;
}

interface CustomNodeProps {
    data: NodeData;
}

const DEFAULT_COLOR = '#171717';

function CustomNode({ data }: CustomNodeProps) {
    const isMainNode = data.type === 'main';
    const hasDescription = !!data.description;
    const isDarkColor = (color: string) => {
        try {
            // Convert hex to RGB
            const hex = color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            // Calculate relative luminance
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance < 0.5;
        } catch (e) {
            return true; // Default to dark for invalid colors
        }
    };

    const nodeColor = data.color || DEFAULT_COLOR;
    const textColor = isDarkColor(nodeColor) ? '#ffffff' : '#171717';
    const borderColor = isDarkColor(nodeColor)
        ? `${nodeColor}33` // 20% lighter version of the color
        : `${nodeColor}dd`; // 20% darker version of the color

    return (
        <div
            className="group relative rounded-lg border-2 shadow-lg transition-all duration-200 hover:shadow-xl"
            style={{
                minWidth: hasDescription ? '240px' : '180px',
                backgroundColor: nodeColor,
                borderColor: borderColor,
                color: textColor,
                opacity: data.opacity || 1,
            }}
        >
            <div className="px-4 py-3">
                <div className="text-sm leading-tight font-semibold">{data.label}</div>
                {hasDescription && <div className="mt-1.5 text-xs leading-snug opacity-90">{data.description}</div>}
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className={`!border-2 !bg-white ${isMainNode ? 'invisible' : 'visible'} !h-3 !w-3 !rounded-full`}
                style={{ borderColor: borderColor, opacity: data.opacity || 1 }}
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!h-3 !w-3 !rounded-full !border-2 !bg-white"
                style={{ borderColor: borderColor, opacity: data.opacity || 1 }}
            />
        </div>
    );
}

export default memo(CustomNode);
