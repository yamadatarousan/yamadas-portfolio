# Yamada Portfolio Site - GitHub Tech Trends Feature

このプロジェクトは、フルスタック開発者のポートフォリオサイトです。現在、GitHubの技術トレンド可視化機能を追加開発中です。

## プロジェクト概要
- **技術スタック**: Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL
- **認証**: NextAuth.js
- **デプロイ**: Vercel
- **データベース**: Prisma + PostgreSQL

## 開発する機能: GitHub Tech Trends
過去30日間に作成された人気GitHubリポジトリの技術スタック分析と可視化

### 機能詳細
1. **データ収集API**: 
   - GitHub Search APIで`created:>30日前 stars:>10`のリポジトリを取得
   - 各リポジトリの言語構成を分析
   - 日次でデータを蓄積

2. **可視化ダッシュボード**:
   - 言語別シェアの推移グラフ
   - 急上昇技術の検出
   - 技術の組み合わせトレンド

3. **Vercel Cron Job**:
   - 毎日自動でデータ収集
   - レート制限を考慮した実装

## 既存の構造
- `/app/api/github/` - GitHub API関連
- `/lib/github.ts` - GitHub API ユーティリティ
- `/components/projects/` - プロジェクト表示コンポーネント
- Prisma スキーマで技術情報を管理

## 開発コマンド
```bash
# 開発サーバー起動
npm run dev

# ビルド（Prismaマイグレーション含む）
npm run build

# テスト実行
npm test

# リント・フォーマット
npm run lint:fix
npm run format

# 型チェック
npm run type-check

# データベース操作
npm run db:generate
npm run db:push
npm run db:migrate
```

## 環境変数
```
GITHUB_TOKEN=ghp_xxx  # GitHub Personal Access Token
DATABASE_URL=postgresql://xxx  # PostgreSQL接続文字列
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=http://localhost:3000
```

## 技術スタック詳細
- **Next.js 15**: App Router, Server Components
- **TypeScript**: 型安全な開発
- **Tailwind CSS 4**: スタイリング
- **Prisma**: ORM、マイグレーション管理
- **Framer Motion**: アニメーション
- **Lucide React**: アイコン
- **React Hook Form + Zod**: フォーム管理・バリデーション

## 新機能開発手順
1. Prismaスキーマに技術トレンドテーブル追加
2. GitHub APIで技術トレンドデータ収集API作成
3. Recharts等でグラフコンポーネント作成
4. `/trends`ページ追加とルーティング
5. ヘッダーナビゲーションに追加
6. Vercel Cronジョブ設定

## 注意事項
- GitHub API レート制限: 5000リクエスト/時（認証あり）
- Vercel無料枠: 実行時間10秒/リクエスト、100GB/月
- データ収集は軽量に設計し、キャッシュを活用
- 既存のGitHub API実装を最大限活用

## テスト戦略
- Jest + Testing Library でコンポーネントテスト
- GitHub API モック対応
- データ集計ロジックの単体テスト
- E2Eテストは必要に応じて