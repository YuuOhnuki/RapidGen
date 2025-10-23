"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';

const stylePresets = [
  { id: 'monochrome', label: 'Monochrome (B&W)' },
  { id: 'vibrant', label: 'Vibrant Color Enhancement' },
  { id: 'anime', label: 'Anime Style' },
  { id: 'ghibli', label: 'Studio Ghibli Art' },
  { id: '3d', label: '3D Rendering' },
  { id: 'oil', label: 'Oil Painting' },
];

type Props = {
  originalImageUrl: string;
  onBack?: () => void;
};

export function EditorInterface({ originalImageUrl, onBack }: Props) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [stylizationStrength, setStylizationStrength] = useState([50]);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [customPrompt, setCustomPrompt] = useState('');
  const [removeBackground, setRemoveBackground] = useState(false);
  const [maintainConsistency, setMaintainConsistency] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // When originalImageUrl prop changes, we intentionally allow the component to
  // keep its state. If needed, parent can remount the component. Avoid setting
  // state synchronously inside an effect to prevent cascading renders.

  const handleGenerate = () => {
    setIsProcessing(true);
    // Simulate processing and produce a modified URL (here we just reuse original after timeout)
    setTimeout(() => {
      // In real app, replace with server response URL or Blob URL
      setEditedUrl(originalImageUrl);
      setIsProcessing(false);
    }, 1500);
  };

  // prepare sidebar content so we can reuse for desktop and mobile overlay
  const sidebarContent = (
    <div className="p-4 md:p-6 lg:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">スタイルプリセット</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {stylePresets.map((preset) => (
              <Button
                key={preset.id}
                variant={selectedStyle === preset.id ? 'default' : 'ghost'}
                className="h-auto py-3 text-sm"
                onClick={() => setSelectedStyle(preset.id)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">詳細設定・プロンプト</CardTitle>
          {/* Accordion toggle visible on mobile */}
          <button
            className="lg:hidden text-sm text-indigo-600"
            onClick={() => setIsAccordionOpen((s) => !s)}
            aria-expanded={isAccordionOpen}
          >
            {isAccordionOpen ? '閉じる' : '開く'}
          </button>
        </CardHeader>
        <div className={`${isAccordionOpen ? 'block' : 'hidden'} lg:block`}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="custom-prompt">追加のプロンプト / カスタム指示</Label>
              <Textarea
                id="custom-prompt"
                placeholder="例：帽子を追加、背景を夕焼けに変更..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="stylization-strength">スタイライズ強度</Label>
                <span className="text-sm text-gray-500">{stylizationStrength[0]}</span>
              </div>
              <Slider
                id="stylization-strength"
                min={1}
                max={100}
                step={1}
                value={stylizationStrength}
                onValueChange={setStylizationStrength}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">アスペクト比</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger id="aspect-ratio">
                  <SelectValue value={aspectRatio} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">1:1 (スクエア)</SelectItem>
                  <SelectItem value="4:3">4:3 (標準)</SelectItem>
                  <SelectItem value="16:9">16:9 (ワイド)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">画像編集オプション</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="remove-bg" className="cursor-pointer">
              背景を削除
            </Label>
            <Switch id="remove-bg" checked={removeBackground} onCheckedChange={setRemoveBackground} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="maintain-consistency" className="cursor-pointer">
              主題の一貫性を維持
            </Label>
            <Switch
              id="maintain-consistency"
              checked={maintainConsistency}
              onCheckedChange={setMaintainConsistency}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-black flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-indigo-600" />
            GemiEdit — AI画像編集
          </h1>
          <p className="text-sm text-gray-500 mt-1">AI による画像編集をシンプルに行えます</p>
        </div>

        {/* Mobile hamburger to open sidebar */}
        <div className="lg:hidden flex justify-end mb-4">
          <button
            aria-label="設定を開く"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center justify-center p-2 rounded-md bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Original Image</Label>
                <div className="relative h-56 md:h-auto rounded-lg border-2 border-gray-200 bg-gray-50 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={originalImageUrl} alt="Original" className="w-full h-full object-cover" />
                </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Edited Image</Label>
            <div className="relative h-56 md:h-auto rounded-lg border-2 border-indigo-200 bg-white overflow-hidden">
              {isProcessing ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
                    <p className="text-sm text-gray-500">Processing your image...</p>
                  </div>
                </div>
              ) : editedUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editedUrl} alt="Edited" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6">
                  <p className="text-gray-500 text-center">「生成して適用」をクリックすると編集結果が表示されます</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          {onBack && (
            <button onClick={onBack} className="text-sm text-gray-600 underline">
              戻る
            </button>
          )}
        </div>

        <Button size="lg" className="w-full text-lg h-14" onClick={handleGenerate} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              処理中...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              生成して編集を適用する
            </>
          )}
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-96 border-l border-gray-200 bg-white/50">{sidebarContent}</div>

      {/* Mobile slide-over */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-lg p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">設定</h3>
              <button onClick={() => setIsSidebarOpen(false)} aria-label="閉じる" className="p-2">
                ×
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorInterface;
