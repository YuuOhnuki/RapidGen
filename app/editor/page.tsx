'use client';

import { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Menu, X, Zap } from 'lucide-react';
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
function EditorContent({ params }: EditorInterfaceProps) {
    const searchParams = useSearchParams();

    // クエリパラメータから画像IDを取得
    const imageId = searchParams.get('imageId');

    // sessionStorageから画像データを取得（クライアントサイドでのみ実行）
    const [initialUploadedImageUrl, setInitialUploadedImageUrl] = useState<
        string | null
    >(null);

    console.log('--- DEBUG START ---');
    console.log('1. Image ID from Query:', imageId);
    console.log(
        '2. Retrieved Image URL:',
        initialUploadedImageUrl ? 'Data URL retrieved' : 'No data'
    );
    console.log(
        '3. Is it a data: URL?',
        initialUploadedImageUrl?.startsWith('data:')
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
        null
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // sessionStorageから画像データを取得してstateを更新
    useEffect(() => {
        if (!imageId) return;

        try {
            const imageData = sessionStorage.getItem(imageId);
            if (imageData) {
                setInitialUploadedImageUrl(imageData);
                setUploadedImageUrl(imageData);
                // データを取得した後はsessionStorageから削除（メモリリーク防止）
                sessionStorage.removeItem(imageId);
            }
        } catch (error) {
            console.error('Error retrieving image from sessionStorage:', error);
        }
    }, [imageId]);

    // 現在表示すべき画像URLを計算 (アップロードがあればそれを優先、なければデフォルト)
    const currentImageUrl = uploadedImageUrl || defaultImageUrl;

    // --- ロジック関数 ---

    // 最終的なプロンプトを構築
    const fullPrompt = useMemo(() => {
        const promptParts: string[] = [];

        // 🔹 元画像の忠実再現（最重要）
        promptParts.push(
            '元画像の顔の形、髪型、色合い、服装、ポーズ、構図を正確に維持してください。'
        );

        // 🔹 スタイル適用
        if (selectedStyle) {
            const preset = stylePresets.find((p) => p.id === selectedStyle);
            if (preset) {
                promptParts.push(
                    `画像の雰囲気を「${preset.label}」の方向に自然に調整してください。`
                );

                // スタイライズ強度
                const strength = stylizationStrength[0];
                if (strength > 70) {
                    promptParts.push('スタイルの変化を強く反映してください。');
                } else if (strength < 30) {
                    promptParts.push('スタイルの変化は控えめにしてください。');
                } else {
                    promptParts.push(
                        'スタイルの変化は中程度に反映してください。'
                    );
                }
            }
        }

        // 🔹 背景
        if (removeBackground) {
            promptParts.push('背景は透過またはシンプルな単色にしてください。');
        }

        // 🔹 元画像との一貫性
        if (maintainConsistency) {
            promptParts.push(
                '元画像と同じ人物や物体として認識できるようにしてください。'
            );
        }

        // 🔹 ユーザー指定のカスタム指示
        if (customPrompt) {
            promptParts.push(customPrompt);
        } else {
            promptParts.push('高品質で自然な仕上がりにしてください。');
        }

        // 🔹 img2img専用指示
        promptParts.push(
            'これはimg2img処理です。元画像を参照して変更してください。'
        );

        // 🔹 文章を結合
        return promptParts.join(' ').replace(/\s+/g, ' ').trim();
    }, [
        selectedStyle,
        stylizationStrength,
        customPrompt,
        removeBackground,
        maintainConsistency,
    ]);

    // ポーリング用のユーティリティ関数 (変更なし)
    // タスクステータスをポーリングする関数
    const pollTaskStatus = async (
        taskId: string,
        onProgress: (progress: number, message: string) => void
    ): Promise<string> => {
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                try {
                    const response = await fetch(
                        `/api/status?taskId=${taskId}`
                    );
                    const data = await response.json();

                    if (!response.ok) {
                        clearInterval(interval);
                        return reject(
                            new Error(
                                data.error || 'ステータス取得に失敗しました'
                            )
                        );
                    }

                    const progress = data.progress ?? 0;
                    const status = data.status ?? 'PENDING';

                    // ステータスに応じてメッセージを可視化
                    let statusMessage = '';
                    if (status === 'PENDING') statusMessage = '待機中…';
                    else if (status === 'IN_PROGRESS') {
                        if (progress < 10) statusMessage = '初期化中…';
                        else if (progress < 20)
                            statusMessage = 'モデルを準備しています…';
                        else if (progress < 30)
                            statusMessage = 'ノイズを付与しています…';
                        else if (progress < 90)
                            statusMessage = `画像生成中… (${progress}%)`;
                        else if (progress < 100)
                            statusMessage = '画像を最終処理中…';
                    } else if (status === 'COMPLETED')
                        statusMessage = '完了しました！';

                    onProgress(progress, statusMessage);

                    if (status === 'COMPLETED') {
                        clearInterval(interval);
                        return resolve(data.dataUrl);
                    }
                } catch (err) {
                    clearInterval(interval);
                    reject(err);
                }
            }, 3000); // 3秒ごとにポーリング
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

            let base64Image: string;

            // ★ 画像圧縮・リサイズ処理を追加
            const compressImage = (
                dataUrl: string,
                maxWidth: number = 1024,
                maxHeight: number = 1024,
                quality: number = 0.8
            ): Promise<string> => {
                return new Promise((resolve) => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();

                    img.onload = () => {
                        // アスペクト比を保持してリサイズ
                        let { width, height } = img;

                        if (width > height) {
                            if (width > maxWidth) {
                                height = (height * maxWidth) / width;
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width = (width * maxHeight) / height;
                                height = maxHeight;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;

                        // 画像を描画
                        ctx?.drawImage(img, 0, 0, width, height);

                        // 圧縮してData URLとして出力
                        const compressedDataUrl = canvas.toDataURL(
                            'image/jpeg',
                            quality
                        );
                        resolve(compressedDataUrl.split(',')[1]);
                    };

                    img.src = dataUrl;
                });
            };

            if (sourceImageUrl.startsWith('data:')) {
                // ★ 修正: Data URLの場合は圧縮処理を適用
                setStatusMessage('画像を圧縮中...');
                base64Image = await compressImage(sourceImageUrl);
            } else {
                // デフォルト画像（/mountain-lake-vista.png）など、通常のURLの場合
                setStatusMessage('画像をフェッチ中...');
                const responseImg = await fetch(sourceImageUrl);
                const blob = await responseImg.blob();

                const reader = new FileReader();

                const dataUrl: string = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });

                // 通常のURLから取得した画像も圧縮
                setStatusMessage('画像を圧縮中...');
                base64Image = await compressImage(dataUrl);
            }

            // fetch処理を回避したことで、ここから成功率が向上
            setProgress(5);
            setStatusMessage('Base64形式に変換しました…');

            // === Step 2: サーバー送信 ===
            setProgress(10);
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
            setProgress(20);
            setStatusMessage(`処理を開始しました…`);

            // === Step 3: ポーリングによる結果待機 ===
            const finalDataUrl = await pollTaskStatus(
                taskId,
                (progress, message) => {
                    setProgress(progress);
                    setStatusMessage(message);
                }
            );

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

/**
 * Suspenseでラップしたメインコンポーネント
 */
export default function EditorInterface({ params }: EditorInterfaceProps) {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>読み込み中...</p>
                    </div>
                </div>
            }
        >
            <EditorContent params={params} />
        </Suspense>
    );
}
