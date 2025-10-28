import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DownloadImageButtonProps {
    /**
     * ダウンロードする画像の Base64 エンコードされたデータURL (例: "iVBORw0KGgo...")
     */
    base64Data: string | null;
    /**
     * 処理中かどうかを示すフラグ (処理中はボタンを無効化するために使用)
     */
    isProcessing: boolean;
    /**
     * ダウンロード時のファイル名
     */
    fileName?: string;
}

/**
 * 生成された画像をダウンロードするためのボタンコンポーネント (Liquid Glass Style - シンプル版)
 */
export function DownloadImageButton({
    base64Data,
    isProcessing,
    fileName = 'edited_image.png',
}: DownloadImageButtonProps) {
    const handleDownload = () => {
        if (!base64Data) return;

        try {
            // 1. Base64データをバイナリ文字列にデコード
            const byteCharacters = atob(base64Data);

            // 2. バイト配列を作成
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // 3. Blob（バイナリラージオブジェクト）を作成
            // 生成画像がPNGであることを前提として 'image/png' を使用
            const blob = new Blob([byteArray], { type: 'image/png' });

            // 4. ダウンロード処理
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; // ファイル名を指定

            // DOMに追加してクリックし、すぐに削除
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Blob URLを解放
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('画像のダウンロード中にエラーが発生しました:', error);
            alert('画像のダウンロードに失敗しました。');
        }
    };

    const isDisabled = !base64Data || isProcessing;

    // ダウンロードボタンのスタイルをシンプル化
    const baseStyle =
        'w-full font-semibold text-base py-3 px-4 rounded-lg shadow-md transition-all duration-300';
    const enabledStyle =
        'bg-green-600 hover:bg-green-500 active:scale-[0.99] text-white'; // 緑系にシンプル化
    const disabledStyle =
        'bg-gray-700/50 text-gray-400 cursor-not-allowed shadow-inner';

    return (
        <Button
            onClick={handleDownload}
            disabled={isDisabled}
            className={`${baseStyle} ${isDisabled ? disabledStyle : enabledStyle}`}
        >
            <Download className="mr-2 h-5 w-5" />
            {isProcessing
                ? '処理完了後にダウンロード可能'
                : '画像をダウンロード'}
        </Button>
    );
}
