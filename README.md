This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Vercelへのデプロイ手順

### 前提条件
- GitHubアカウント
- Vercelアカウント（GitHubアカウントでサインアップ可能）

### 1. Vercelプロジェクトの作成
1. [Vercel](https://vercel.com)にアクセスし、GitHubアカウントでログイン
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. プロジェクト設定で以下を確認:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 2. Neonデータベースのセットアップ（Vercel統合方式）
1. Vercelダッシュボードで「Storage」タブを選択
2. 「Connect Database」をクリック
3. 「Neon」を選択
4. 新しいデータベースを作成するか、既存のデータベースを接続
5. データベース名を設定
6. リージョンを選択（パフォーマンスを考慮してVercelプロジェクトと同じリージョンを推奨）
7. 「Create」をクリック

この方法の利点：
- 環境変数（DATABASE_URL）が自動的に設定される
- VercelとNeon間の接続が最適化される
- 単一のダッシュボードで管理可能
- セキュリティ設定が自動的に最適化される

### 3. 環境変数の設定
Vercelのプロジェクト設定で以下の環境変数を設定:

1. **NextAuth.js関連**
   ```
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   ```

2. **その他必要な環境変数**
   ```
   GITHUB_TOKEN="your-github-token"  # GitHub API使用時
   ```

### 4. デプロイの実行
1. 「Deploy」ボタンをクリック
2. デプロイが完了するまで待機（通常1-2分）
3. デプロイ完了後、提供されたURLでサイトにアクセス可能

### 5. カスタムドメインの設定（オプション）
1. Vercelダッシュボードで「Settings」→「Domains」
2. カスタムドメインを追加
3. DNSレコードを設定（Vercelが提供する手順に従う）

### 6. 自動デプロイの確認
- mainブランチへのプッシュで自動デプロイ
- プルリクエストでプレビューデプロイ
- デプロイログはVercelダッシュボードで確認可能

### 注意事項
- 無料プランの制限:
  - サーバーレス関数: 月間100GB時間
  - ビルド時間: 月間100分
  - 帯域幅: 月間100GB
  - チームメンバー: 最大3人
- Neon無料プランの制限:
  - プロジェクト数: 1つ
  - データベースサイズ: 3GB
  - 接続数: 最大10
  - 自動スケーリング: 有効

### トラブルシューティング
1. デプロイ失敗時:
   - Vercelダッシュボードでビルドログを確認
   - 環境変数が正しく設定されているか確認
   - データベース接続が正常か確認

2. データベース接続エラー:
   - Vercelダッシュボードの「Storage」タブで接続状態を確認
   - データベースのステータスを確認
   - 必要に応じてデータベースを再起動

3. 環境変数エラー:
   - すべての必須環境変数が設定されているか確認
   - 値が正しい形式か確認
   - シークレット値が適切に設定されているか確認

### 代替方法：手動でのNeon設定
Vercel統合方式を使用しない場合は、以下の手順で手動設定も可能です：

1. [Neon](https://neon.tech)にアクセスし、アカウントを作成
2. 新しいプロジェクトを作成
3. データベース接続情報を取得（Connection String）
4. Vercelの環境変数に手動で設定:
   ```
   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
   ```

この方法は以下の場合に選択肢となります：
- 既存のNeonデータベースを使用する場合
- 特定のデータベース設定が必要な場合
- 複数のプロジェクトで同じデータベースを使用する場合
