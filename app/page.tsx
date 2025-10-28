import { ImageUploadBox } from '@/components/ImageUploadBox';

/**
 * メインランディングページコンポーネント
 * RapidGenの機能紹介と画像アップロードフォームを表示
 */
export default function UploadPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white p-4 sm:p-8">
            {/* メインのコンテナ - リキッドグラス風の背景 */}
            <div className="w-full max-w-4xl p-6 sm:p-10 lg:p-16 rounded-3xl backdrop-blur-3xl bg-white/10 shadow-2xl border border-white/20 transition-all duration-500 hover:shadow-cyan-500/50">
                {/* ヒーローセクション */}
                <header className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 leading-snug">
                        RapidGen
                    </h1>
                    <p className="mt-4 text-xl sm:text-2xl text-white/80 font-light drop-shadow-md">
                        画像をアップロードして、<strong>AI画像生成</strong>
                        の魔法を体験しよう。
                    </p>
                </header>

                {/* 画像アップロードセクション */}
                <section className="mt-8">
                    <h2 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">
                        🫧 すぐに画像をアップロード
                    </h2>

                    {/* ImageUploadBoxをLPの中心要素として配置 */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-xl">
                            <ImageUploadBox />
                        </div>
                    </div>
                </section>

                {/* 特徴セクション (LPらしさを追加) */}
                <footer className="mt-12 sm:mt-16 text-center pt-8 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-2xl mb-2 font-bold">
                                🚀 高速生成
                            </p>
                            <p className="text-white/70 text-sm">
                                最先端のAIモデルで数秒で結果を得られます。
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-2xl mb-2 font-bold">💎 高画質</p>
                            <p className="text-white/70 text-sm">
                                プロフェッショナルな品質の画像を生成。
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-2xl mb-2 font-bold">
                                🔒 安心設計
                            </p>
                            <p className="text-white/70 text-sm">
                                アップロードデータは安全に処理されます。
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
