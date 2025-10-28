// components/ImageUploadBox.tsx
'use client';

import type React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // ★ 新しく追加

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';

// onNext propは不要になりました
interface ImageUploadBoxProps {
    onNext?: (imageUrl: string) => void;
}

export function ImageUploadBox({} /* onNext */ : ImageUploadBoxProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter(); // ★ useRouterを初期化

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setFileName(file.name);
            setPreview(URL.createObjectURL(file));
            setSelectedFile(file);
        }
    };

    const handleRemove = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
        setFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    // ★ ページ遷移ロジックに変更
    const handleNext = () => {
        if (preview) {
            // オブジェクトURLをURLセーフな文字列にエンコード
            const encodedUrl = encodeURIComponent(preview);
            // クエリパラメータとしてURLを渡す
            router.push(`/editor?uploadedImageUrl=${encodedUrl}`);
        }
    };
    // 以下、デザインは前回の回答と同じ
    const liquidGlassCardClasses =
        'p-8 rounded-3xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl transition-all duration-300';
    const liquidGlassButtonClasses =
        'bg-primary/70 hover:bg-primary backdrop-blur-sm text-white font-semibold shadow-lg';

    return (
        <div className="w-full max-w-lg mx-auto space-y-6">
            <Card className={liquidGlassCardClasses}>
                {!preview ? (
                    <div
                        onClick={handleBoxClick}
                        className="border-2 border-dashed border-white/50 rounded-2xl p-16 text-center cursor-pointer hover:border-primary/80 transition-all duration-200"
                    >
                        <Upload className="w-16 h-16 mx-auto mb-6 text-white/70" />
                        <p className="text-base text-white/80 font-medium mb-2">
                            クリックして画像を選択
                        </p>
                        <p className="text-sm text-white/50">
                            PNG, JPG, GIF形式に対応 (最大10MB)
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="relative rounded-2xl overflow-hidden aspect-video">
                            <Image
                                src={preview || '/placeholder.svg'}
                                alt="Preview"
                                fill
                                sizes="(max-width: 640px) 100vw, 500px"
                                style={{ objectFit: 'contain' }}
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-3 right-3 rounded-full w-8 h-8 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm"
                                onClick={handleRemove}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-white/70 truncate text-center">
                            {fileName}
                        </p>
                    </div>
                )}
            </Card>

            {preview && (
                <Button
                    onClick={handleNext}
                    className={`w-full ${liquidGlassButtonClasses}`}
                    size="lg"
                >
                    次へ
                </Button>
            )}
        </div>
    );
}
