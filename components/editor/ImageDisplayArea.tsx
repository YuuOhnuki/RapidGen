'use client';

import Image from 'next/image';
import { Upload, RotateCcw, Loader2 } from 'lucide-react';
import React, { RefObject } from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { DownloadImageButton } from './DownloadImageButton';

interface ImageDisplayAreaProps {
    currentImageUrl: string;
    generatedImageUrl: string | null;
    isProcessing: boolean;
    uploadedImageUrl: string | null;
    fileInputRef: RefObject<HTMLInputElement>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleResetImage: () => void;
}

/**
 * 画像表示とアップロード/ダウンロード操作を行うコンポーネント (Liquid Glass Style - シンプル版)
 */
export function ImageDisplayArea({
    currentImageUrl,
    generatedImageUrl,
    isProcessing,
    uploadedImageUrl,
    fileInputRef,
    handleFileChange,
    handleResetImage,
}: ImageDisplayAreaProps) {
    // リキッドグラス共通スタイルをシンプル化
    const glassPanelStyle =
        'rounded-xl border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl transition-all duration-300 hover:shadow-fuchsia-500/10';

    // 画像コンテナ共通スタイル
    const imageContainerStyle =
        'relative flex-1 overflow-hidden transition-transform duration-300'; // hover:scaleを削除して控えめに

    return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 animate-in fade-in duration-700">
            {/* Original Image Area */}
            <div className={`flex flex-col gap-3 p-4 ${glassPanelStyle}`}>
                <Label className="text-xl font-bold text-white/80 flex items-center">
                    オリジナル画像
                </Label>
                <div
                    className={`${imageContainerStyle} aspect-video lg:aspect-square`}
                >
                    {/* 画像表示エリア */}
                    <div className="w-full h-full rounded-lg overflow-hidden bg-gray-800/50">
                        <Image
                            src={currentImageUrl}
                            alt="Original"
                            layout="fill"
                            objectFit="contain"
                            className="p-2 transition-opacity duration-500"
                            unoptimized={currentImageUrl.startsWith('data:')}
                        />
                    </div>
                </div>

                {/* 画像選択ボタンエリア */}
                <div className="flex gap-3 pt-2">
                    {/* 非表示のファイル入力 */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* 画像アップロードボタン (Primary Action) */}
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="default"
                        // グラデーションを単色に近いものに変更
                        className="flex-1 bg-fuchsia-600 text-white font-semibold rounded-lg shadow-md hover:bg-fuchsia-500 transition-colors"
                        disabled={isProcessing}
                    >
                        <Upload className="mr-2 h-5 w-5" />
                        画像をアップロード
                    </Button>

                    {/* 画像リセットボタン (Secondary Action) */}
                    {uploadedImageUrl && (
                        <Button
                            onClick={handleResetImage}
                            variant="outline"
                            className="w-1/3 text-white border-white/20 hover:bg-white/10 bg-white/5 rounded-lg transition-colors"
                            disabled={isProcessing}
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">
                                リセット
                            </span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Edited Image Area */}
            <div className={`flex flex-col gap-3 p-4 ${glassPanelStyle}`}>
                <Label className="text-xl font-bold text-white/80 flex items-center">
                    AI編集後の画像
                </Label>
                <div
                    className={`${imageContainerStyle} aspect-video lg:aspect-square`}
                >
                    {isProcessing ? (
                        <div className="w-full h-full flex items-center justify-center rounded-lg bg-gray-800/50 backdrop-blur-sm">
                            <div className="text-center space-y-3 p-8 animate-pulse">
                                <Loader2 className="h-12 w-12 animate-spin text-fuchsia-400 mx-auto" />
                                <p className="text-sm font-medium text-white/70">
                                    AIが画像を処理中...
                                </p>
                            </div>
                        </div>
                    ) : generatedImageUrl ? (
                        // Base64 Data URLはNext.js Imageコンポーネントで扱いにくいため、標準の<img>を使用
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={`data:image/png;base64,${generatedImageUrl}`}
                            alt="Generated Image"
                            className="rounded-lg transition-all duration-300"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: '8px', // パネルの枠に収まるように微調整
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-lg bg-gray-800/50 backdrop-blur-sm">
                            <p className="text-white/60 text-center text-sm p-8">
                                AI設定を選択し、「AI画像を生成」ボタンをクリックすると、ここに結果が表示されます。
                            </p>
                        </div>
                    )}
                </div>
                {/* ダウンロードボタンは生成画像がある場合のみ有効 */}
                <DownloadImageButton
                    base64Data={generatedImageUrl}
                    isProcessing={isProcessing}
                />
            </div>
        </div>
    );
}
