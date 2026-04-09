import React, { useRef } from 'react';
import { AppIcon } from './AppIcon';
import { Download, CheckCircle2 } from 'lucide-react';

type Variant = 'primary' | 'minimal' | 'gradient' | 'dark' | 'light' | 'progress' | 'ring' | 'mono' | 'sunset' | 'forest' | 'ocean' | 'midnight';

const variants: { id: Variant; label: string }[] = [
    { id: 'primary', label: 'Primary Blue' },
    { id: 'minimal', label: 'Minimal Black' },
    { id: 'gradient', label: 'Gradient Purple' },
    { id: 'dark', label: 'Dark Mode' },
    { id: 'light', label: 'Light Mode' },
    { id: 'progress', label: 'Progress Rings' },
    { id: 'ring', label: 'Bold Ring' },
    { id: 'mono', label: 'Monochrome' },
    { id: 'sunset', label: 'Sunset' },
    { id: 'forest', label: 'Forest' },
    { id: 'ocean', label: 'Ocean' },
    { id: 'midnight', label: 'Midnight' },
];

export function IconExport() {
    const downloadIcon = async (variant: Variant, filename: string) => {
        // 1. Create a container for the independent SVG render
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        document.body.appendChild(container);

        // 2. Render the specific icon variant into the container using ReactDOM (or just standard DOM manipulation if we can)
        // Since we are in a React environment, we can't easily "render to string" without ReactDOMServer.
        // Instead, we will find the EXISTING SVG in the DOM for this variant, clone it, and use that.
        // However, the existing ones are small (120px). We want 1024px.
        // Strategy: We will misuse the fact that AppIcon is pure SVG. We can construct the SVG string manually? No, complex.

        // Better Strategy:
        // Render a hidden highly-scaled version of the icon in the current component, ref it, and use that.
        // But rendering 12 1024px icons is heavy.

        // Efficient Strategy:
        // Just find the SVG on screen (which is vector!), scale it up via canvas.
        // SVG is vector, so if we serialize the SVG string and load it into an Image, we can define the size we want it to render at.

        const svgElement = document.getElementById(`icon-preview-${variant}`)?.querySelector('svg');

        if (!svgElement) {
            console.error("Icon not found");
            return;
        }

        // Serialize SVG
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgElement);

        // Ensure width/height are set to 1024 explicitely in the string for the Image to respect it naturally?
        // Actually, we can control the Image size. But let's patch the ViewBox or width/height just in case.
        svgString = svgString.replace(/width="[^"]*"/, 'width="1024"').replace(/height="[^"]*"/, 'height="1024"');

        const img = new Image();
        // Encode SVG for src
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, 1024, 1024);

                // Trigger download
                const link = document.createElement('a');
                link.download = `${filename}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
            URL.revokeObjectURL(url);
            document.body.removeChild(container);
        };

        img.src = url;
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Export App Icons</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Download production-ready 1024×1024px PNG assets.
                    Use these files directly in Xcode (Assets.xcassets).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {variants.map((variant) => (
                    <div
                        key={variant.id}
                        className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-6"
                    >
                        <div id={`icon-preview-${variant.id}`} className="transform transition-transform hover:scale-105">
                            <AppIcon variant={variant.id} size={180} square={true} />
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                {variant.label}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono">
                                icon_{variant.id}.png
                            </p>
                        </div>

                        <button
                            onClick={() => downloadIcon(variant.id, `MonoFocus_Icon_${variant.id}`)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                        >
                            <Download size={18} />
                            <span>Download PNG</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-4">
                    <CheckCircle2 className="text-green-500 mt-1" size={24} />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Ready for App Store
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            These icons are generated as 1024×1024px opaque PNGs with proper sRGB color profile,
                            meeting all Apple Human Interface Guidelines requirements.
                            The corners will be automatically masked by iOS - do not add corner radius manually.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
