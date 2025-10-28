import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ghost, ArrowLeft } from 'lucide-react';

/**
 * カスタム404 NotFound ページコンポーネント
 */
export default function NotFound() {
    return (
        // 1. 全体コンテナ: ダークでシンプルな背景
        <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            {/* 2. リキッドグラス・パネル */}
            <div
                className="
                w-full max-w-md p-8 sm:p-10 text-center rounded-3xl 
                backdrop-blur-3xl bg-white/5 
                border border-white/10 shadow-2xl shadow-black/50 
                animate-in fade-in duration-700
            "
            >
                {/* 3. アイコンとエラーコード */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <Ghost className="h-16 w-16 text-fuchsia-400 mb-2 drop-shadow-lg" />
                    <h1 className="text-7xl sm:text-8xl font-extrabold tracking-widest text-white/90 drop-shadow-md">
                        404
                    </h1>
                </div>

                {/* 4. タイトルとメッセージ */}
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white/90">
                    ページが見つかりません
                </h2>
                <p className="text-base sm:text-lg mb-8 text-white/70">
                    お探しのAIリソースは、別の次元に迷い込んだようです。
                </p>

                {/* 5. 戻るボタン (Linkコンポーネントを使用) */}
                <Link href="/" passHref legacyBehavior>
                    <Button
                        size="lg"
                        className="w-full text-lg h-12 rounded-xl 
                            bg-fuchsia-600 hover:bg-fuchsia-500 
                            text-white font-bold 
                            transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-fuchsia-500/30"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        ホームに戻る
                    </Button>
                </Link>
            </div>
        </main>
    );
}
