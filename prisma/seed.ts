import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ユーザーの作成
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // カテゴリの作成
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tech' },
      update: {},
      create: {
        name: '技術',
        slug: 'tech',
        description: '技術に関する記事',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: {
        name: 'チュートリアル',
        slug: 'tutorial',
        description: 'チュートリアル記事',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'diary' },
      update: {},
      create: {
        name: '日記',
        slug: 'diary',
        description: '日常の記録',
      },
    }),
  ]);

  // タグの作成
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: {
        name: 'Next.js',
        slug: 'nextjs',
        description: 'Next.jsに関する記事',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: {
        name: 'React',
        slug: 'react',
        description: 'Reactに関する記事',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: {
        name: 'TypeScript',
        slug: 'typescript',
        description: 'TypeScriptに関する記事',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: {
        name: 'Prisma',
        slug: 'prisma',
        description: 'Prismaに関する記事',
      },
    }),
  ]);

  // 技術の作成
  const technologies = await Promise.all([
    prisma.technology.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: {
        name: 'Next.js',
        slug: 'nextjs',
        description: 'React フレームワーク',
        color: '#000000',
      },
    }),
    prisma.technology.upsert({
      where: { slug: 'react' },
      update: {},
      create: {
        name: 'React',
        slug: 'react',
        description: 'JavaScript ライブラリ',
        color: '#61DAFB',
      },
    }),
    prisma.technology.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: {
        name: 'TypeScript',
        slug: 'typescript',
        description: 'JavaScript の型付きスーパーセット',
        color: '#3178C6',
      },
    }),
    prisma.technology.upsert({
      where: { slug: 'tailwindcss' },
      update: {},
      create: {
        name: 'Tailwind CSS',
        slug: 'tailwindcss',
        description: 'ユーティリティファーストの CSS フレームワーク',
        color: '#06B6D4',
      },
    }),
    prisma.technology.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: {
        name: 'Prisma',
        slug: 'prisma',
        description: 'Next-generation ORM',
        color: '#2D3748',
      },
    }),
    prisma.technology.upsert({
      where: { slug: 'postgresql' },
      update: {},
      create: {
        name: 'PostgreSQL',
        slug: 'postgresql',
        description: 'オープンソースリレーショナルデータベース',
        color: '#336791',
      },
    }),
    prisma.technology.upsert({
      where: { slug: 'vercel' },
      update: {},
      create: {
        name: 'Vercel',
        slug: 'vercel',
        description: 'フロントエンドクラウドプラットフォーム',
        color: '#000000',
      },
    }),
  ]);

  // プロジェクトの作成
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { slug: 'portfolio-website' },
      update: {},
      create: {
        title: 'パーソナルポートフォリオサイト',
        slug: 'portfolio-website',
        description:
          'Next.js と TypeScript で構築したモダンなポートフォリオサイト。ブログ機能とプロジェクト紹介機能を備えています。',
        content: `このポートフォリオサイトは、最新のWeb技術を使用して構築されています。

## 主な特徴
- **Next.js App Router**: 最新のNext.jsアーキテクチャを採用
- **TypeScript**: 型安全性を重視した開発
- **Tailwind CSS**: モダンで美しいデザイン
- **Prisma ORM**: 型安全なデータベース操作
- **PostgreSQL**: 信頼性の高いデータベース

## パフォーマンス最適化
- ISR（Incremental Static Regeneration）によるキャッシュ戦略
- 画像最適化
- コード分割
- SEO最適化`,
        features: `レスポンシブデザイン
ダークモード対応
ブログ機能
プロジェクト管理
お問い合わせフォーム
SEO最適化
パフォーマンス最適化`,
        challenges: `このプロジェクトでは、以下の技術的課題に取り組みました：

**1. パフォーマンス最適化**
Next.js App Routerの新しいキャッシュ戦略を活用し、ISRとSSGを適切に使い分けることで、高速なページ読み込みを実現しました。

**2. 型安全性の確保**
TypeScriptとPrismaを組み合わせることで、フロントエンドからデータベースまで一貫した型安全性を実現しました。

**3. SEO対策**
動的メタデータ生成、構造化データ、サイトマップ自動生成など、包括的なSEO対策を実装しました。`,
        githubUrl: 'https://github.com/yamada/portfolio',
        demoUrl: 'https://yamada-portfolio.vercel.app',
        featured: true,
        published: true,
        status: 'COMPLETED',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-15'),
      },
    }),
    prisma.project.upsert({
      where: { slug: 'task-management-app' },
      update: {},
      create: {
        title: 'タスク管理アプリ',
        slug: 'task-management-app',
        description:
          'チーム向けのタスク管理アプリケーション。リアルタイム同期とカンバンボード機能を備えています。',
        content: `効率的なチーム作業を支援するタスク管理アプリケーションです。

## 技術的な特徴
- **リアルタイム同期**: WebSocketを使用したリアルタイム更新
- **ドラッグ&ドロップ**: 直感的なタスク操作
- **権限管理**: ロールベースのアクセス制御
- **通知システム**: タスクの更新通知`,
        features: `カンバンボード
タスクの作成・編集・削除
ドラッグ&ドロップ操作
チームメンバー管理
コメント機能
ファイル添付
期限管理
通知機能`,
        challenges: `**リアルタイム同期の実装**
複数ユーザーが同時にタスクを操作する際の競合状態を適切に処理するため、楽観的ロックとWebSocketを組み合わせた仕組みを実装しました。

**パフォーマンス最適化**
大量のタスクデータを効率的に表示するため、仮想化とページネーションを組み合わせた表示方式を採用しました。`,
        githubUrl: 'https://github.com/yamada/task-manager',
        demoUrl: 'https://task-manager-demo.vercel.app',
        featured: true,
        published: true,
        status: 'COMPLETED',
        startDate: new Date('2023-10-01'),
        endDate: new Date('2023-12-20'),
      },
    }),
    prisma.project.upsert({
      where: { slug: 'ecommerce-platform' },
      update: {},
      create: {
        title: 'Eコマースプラットフォーム',
        slug: 'ecommerce-platform',
        description:
          'モダンなEコマースプラットフォーム。決済機能、在庫管理、注文管理を備えた本格的なオンラインストアです。',
        content: `スケーラブルで高性能なEコマースプラットフォームです。

## アーキテクチャ
- **マイクロサービス**: 機能ごとに分離された設計
- **API Gateway**: 統一されたAPI管理
- **キャッシュ戦略**: Redis を使用した高速化
- **セキュリティ**: JWT認証とOAuth2.0`,
        features: `商品管理
ショッピングカート
決済処理（Stripe連携）
注文管理
在庫管理
ユーザー管理
レビューシステム
検索・フィルタリング
管理者ダッシュボード`,
        githubUrl: 'https://github.com/yamada/ecommerce',
        featured: false,
        published: true,
        status: 'IN_PROGRESS',
        startDate: new Date('2024-03-01'),
      },
    }),
  ]);

  // プロジェクトと技術の関連付け
  await Promise.all([
    // ポートフォリオサイト
    prisma.projectTechnology.upsert({
      where: {
        projectId_technologyId: {
          projectId: projects[0].id,
          technologyId: technologies[0].id, // Next.js
        },
      },
      update: {},
      create: {
        projectId: projects[0].id,
        technologyId: technologies[0].id,
      },
    }),
    prisma.projectTechnology.upsert({
      where: {
        projectId_technologyId: {
          projectId: projects[0].id,
          technologyId: technologies[1].id, // React
        },
      },
      update: {},
      create: {
        projectId: projects[0].id,
        technologyId: technologies[1].id,
      },
    }),
    prisma.projectTechnology.upsert({
      where: {
        projectId_technologyId: {
          projectId: projects[0].id,
          technologyId: technologies[2].id, // TypeScript
        },
      },
      update: {},
      create: {
        projectId: projects[0].id,
        technologyId: technologies[2].id,
      },
    }),
    prisma.projectTechnology.upsert({
      where: {
        projectId_technologyId: {
          projectId: projects[0].id,
          technologyId: technologies[3].id, // Tailwind CSS
        },
      },
      update: {},
      create: {
        projectId: projects[0].id,
        technologyId: technologies[3].id,
      },
    }),
    prisma.projectTechnology.upsert({
      where: {
        projectId_technologyId: {
          projectId: projects[0].id,
          technologyId: technologies[4].id, // Prisma
        },
      },
      update: {},
      create: {
        projectId: projects[0].id,
        technologyId: technologies[4].id,
      },
    }),
    prisma.projectTechnology.upsert({
      where: {
        projectId_technologyId: {
          projectId: projects[0].id,
          technologyId: technologies[5].id, // PostgreSQL
        },
      },
      update: {},
      create: {
        projectId: projects[0].id,
        technologyId: technologies[5].id,
      },
    }),

    // タスク管理アプリ
    prisma.projectTechnology.upsert({
      where: {
        projectId_technologyId: {
          projectId: projects[1].id,
          technologyId: technologies[1].id, // React
        },
      },
      update: {},
      create: {
        projectId: projects[1].id,
        technologyId: technologies[1].id,
      },
    }),
    prisma.projectTechnology.upsert({
      where: {
        projectId_technologyId: {
          projectId: projects[1].id,
          technologyId: technologies[2].id, // TypeScript
        },
      },
      update: {},
      create: {
        projectId: projects[1].id,
        technologyId: technologies[2].id,
      },
    }),

    // Eコマースプラットフォーム
    prisma.projectTechnology.upsert({
      where: {
        projectId_technologyId: {
          projectId: projects[2].id,
          technologyId: technologies[0].id, // Next.js
        },
      },
      update: {},
      create: {
        projectId: projects[2].id,
        technologyId: technologies[0].id,
      },
    }),
    prisma.projectTechnology.upsert({
      where: {
        projectId_technologyId: {
          projectId: projects[2].id,
          technologyId: technologies[2].id, // TypeScript
        },
      },
      update: {},
      create: {
        projectId: projects[2].id,
        technologyId: technologies[2].id,
      },
    }),
  ]);

  // ブログ記事の作成
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'nextjs-app-router-guide' },
      update: {},
      create: {
        title: 'Next.js App Router 完全ガイド',
        slug: 'nextjs-app-router-guide',
        content: `# Next.js App Router 完全ガイド

Next.js 13で導入されたApp Routerは、従来のPages Routerに代わる新しいルーティングシステムです。

## App Routerの主な特徴

### 1. ファイルベースルーティング
\`\`\`
app/
  page.tsx          # /
  about/
    page.tsx        # /about
  blog/
    page.tsx        # /blog
    [slug]/
      page.tsx      # /blog/[slug]
\`\`\`

### 2. レイアウトシステム
\`\`\`tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
\`\`\`

### 3. サーバーコンポーネント
デフォルトでサーバーコンポーネントとして動作し、必要な場合のみ'use client'でクライアントコンポーネントに変更できます。

## まとめ
App Routerは、より直感的で強力なルーティングシステムを提供します。`,
        excerpt:
          'Next.js 13で導入されたApp Routerの基本的な使い方から応用まで、実例を交えて詳しく解説します。',
        published: true,
        publishedAt: new Date('2024-01-15'),
        authorId: user.id,
        categoryId: categories[0].id, // 技術
      },
    }),
    prisma.post.upsert({
      where: { slug: 'typescript-best-practices' },
      update: {},
      create: {
        title: 'TypeScript ベストプラクティス 2024',
        slug: 'typescript-best-practices',
        content: `# TypeScript ベストプラクティス 2024

TypeScriptを効果的に使用するためのベストプラクティスをまとめました。

## 型定義のベストプラクティス

### 1. 適切な型の使用
\`\`\`typescript
// ❌ 避けるべき
function processData(data: any) {
  return data.someProperty
}

// ✅ 推奨
interface UserData {
  id: string
  name: string
  email: string
}

function processData(data: UserData) {
  return data.name
}
\`\`\`

### 2. ユニオン型の活用
\`\`\`typescript
type Status = 'loading' | 'success' | 'error'

interface ApiResponse<T> {
  status: Status
  data?: T
  error?: string
}
\`\`\`

## まとめ
TypeScriptの型システムを適切に活用することで、より安全で保守性の高いコードを書くことができます。`,
        excerpt:
          '2024年版TypeScriptのベストプラクティスを、実際のコード例とともに紹介します。',
        published: true,
        publishedAt: new Date('2024-01-20'),
        authorId: user.id,
        categoryId: categories[0].id, // 技術
      },
    }),
  ]);

  // ブログ記事とタグの関連付け
  await Promise.all([
    prisma.postTag.upsert({
      where: {
        postId_tagId: {
          postId: posts[0].id,
          tagId: tags[0].id, // Next.js
        },
      },
      update: {},
      create: {
        postId: posts[0].id,
        tagId: tags[0].id,
      },
    }),
    prisma.postTag.upsert({
      where: {
        postId_tagId: {
          postId: posts[0].id,
          tagId: tags[1].id, // React
        },
      },
      update: {},
      create: {
        postId: posts[0].id,
        tagId: tags[1].id,
      },
    }),
    prisma.postTag.upsert({
      where: {
        postId_tagId: {
          postId: posts[1].id,
          tagId: tags[2].id, // TypeScript
        },
      },
      update: {},
      create: {
        postId: posts[1].id,
        tagId: tags[2].id,
      },
    }),
  ]);

  console.log('Seed data created successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
