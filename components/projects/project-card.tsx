import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Github, Star } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  showFeaturedBadge?: boolean;
  className?: string;
}

export function ProjectCard({
  project,
  showFeaturedBadge = true,
  className = '',
}: ProjectCardProps) {
  return (
    <article
      className={`group relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <Link href={`/projects/${project.slug}`}>
        {/* プロジェクト画像 */}
        <div className='aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 relative overflow-hidden'>
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-300'
            />
          ) : (
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-4xl opacity-50'>🚀</span>
            </div>
          )}

          {/* Featured Badge */}
          {showFeaturedBadge && project.featured && (
            <div className='absolute top-3 left-3'>
              <div className='flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full'>
                <Star className='h-3 w-3 fill-current' />
                Featured
              </div>
            </div>
          )}

          {/* External Links Overlay */}
          <div className='absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 bg-gray-900/80 text-white rounded-full hover:bg-gray-900 transition-colors'
                onClick={e => e.stopPropagation()}
              >
                <Github className='h-4 w-4' />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 bg-blue-600/80 text-white rounded-full hover:bg-blue-600 transition-colors'
                onClick={e => e.stopPropagation()}
              >
                <ExternalLink className='h-4 w-4' />
              </a>
            )}
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className='p-6'>
          {/* タイトル */}
          <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 transition-colors'>
            {project.title}
          </h2>

          {/* 説明 */}
          <p className='text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3'>
            {project.description}
          </p>

          {/* 技術スタック */}
          {project.technologies && project.technologies.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-4'>
              {project.technologies.slice(0, 5).map((projectTech: any) => (
                <span
                  key={projectTech.technology.id}
                  className='px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full'
                  style={{
                    backgroundColor: `${projectTech.technology.color}20`,
                    color: projectTech.technology.color,
                    borderColor: `${projectTech.technology.color}40`,
                  }}
                >
                  {projectTech.technology.name}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className='px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full'>
                  +{project.technologies.length - 5}
                </span>
              )}
            </div>
          )}

          {/* フッター：リンク */}
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {new Date(project.createdAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'short',
              })}
            </span>

            <div className='flex items-center gap-3 text-sm'>
              {project.githubUrl && (
                <span className='flex items-center gap-1 text-gray-600 dark:text-gray-400'>
                  <Github className='h-4 w-4' />
                  GitHub
                </span>
              )}
              {project.demoUrl && (
                <span className='flex items-center gap-1 text-blue-600 dark:text-blue-400'>
                  <ExternalLink className='h-4 w-4' />
                  Demo
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
