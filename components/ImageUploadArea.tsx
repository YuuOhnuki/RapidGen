"use client";

import React from 'react';
import UploadBox from './UploadBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import EditorInterface from './EditorInterface';
import TransitionScreen from './TransitionScreen';

type Props = {
  onFiles?: (files: FileList) => void;
};

export const ImageUploadArea: React.FC<Props> = ({ onFiles }) => {
  const [selectedName, setSelectedName] = React.useState<string | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  const handleFiles = (files: FileList) => {
    console.log('Selected file:', files[0]?.name);
    setSelectedName(files[0]?.name ?? null);
    onFiles?.(files);

    // create object URL for preview and editor
    const file = files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      // trigger transition briefly before entering editor
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 700);
    }
  };

  const handleClear = () => {
    setSelectedName(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  };

  React.useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const [isTransitioning, setIsTransitioning] = React.useState(false);

  if (imageUrl) {
    return (
      <>
        {isTransitioning && <TransitionScreen message="編集画面に移行しています..." />}
        {!isTransitioning && <EditorInterface originalImageUrl={imageUrl} onBack={handleClear} />}
      </>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen pt-20 bg-gray-50">
      <Card className="w-[90%] max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">AI画像生成・編集スタート</CardTitle>
          <CardDescription className="text-base md:text-lg text-gray-600">ベースとなる画像を添付して、効率的な編集を始めましょう。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="px-2 md:px-6">
            <UploadBox onFiles={handleFiles} onClear={handleClear} />
            <p className="mt-3 text-xs text-gray-500">JPG, PNG, GIFなどの形式に対応しています。</p>
            {selectedName && (
              <div className="mt-2 flex items-center justify-between gap-4">
                <div className="text-sm text-gray-700">選択中: {selectedName}</div>
                <button onClick={handleClear} className="text-sm text-red-600 underline">
                  クリア
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadArea;
