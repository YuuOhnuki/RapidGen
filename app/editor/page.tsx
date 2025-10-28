'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Menu, X, Zap } from 'lucide-react';
import { Sidebar } from '@/components/editor/Sidebar';
import { ImageDisplayArea } from '@/components/editor/ImageDisplayArea';
import { useSearchParams } from 'next/navigation';

// --- DUMMY DATA / PLACEHOLDERS ---
interface EditorInterfaceProps {
    params: {
        imageUrl?: string;
    };
}

const stylePresets = [
    { id: 'monochrome', label: 'モノクロ (B&W)' },
    { id: 'vibrant', label: '鮮やか強調' },
    { id: 'anime', label: 'アニメ調' },
    { id: 'ghibli', label: 'ジブリ風' },
    { id: '3d', label: '3Dレンダリング' },
    { id: 'oil', label: '油絵' },
];

/**
 * 画像編集インターフェースのメインコンポーネント
 */
export default function EditorInterface({ params }: EditorInterfaceProps) {
    const searchParams = useSearchParams();

    // クエリパラメータから画像URLを取得 (これはURLエンコードされた文字列のまま)
    const encodedUrlFromQuery = searchParams.get('uploadedImageUrl');

    // デコード処理
    const initialUploadedImageUrl = encodedUrlFromQuery
        ? decodeURIComponent(encodedUrlFromQuery)
        : null;

    console.log('--- DEBUG START ---');
    console.log('1. Encoded URL from Query:', encodedUrlFromQuery);
    console.log('2. Decoded URL (Initial):', initialUploadedImageUrl);
    console.log(
        '3. Is it a blob: URL?',
        initialUploadedImageUrl?.startsWith('blob:')
    );
    console.log('--- DEBUG END ---');

    const defaultImageUrl = params.imageUrl
        ? `/${params.imageUrl}.png`
        : '/mountain-lake-vista.png';
    // --------------------------------------------------

    // --- State管理 ---
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
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
        initialUploadedImageUrl // ★ 初期値を設定
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 現在表示すべき画像URLを計算 (アップロードがあればそれを優先、なければデフォルト)
    const currentImageUrl = uploadedImageUrl || defaultImageUrl;

    // --- ロジック関数 ---

    // 最終的なプロンプトを構築
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

    // ポーリング用のユーティリティ関数 (変更なし)
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

    // 画像生成ハンドラ (変更なし)
    const handleGenerate = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        setProgress(0);
        setStatusMessage('準備中…');
        setGeneratedImageUrl(null);

        try {
            const sourceImageUrl = uploadedImageUrl || defaultImageUrl;

            // === Step 1: 画像取得・Base64変換 ===
            setProgress(5);
            setStatusMessage('画像を読み込んでいます…');

            const responseImg = await fetch(sourceImageUrl);
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

            const taskStartResponse = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64Image,
                    prompt: fullPrompt,
                    strength: 0.1, // 仮の強度パラメータ
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
            // Base64データ部分 (split(',')[1]に相当) を保存
            const finalBase64Data =
                finalDataUrl.split(',').length > 1
                    ? finalDataUrl.split(',')[1]
                    : finalDataUrl;
            setGeneratedImageUrl(finalBase64Data);
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

    useEffect(() => {
        // コンポーネントがアンマウントされる際に実行されるクリーンアップ関数
        return () => {
            // オブジェクトURLが設定されている場合にのみ解放
            if (uploadedImageUrl && uploadedImageUrl.startsWith('blob:')) {
                console.log('Revoking URL on unmount:', uploadedImageUrl);
                URL.revokeObjectURL(uploadedImageUrl);
            }
        };
    }, [uploadedImageUrl]); // uploadedImageUrlが変わるたびに前のURLを解放

    // 画像アップロードハンドラ
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                // ★ 古いオブジェクトURLがあれば解放
                if (uploadedImageUrl && uploadedImageUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(uploadedImageUrl);
                }

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

    // 画像リセットハンドラ
    const handleResetImage = () => {
        // ★ オブジェクトURLであれば解放
        if (uploadedImageUrl && uploadedImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(uploadedImageUrl);
        }
        setUploadedImageUrl(null);
        setGeneratedImageUrl(null);
        setStatusMessage('デフォルト画像にリセットされました。');
        setProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // --- 【変更点 C】アンマウント時の解放処理 ---
    useEffect(() => {
        // コンポーネントがアンマウントされる際に実行されるクリーンアップ関数
        return () => {
            if (uploadedImageUrl && uploadedImageUrl.startsWith('blob:')) {
                console.log('Revoking URL on unmount:', uploadedImageUrl);
                URL.revokeObjectURL(uploadedImageUrl);
            }
        };
    }, [uploadedImageUrl]); // uploadedImageUrlが変わるたびに前のURLを解放

    // --- レンダリング ---
    return (
        <div
            className="relative flex flex-col lg:flex-row h-screen 
             bg-gray-900 text-white overflow-hidden" // 背景を単色の深いダークグレーにシンプル化
        >
            {/* Mobile Sidebar Toggle Button */}
            <div className="fixed top-4 right-4 z-50 lg:hidden transform transition-transform duration-300 hover:scale-105">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    // ボタンのシャドウを削除し、シンプルに
                    className="rounded-full backdrop-blur-md bg-white/10 border border-white/30 text-white hover:bg-white/20"
                >
                    {isSidebarOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Sidebar Controls (共通コンポーネント) */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                stylizationStrength={stylizationStrength}
                setStylizationStrength={setStylizationStrength}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                removeBackground={removeBackground}
                setRemoveBackground={setRemoveBackground}
                maintainConsistency={maintainConsistency}
                setMaintainConsistency={setMaintainConsistency}
                fullPrompt={fullPrompt}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col p-4 z-10 overflow-auto">
                {/* Header with Animation */}
                <header className="mb-4 lg:mb-6 text-center lg:text-left animate-in fade-in slide-in-from-top-4 duration-700">
                    {/* タイトルのグラデーションとフォントサイズをシンプル化 */}
                    <h1
                        className="text-4xl sm:text-5xl font-bold tracking-tight text-white/90 
                        flex items-center gap-2 lg:gap-4 drop-shadow-md"
                    >
                        RapidGen
                    </h1>
                </header>

                {/* Image Display Area (共通コンポーネント) */}
                <ImageDisplayArea
                    currentImageUrl={currentImageUrl}
                    generatedImageUrl={generatedImageUrl}
                    isProcessing={isProcessing}
                    uploadedImageUrl={uploadedImageUrl}
                    fileInputRef={
                        fileInputRef as React.RefObject<HTMLInputElement>
                    }
                    handleFileChange={handleFileChange}
                    handleResetImage={handleResetImage}
                />

                {/* Progress Bar & Status Message */}
                {isProcessing && (
                    <div className="w-full my-4 max-w-6xl mx-auto p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-opacity duration-300 animate-in fade-in">
                        <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-2 rounded-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: '#EC4899', // ピンク系にシンプル化
                                }}
                            ></div>
                        </div>
                        <p className="text-xs text-white/80 mt-2 text-center">
                            {progress}% - {statusMessage}
                        </p>
                    </div>
                )}

                {/* Generate Button with Hover Animation */}
                {!isProcessing && (
                    <div className="w-full mx-auto flex m-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Button
                            size="lg"
                            // グラデーションを単色に近いシンプルなものに変更
                            className="max-w-xl mx-auto w-full text-xl h-14 rounded-2xl 
                            bg-fuchsia-600 shadow-md shadow-fuchsia-500/30 
                            text-white font-bold 
                            transition-all duration-300 hover:scale-[1.01] hover:bg-fuchsia-500 active:scale-[0.99] active:shadow-none"
                            onClick={handleGenerate}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2
                                        className="h-5 w-5 animate-spin mr-3"
                                        size={32}
                                    />
                                    処理中...
                                </>
                            ) : (
                                <>
                                    <Zap className="h-5 w-5 mr-3" size={32} />
                                    AI画像を生成
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
