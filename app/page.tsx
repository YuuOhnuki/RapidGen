'use client';

import { useState } from 'react';
import { ImageUploadBox } from '@/components/ImageUploadBox';
import { ImageEditor } from '@/components/ImageEditor';

export default function Home() {
    const [currentScreen, setCurrentScreen] = useState<'upload' | 'editor'>(
        'upload'
    );
    const [selectedImage, setSelectedImage] = useState<string>('');

    const handleNext = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setCurrentScreen('editor');
    };

    const handleBack = () => {
        setCurrentScreen('upload');
    };

    return (
        <main className="min-h-screen bg-background">
            {currentScreen === 'upload' ? (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl">
                        <h1 className="text-3xl font-bold text-center mb-8">
                            画像アップロード
                        </h1>
                        <ImageUploadBox onNext={handleNext} />
                    </div>
                </div>
            ) : (
                <ImageEditor imageUrl={selectedImage} onBack={handleBack} />
            )}
        </main>
    );
}
