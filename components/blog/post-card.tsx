import Link from 'next/link';
import { formatDate, truncate } from '@/lib/utils';
import { calculateReadingTime } from '@/lib/blog';

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content);

  return (
    <article className='group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      <Link href={`/blog/${post.slug}`}>
        {/* サムネイル画像エリア */}
        <div className='aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 relative overflow-hidden'>
          {/* 実際の画像がある場合はここに表示 */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='text-4xl opacity-50'>📝</span>
          </div>

          {/* カテゴリバッジ */}
          {post.category && (
            <div className='absolute top-3 left-3'>
              <span className='px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded'>
                {post.category.name}
              </span>
            </div>
          )}
        </div>

        {/* コンテンツエリア */}
        <div className='p-6'>
          {/* メタデータ */}
          <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3'>
            <time dateTime={post.publishedAt?.toISOString()}>
              {post.publishedAt
                ? formatDate(post.publishedAt)
                : formatDate(post.createdAt)}
            </time>
            <span>•</span>
            <span>{readingTime.text}</span>
            <span>•</span>
            <span>{post.author.name}</span>
          </div>

          {/* タイトル */}
          <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 transition-colors'>
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className='text-gray-600 dark:text-gray-400 leading-relaxed mb-4'>
            {post.excerpt || truncate(post.content, 120)}
          </p>

          {/* タグ */}
          {post.tags.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {post.tags.slice(0, 3).map((postTag: any) => (
                <span
                  key={postTag.tag.id}
                  className='px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded'
                >
                  #{postTag.tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className='px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded'>
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
