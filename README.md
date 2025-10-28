# RapidGen - AI画像生成・編集ツール

RapidGenは、最先端のAI技術を使用した画像生成・編集アプリケーションです。アップロードされた画像に様々なスタイルを適用し、高品質な画像を瞬時に生成できます。

![RapidGen Banner](public/mountain-lake-vista.png)

## 🚀 特徴

- **高速AI画像生成**: 最新のAIモデルによる数秒での画像処理
- **多彩なスタイルプリセット**: モノクロ、アニメ調、ジブリ風、3Dレンダリングなど
- **詳細な調整機能**: スタイル強度、アスペクト比、背景除去などの細かい設定
- **直感的なUI**: モダンなGlassmorphismデザインによる使いやすいインターフェース
- **レスポンシブ対応**: デスクトップからモバイルまで幅広いデバイスに対応

## 🛠️ 技術スタック

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **API**: Next.js API Routes
- **Backend**: Python FastAPI（別途セットアップが必要）

## 📦 インストールと使用方法

### 前提条件

- Node.js 18.0以上
- npm, yarn, pnpm, または bun

### セットアップ

1. **リポジトリのクローン**

    ```bash
    git clone https://github.com/YuuOhnuki/RapidGen.git
    cd rapidgen
    ```

2. **依存関係のインストール**

    ```bash
    npm install
    # または
    yarn install
    # または
    pnpm install
    ```

3. **環境変数の設定**
   `.env.local` ファイルを作成し、以下を設定：

    ```
    API_URL=http://localhost:8000  # Python APIのURL
    ```

4. **開発サーバーの起動**

    ```bash
    npm run dev
    # または
    yarn dev
    # または
    pnpm dev
    ```

5. **ブラウザでアクセス**
   [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを使用

### Python APIサーバーのセットアップ

RapidGenを完全に機能させるには、別途Python APIサーバーが必要です。
詳細は[API文書](docs/api.md)を参照してください。

## 📁 プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── api/               # API エンドポイント
│   │   ├── generate/      # 画像生成API
│   │   └── status/        # ステータス監視API
│   ├── editor/            # 画像編集ページ
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx          # ランディングページ
├── components/            # Reactコンポーネント
│   ├── editor/           # エディター関連コンポーネント
│   ├── ui/               # 再利用可能なUIコンポーネント
│   └── ImageUploadBox.tsx # 画像アップロードコンポーネント
├── lib/                  # ユーティリティ関数
├── hooks/               # カスタムReact Hooks
└── public/              # 静的アセット
```

## 🎨 主要コンポーネント

### `ImageUploadBox`

画像のアップロードとプレビュー機能を提供

### `Sidebar`

AI生成設定（スタイル選択、詳細調整）を管理

### `ImageDisplayArea`

オリジナル画像と生成画像の表示、ファイル操作

### `DownloadImageButton`

生成された画像のダウンロード機能

## 🔧 カスタマイズ

### スタイルプリセットの追加

`app/editor/page.tsx`の`stylePresets`配列に新しいスタイルを追加：

```typescript
const stylePresets = [
    // 既存のプリセット...
    { id: 'your-style', label: 'あなたのスタイル' },
];
```

### UIテーマの変更

`app/globals.css`でTailwind CSSの変数を変更してカスタマイズ可能

## 📱 レスポンシブ対応

- **モバイル**: 768px未満
- **タブレット**: 768px〜1024px
- **デスクトップ**: 1024px以上

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

1. フォークを作成
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Requestを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [Radix UI](https://www.radix-ui.com/) - 高品質なReactコンポーネント
- [Lucide](https://lucide.dev/) - 美しいオープンソースアイコン

## 📧 サポート

質問やサポートが必要な場合は、[Issues](https://github.com/your-username/rapidgen/issues)を作成してください。
