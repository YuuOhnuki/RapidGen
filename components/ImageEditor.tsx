'use client';

import { useState, useMemo, useRef } from 'react'; // useRefを追加
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Sparkles,
    Loader2,
    Menu,
    X,
    Upload,
    RotateCcw,
    Zap,
    Fan,
    Keyboard,
    Cog,
} from 'lucide-react'; // Upload, RotateCcwを追加
import Image from 'next/image';
import { DownloadImageButton } from './editor/DownloadImageButton';

// --- DUMMY DATA / PLACEHOLDERS ---
// 実際の画像URLをpropsとして受け取ることを想定
interface EditorInterfaceProps {
    imageUrl?: string; // 編集前の元画像のURL (オプション)
}

const stylePresets = [
    { id: 'monochrome', label: 'モノクロ (B&W)' },
    { id: 'vibrant', label: '鮮やか強調' },
    { id: 'anime', label: 'アニメ調' },
    { id: 'ghibli', label: 'ジブリ風' },
    { id: '3d', label: '3Dレンダリング' },
    { id: 'oil', label: '油絵' },
];

export function EditorInterface({
    imageUrl = '/mountain-lake-vista.png', // デフォルトの静的画像URL
}: EditorInterfaceProps) {
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    const [stylizationStrength, setStylizationStrength] = useState([50]);
    const [aspectRatio, setAspectRatio] = useState('auto');
    const [customPrompt, setCustomPrompt] = useState('');
    const [removeBackground, setRemoveBackground] = useState(false);
    const [maintainConsistency, setMaintainConsistency] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
        null
    );
    // ユーザーがアップロードした画像の Data URL (Base64または Blob URL) を保持
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
        null
    );

    // モバイルでのサイドバー開閉状態
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // ファイル入力にアクセスするためのRef
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 最終的なプロンプトを構築 (省略: 変更なし)
    const fullPrompt = useMemo(() => {
        const promptParts: string[] = [];
        if (selectedStyle) {
            const preset = stylePresets.find((p) => p.id === selectedStyle);
            if (preset) {
                promptParts.push(`スタイルは${preset.label}で、`);
            }
        }
        if (selectedStyle && stylizationStrength[0] !== 50) {
            if (stylizationStrength[0] > 70) {
                promptParts.push(
                    `非常に強い${stylizationStrength[0]}%のスタイライズ効果を適用し、`
                );
            } else if (stylizationStrength[0] < 30) {
                promptParts.push(
                    `控えめな${stylizationStrength[0]}%のスタイライズ効果を適用し、`
                );
            } else {
                promptParts.push(`中程度のスタイライズ効果を適用し、`);
            }
        }
        if (removeBackground) {
            promptParts.push('背景は完全に透過または白く除去し、');
        }
        if (maintainConsistency) {
            promptParts.push('元の画像の主要な被写体の一貫性を保ちつつ、');
        }
        if (customPrompt) {
            promptParts.push(customPrompt);
        } else if (!selectedStyle && !removeBackground) {
            promptParts.push('この画像をより魅力的に編集してください。');
        }
        return promptParts.join(' ').trim();
    }, [
        selectedStyle,
        stylizationStrength,
        customPrompt,
        removeBackground,
        maintainConsistency,
    ]);

    // ポーリング用のユーティリティ関数（省略: 変更なし）
    const pollTaskStatus = async (
        taskId: string,
        onProgress: (progress: number, message: string) => void
    ): Promise<string> => {
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    const response = await fetch(
                        `/api/status?taskId=${taskId}`
                    );
                    const data = await response.json();

                    if (!response.ok || data.error) {
                        clearInterval(intervalId);
                        throw new Error(
                            data.error || 'ポーリング中にエラーが発生しました'
                        );
                    }

                    const { status, progress, dataUrl } = data;

                    if (status === 'COMPLETED') {
                        clearInterval(intervalId);
                        resolve(dataUrl);
                        return;
                    }

                    onProgress(progress, 'AIが画像を生成中...');
                } catch (error) {
                    clearInterval(intervalId);
                    reject(error);
                }
            }, 3000);
        });
    };

    const handleGenerate = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        setProgress(0);
        setStatusMessage('準備中…');
        setGeneratedImageUrl(null);

        try {
            // **使用する画像URLを決定 (アップロードがあればそれを優先)**
            const sourceImageUrl = uploadedImageUrl || imageUrl;

            // === Step 1: 画像取得・Base64変換 ===
            setProgress(5);
            setStatusMessage('画像を読み込んでいます…');

            const responseImg = await fetch(sourceImageUrl); // 修正: sourceImageUrlを使用
            const blob = await responseImg.blob();
            const reader = new FileReader();

            const base64Image: string = await new Promise((resolve, reject) => {
                reader.onloadend = () =>
                    resolve((reader.result as string).split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            setProgress(15);
            setStatusMessage('Base64形式に変換しました…');

            // === Step 2: サーバー送信 ===
            setProgress(25);
            setStatusMessage('サーバーにリクエストを送信中…');

            // タスク開始リクエスト (省略: 変更なし)
            const taskStartResponse = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64Image,
                    prompt: fullPrompt,
                    strength: 0.1,
                }),
            });

            const taskStartData = await taskStartResponse.json();
            if (
                !taskStartResponse.ok ||
                taskStartData.error ||
                !taskStartData.taskId
            ) {
                throw new Error(
                    taskStartData.error || 'タスクIDの取得に失敗しました'
                );
            }

            const taskId = taskStartData.taskId;
            setProgress(40);
            setStatusMessage(`処理を開始しました…`);

            // === Step 3: ポーリングによる結果待機 ===
            const finalDataUrl = await pollTaskStatus(taskId, (p, msg) => {
                setProgress(p);
                setStatusMessage(msg);
            });

            // === Step 4: 完了 ===
            setProgress(100);
            setStatusMessage('画像生成が完了しました！');
            setGeneratedImageUrl(finalDataUrl);
        } catch (error) {
            console.error('画像生成エラー:', error);
            setStatusMessage('エラーが発生しました');
            alert(
                `画像生成中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // === NEW: 画像アップロードハンドラ ===
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                // ファイルの Data URL (Base64) を State に保存
                // generatedImageUrl をクリアして新しい画像での編集を促す
                setUploadedImageUrl(reader.result as string);
                setGeneratedImageUrl(null);
                setStatusMessage(
                    '新しい画像が読み込まれました。設定を確認して「AI画像を生成」を押してください。'
                );
                setProgress(0);
            };

            reader.onerror = (error) => {
                console.error('File reading error:', error);
                alert('ファイルの読み込み中にエラーが発生しました。');
            };

            reader.readAsDataURL(file);
        }
    };

    // === NEW: 画像リセットハンドラ ===
    const handleResetImage = () => {
        setUploadedImageUrl(null); // アップロード画像をクリア
        setGeneratedImageUrl(null); // 生成画像もクリア
        setStatusMessage('デフォルト画像にリセットされました。');
        setProgress(0);
        // 必要に応じて、fileInputRef.current.value をクリアして、同じ画像を再アップロードできるようにする
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // 現在表示すべき画像URLを計算
    const currentImageUrl = uploadedImageUrl || imageUrl;

    return (
        <div className="relative flex flex-col lg:flex-row h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-fuchsia-950 text-foreground">
            {/* Mobile Sidebar Toggle Button */}
            <div className="fixed top-4 right-4 z-50 lg:hidden">
                <Button
                    variant="secondary" // 背景が透けるようなvariant
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="rounded-full shadow-lg backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/20"
                >
                    {isSidebarOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Sidebar Controls */}
            <aside
                className={`
          fixed inset-y-0 right-0 z-40 w-full lg:w-96 
          transform transition-transform duration-300 ease-in-out
          bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-l border-white/20 dark:border-gray-800/20 shadow-2xl
          lg:translate-x-0 
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:static lg:block
          overflow-y-auto p-6
        `}
            >
                <div className="flex items-center justify-between lg:mb-6 mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        AI編集設定
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Card 1: Quick Style Presets */}
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">
                                <div className="flex gap-2">
                                    <Fan size={24} />
                                    クイックスタイルプリセット
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                {stylePresets.map((preset) => (
                                    <Button
                                        key={preset.id}
                                        variant={
                                            selectedStyle === preset.id
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className={`
                      h-auto py-3 text-sm rounded-lg transition-all
                      ${
                          selectedStyle === preset.id
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-white/70 dark:bg-gray-700/70 border-white/30 dark:border-gray-600/30 hover:bg-white/90 dark:hover:bg-gray-600/90'
                      }
                    `}
                                        onClick={() =>
                                            setSelectedStyle(preset.id)
                                        }
                                    >
                                        {preset.label}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Fine-Tuning & Detailed Settings */}
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">
                                <div className="flex gap-2">
                                    <Keyboard size={24} />
                                    詳細調整 & プロンプト
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Custom Prompt */}
                            <div className="space-y-2">
                                <Label htmlFor="custom-prompt">
                                    追加のプロンプト / 詳細な指示
                                </Label>
                                <Textarea
                                    id="custom-prompt"
                                    placeholder="例：魔法使いの帽子を追加、背景を夕焼けに変更..."
                                    value={customPrompt}
                                    onChange={(e) =>
                                        setCustomPrompt(e.target.value)
                                    }
                                    rows={4}
                                    className="resize-none bg-white/70 dark:bg-gray-700/70 border-white/30 dark:border-gray-600/30 focus-visible:ring-primary"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    <strong>現在のAI指示: </strong>{' '}
                                    {fullPrompt.substring(0, 100)}
                                </p>
                            </div>

                            {/* Stylization Strength */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="stylization-strength">
                                        スタイライズ強度
                                    </Label>
                                    <span className="text-sm text-muted-foreground">
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
                                    className="w-full"
                                    disabled={!selectedStyle} // スタイル選択時のみ有効
                                />
                            </div>

                            {/* Aspect Ratio */}
                            <div className="space-y-2">
                                <Label htmlFor="aspect-ratio">
                                    アスペクト比
                                </Label>
                                <Select
                                    value={aspectRatio}
                                    onValueChange={setAspectRatio}
                                >
                                    <SelectTrigger
                                        id="aspect-ratio"
                                        className="bg-white/70 dark:bg-gray-700/70 border-white/30 dark:border-gray-600/30 focus:ring-primary  w-full"
                                    >
                                        <SelectValue placeholder="選択してください" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-white/20 dark:border-gray-700/20">
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
                        </CardContent>
                    </Card>

                    {/* Card 3: Image Modification (Advanced) */}
                    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">
                                <div className="flex gap-2">
                                    <Cog size={24} />
                                    画像修正オプション
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Remove Background */}
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="remove-bg"
                                    className="cursor-pointer"
                                >
                                    背景を削除
                                </Label>
                                <Switch
                                    id="remove-bg"
                                    checked={removeBackground}
                                    onCheckedChange={setRemoveBackground}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>

                            {/* Maintain Subject Consistency */}
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="maintain-consistency"
                                    className="cursor-pointer"
                                >
                                    被写体の一貫性を維持
                                </Label>
                                <Switch
                                    id="maintain-consistency"
                                    checked={maintainConsistency}
                                    onCheckedChange={setMaintainConsistency}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col p-6 lg:p-8 overflow-auto">
                {/* Header (省略: 変更なし) */}
                <header className="mb-6 lg:mb-8 text-center lg:text-left">
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-balance flex flex-col lg:flex-row items-center gap-2 lg:gap-4 text-gray-900 dark:text-white">
                        <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                        GemiEdit
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        AIによる画像編集であなたのビジョンを形に。
                    </p>
                </header>

                {/* Image Display Area */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Original Image */}
                    <div className="flex flex-col gap-3">
                        <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            オリジナル画像
                        </Label>
                        <div className="relative flex-1 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 overflow-hidden shadow-lg aspect-video md:aspect-auto">
                            {/* ユーザーアップロード画像またはデフォルト画像を Image コンポーネントで表示 */}
                            <Image
                                src={currentImageUrl} // 修正: Stateに基づいて表示
                                alt="Original"
                                layout="fill"
                                objectFit="contain"
                                className="p-2"
                                unoptimized={currentImageUrl.startsWith(
                                    'data:'
                                )} // Data URLの場合は最適化を無効化
                            />
                        </div>

                        {/* 画像選択ボタンエリアの追加 */}
                        <div className="flex gap-2">
                            {/* 非表示のファイル入力 */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            {/* 画像アップロードボタン */}
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="flex-1"
                                disabled={isProcessing}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                画像をアップロード
                            </Button>

                            {/* 画像リセットボタン (アップロード画像がある場合のみ表示) */}
                            {uploadedImageUrl && (
                                <Button
                                    onClick={handleResetImage}
                                    variant="outline"
                                    className="w-1/3"
                                    disabled={isProcessing}
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    画像をリセット
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Edited Image (省略: 変更なし) */}
                    <div className="flex flex-col gap-3">
                        <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            AI編集後の画像
                        </Label>
                        <div className="relative flex-1 rounded-xl border-2 border-primary/70 bg-card dark:bg-gray-800/70 overflow-hidden shadow-2xl aspect-video md:aspect-auto">
                            {isProcessing ? (
                                <div className="w-full h-full flex items-center justify-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                                    <div className="text-center space-y-3">
                                        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
                                        <p className="text-md text-muted-foreground">
                                            AIが画像を処理中...
                                        </p>
                                    </div>
                                </div>
                            ) : generatedImageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={`data:image/png;base64,${generatedImageUrl}`}
                                    width={512}
                                    height={512}
                                    alt="Generated Image"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                                    <p className="text-muted-foreground text-center text-md">
                                        「AI画像を生成」ボタンをクリックして、AIによる編集結果を確認してください。
                                    </p>
                                </div>
                            )}
                        </div>
                        <DownloadImageButton
                            base64Data={generatedImageUrl}
                            isProcessing={isProcessing}
                        />
                    </div>
                </div>

                {/* Progress Bar & Status Message (進捗率の表示部分) */}
                {isProcessing && (
                    <div className="w-full my-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: '#4B9CE2',
                                }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 text-center">
                            {progress}%
                        </p>
                        <p className="text-sm text-gray-600 text-center">
                            {statusMessage}
                        </p>
                    </div>
                )}

                {/* Generate Button (省略: 変更なし) */}
                <Button
                    size="lg"
                    className="w-full max-w-lg mx-auto text-lg h-14 rounded-full shadow-lg text-primary-foreground font-semibold"
                    onClick={handleGenerate}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <Loader2
                                className="h-5 w-5 animate-spin"
                                size={32}
                            />
                            処理中...
                        </>
                    ) : (
                        <>
                            <Zap className="h-5 w-5" size={32} />
                            AI画像を生成
                        </>
                    )}
                </Button>
            </main>
        </div>
    );
}

export default EditorInterface;
