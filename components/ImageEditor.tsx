'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import ControlPanel from './editor/ControlPanel';
import ImageCard from './editor/ImageCard';

interface ImageEditorProps {
    imageUrl: string;
    onBack?: () => void;
}

export function ImageEditor({ imageUrl, onBack }: ImageEditorProps) {
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [blur, setBlur] = useState(0);
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const handleExecute = () => {
        console.log('[v0] Executing with filters:', {
            brightness,
            contrast,
            saturation,
            blur,
        });
        // ここに画像処理の実行ロジックを追加
    };

    const handleReset = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setBlur(0);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Mobile Panel Toggle Button */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    className="bg-background shadow-lg"
                >
                    {isPanelOpen ? (
                        <X className="w-4 h-4" />
                    ) : (
                        <Menu className="w-4 h-4" />
                    )}
                </Button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col p-4 lg:p-8">
                    {/* Before/After Images */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                            {/* Before Image */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-left">
                                    編集前
                                </h3>
                                <ImageCard
                                    imageUrl={imageUrl}
                                    changed={false}
                                />
                            </div>

                            {/* After Image */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-left">
                                    編集後
                                </h3>
                                <ImageCard imageUrl={imageUrl} changed={true} />
                            </div>
                        </div>
                    </div>

                    {/* Execute Button */}
                    <div className="flex justify-center gap-4 mt-6 pb-4">
                        <Button
                            onClick={handleExecute}
                            size="lg"
                            className="w-full max-w-md py-6"
                        >
                            変更を保存して実行
                        </Button>
                    </div>
                </div>

                <ControlPanel
                    isPanelOpen={isPanelOpen}
                    handleReset={handleReset}
                />
            </div>
        </div>
    );
}
