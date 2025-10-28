'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormControlCard } from './FormControlCard';
import { Cog, Fan, Keyboard, X } from 'lucide-react';

const stylePresets = [
    { id: 'monochrome', label: 'モノクロ (B&W)' },
    { id: 'vibrant', label: '鮮やか強調' },
    { id: 'anime', label: 'アニメ調' },
    { id: 'ghibli', label: 'ジブリ風' },
    { id: '3d', label: '3Dレンダリング' },
    { id: 'oil', label: '油絵' },
];

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    selectedStyle: string | null;
    setSelectedStyle: (style: string) => void;
    stylizationStrength: number[];
    setStylizationStrength: (strength: number[]) => void;
    aspectRatio: string;
    setAspectRatio: (ratio: string) => void;
    customPrompt: string;
    setCustomPrompt: (prompt: string) => void;
    removeBackground: boolean;
    setRemoveBackground: (checked: boolean) => void;
    maintainConsistency: boolean;
    setMaintainConsistency: (checked: boolean) => void;
    fullPrompt: string;
}

/**
 * AI編集設定サイドバーコンポーネント (Liquid Glass Style - シンプル版)
 */
export function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    selectedStyle,
    setSelectedStyle,
    stylizationStrength,
    setStylizationStrength,
    aspectRatio,
    setAspectRatio,
    customPrompt,
    setCustomPrompt,
    removeBackground,
    setRemoveBackground,
    maintainConsistency,
    setMaintainConsistency,
    fullPrompt,
}: SidebarProps) {
    return (
        <aside
            className={`
                fixed inset-y-0 right-0 z-40 w-full md:w-80 lg:w-96 
                transform transition-transform duration-500 ease-in-out
                bg-gray-800/40 // 背景色をより落ち着かせる
                backdrop-blur-2xl // ぼかしを少し弱めてシンプルに
                border-l border-white/10 shadow-xl
                lg:translate-x-0 
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                lg:static lg:block
                overflow-y-auto p-6 lg:p-8
            `}
        >
            <div className="flex items-center justify-between lg:mb-8 mb-4 border-b border-white/10 pb-4">
                <h2 className="text-xl font-extrabold flex items-center gap-2 text-white/90">
                    <Cog className="h-5 w-5 text-fuchsia-300" />
                    AI編集設定
                </h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden text-white hover:bg-white/10 rounded-full"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="space-y-6">
                {/* Card 1: Quick Style Presets */}
                <FormControlCard title="クイックスタイル" icon={Fan}>
                    <div className="grid grid-cols-2 gap-3">
                        {stylePresets.map((preset) => (
                            <Button
                                key={preset.id}
                                variant={
                                    selectedStyle === preset.id
                                        ? 'default'
                                        : 'outline'
                                }
                                className={`
                                    h-auto py-2 text-sm rounded-lg font-semibold transition-all duration-200
                                    ${
                                        selectedStyle === preset.id
                                            ? 'bg-fuchsia-500 text-white border-fuchsia-500 shadow-md shadow-fuchsia-500/20 hover:bg-fuchsia-400' // シンプルな単色ハイライト
                                            : 'bg-white/10 text-white border-white/20 hover:bg-white/10 hover:text-fuchsia-400'
                                    }
                                `}
                                onClick={() => setSelectedStyle(preset.id)}
                            >
                                {preset.label}
                            </Button>
                        ))}
                    </div>
                </FormControlCard>

                {/* Card 2: Fine-Tuning & Detailed Settings */}
                <FormControlCard title="詳細調整" icon={Keyboard}>
                    <div className="space-y-6">
                        {/* Custom Prompt */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="custom-prompt"
                                className="text-white/80 text-sm"
                            >
                                追加のプロンプト
                            </Label>
                            <Textarea
                                id="custom-prompt"
                                placeholder="例：魔法使いの帽子を追加..."
                                value={customPrompt}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                ) => setCustomPrompt(e.target.value)}
                                rows={3} // 行数を減らしてシンプルに
                                className="resize-none bg-white/10 text-white border-white/10 placeholder:text-white/50 focus-visible:ring-fuchsia-400"
                            />
                            <p className="text-xs text-white/50 mt-1">
                                現在の指示: {fullPrompt.substring(0, 50)}...
                            </p>
                        </div>

                        {/* Stylization Strength */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="stylization-strength"
                                    className="text-white/80 text-sm"
                                >
                                    スタイライズ強度
                                </Label>
                                <span className="text-sm text-fuchsia-300 font-bold">
                                    {stylizationStrength[0]}%
                                </span>
                            </div>
                            <Slider
                                id="stylization-strength"
                                min={1}
                                max={100}
                                step={1}
                                value={stylizationStrength}
                                onValueChange={setStylizationStrength}
                                className="w-full [&>span:first-child]:bg-fuchsia-500" // スライダーの色を変更
                                disabled={!selectedStyle}
                            />
                        </div>

                        {/* Aspect Ratio */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="aspect-ratio"
                                className="text-white/80 text-sm"
                            >
                                アスペクト比
                            </Label>
                            <Select
                                value={aspectRatio}
                                onValueChange={setAspectRatio}
                            >
                                <SelectTrigger
                                    id="aspect-ratio"
                                    className="bg-white/10 text-white border-white/10 focus:ring-fuchsia-400 w-full hover:bg-white/15"
                                >
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800/90 backdrop-blur-sm border-gray-700/10 text-white">
                                    <SelectItem value="auto">
                                        元の比率を維持
                                    </SelectItem>
                                    <SelectItem value="1:1">
                                        1:1 (正方形)
                                    </SelectItem>
                                    <SelectItem value="4:3">
                                        4:3 (標準)
                                    </SelectItem>
                                    <SelectItem value="16:9">
                                        16:9 (ワイドスクリーン)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </FormControlCard>

                {/* Card 3: Image Modification (Advanced) */}
                <FormControlCard title="画像修正オプション" icon={Cog}>
                    <div className="space-y-4">
                        {/* Remove Background */}
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="remove-bg"
                                className="cursor-pointer text-white/80 text-sm"
                            >
                                背景を削除
                            </Label>
                            <Switch
                                id="remove-bg"
                                checked={removeBackground}
                                onCheckedChange={setRemoveBackground}
                                className="data-[state=checked]:bg-fuchsia-500"
                            />
                        </div>

                        {/* Maintain Subject Consistency */}
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="maintain-consistency"
                                className="cursor-pointer text-white/80 text-sm"
                            >
                                被写体の一貫性を維持
                            </Label>
                            <Switch
                                id="maintain-consistency"
                                checked={maintainConsistency}
                                onCheckedChange={setMaintainConsistency}
                                className="data-[state=checked]:bg-fuchsia-500"
                            />
                        </div>
                    </div>
                </FormControlCard>
            </div>
        </aside>
    );
}
