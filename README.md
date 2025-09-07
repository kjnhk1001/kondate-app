# 🍱 Kondate AI - 献立作成アプリ

AIがあなたの献立を提案する次世代献立作成アプリです。

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`をコピーして`.env.local`を作成し、OpenAI APIキーを設定してください：

```bash
cp .env.local.example .env.local
```

`.env.local`ファイルを編集：

```
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. OpenAI APIキーの取得方法

1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. アカウントを作成またはログイン
3. [API Keys](https://platform.openai.com/account/api-keys)ページに移動
4. 「Create new secret key」をクリック
5. 生成されたAPIキーをコピーして`.env.local`に設定

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリにアクセスできます。

## 🎯 機能

- **献立生成**: 食材・ジャンル・調理時間を指定してAIが献立を提案
- **再生成**: 他の献立候補を簡単に取得
- **詳細表示**: 主菜・副菜・汁物の材料と作り方をアコーディオンで表示

## 🛠️ 技術スタック

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o
- **Form**: React Hook Form

## 📦 ディレクトリ構成

```
src/
├── app/                # Next.js App Router
│   ├── api/            # API Routes
│   ├── globals.css     # グローバルスタイル
│   ├── layout.tsx      # レイアウト
│   └── page.tsx        # メインページ
├── features/           # 機能別コンポーネント
│   └── menu/
│       ├── components/ # UI コンポーネント
│       ├── hooks/      # カスタムフック
│       ├── lib/        # ビジネスロジック
│       └── types.ts    # 型定義
└── libs/               # 外部サービス連携
```

## 🔧 開発

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

## 🐛 トラブルシューティング

### APIキーエラーが出る場合

- `.env.local`ファイルが存在し、正しいOpenAI APIキーが設定されているか確認
- OpenAIアカウントに十分なクレジット残高があるか確認
- APIキーの権限設定を確認

### 開発サーバーが起動しない場合

- Node.js バージョンが18以上であることを確認
- `npm install`を再実行
- ポート3000が使用中の場合は自動的に別のポートが使用されます

## 📝 ライセンス

MIT License
