import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// Geist Sansフォントの設定
const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

// Geist Monoフォントの設定
const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

// アプリケーションのベースURLを設定 (ご自身のドメインに合わせて変更してください)
const BASE_URL = 'https://www.rapidgen.ai';

/**
 * アプリケーションのメタデータ定義
 */
export const metadata: Metadata = {
    title: 'RapidGen | 最先端AIによる画像生成・編集ツール',
    description:
        'RapidGenは、アップロードされた画像を独自のスタイルで瞬時に変換・編集する最先端のAI画像生成ツールです。高解像度で美しいビジュアルを簡単に作成できます。',
    keywords: [
        'AI画像生成',
        '画像編集',
        'RapidGen',
        'AIアート',
        '画像スタイライズ',
        'Next.js',
    ],
    metadataBase: new URL(BASE_URL), // ベースURLを指定

    // --- OGP (Open Graph Protocol) 設定 ---
    openGraph: {
        title: 'RapidGen | AI画像生成・編集ツール',
        description:
            'アップロード画像を瞬時にAIで変換。高解像度でモダンなビジュアルを作成。',
        url: BASE_URL,
        siteName: 'RapidGen',
        images: [
            {
                url: `${BASE_URL}/ogp-image.png`, // OGP用画像ファイルのパス (publicディレクトリに配置)
                width: 1200,
                height: 630,
                alt: 'RapidGen AI画像生成サービスのキャプチャ',
            },
        ],
        locale: 'ja_JP',
        type: 'website',
    },

    // --- Twitter Card 設定 ---
    twitter: {
        card: 'summary_large_image', // 画像が大きく表示される設定
        site: '@rapidgen_ai', // サービス公式Twitterアカウント (存在する場合)
        creator: '@your_twitter_id', // 作成者のTwitterアカウント (存在する場合)
        images: [`${BASE_URL}/ogp-image.png`],
        title: 'RapidGen | AI画像生成・編集ツール',
        description:
            'アップロード画像を瞬時にAIで変換。高解像度でモダンなビジュアルを作成。',
    },

    // --- Favicon および PWA 設定へのリンク ---
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    // Web App Manifestへのリンクを追加
    manifest: '/manifest.webmanifest',
};

/**
 * ルートレイアウトコンポーネント
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen h-full`}
            >
                {children}
            </body>
        </html>
    );
}
