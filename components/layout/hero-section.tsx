'use client';

import { GitHub } from '@/components/ui/icons';
import { ArrowRight, Code, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  const skills = ['React', 'Next.js', 'TypeScript', 'PHP', 'MySQL'];

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/yamadatarousan',
      icon: GitHub,
    },
  ];

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-50/90 via-white/95 to-slate-100/90 dark:from-slate-900/95 dark:via-slate-800/98 dark:to-slate-900/95'></div>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/10 via-purple-100/10 to-pink-100/10 dark:from-blue-900/5 dark:via-purple-900/5 dark:to-pink-900/5 rounded-full blur-3xl'></div>
      </div>

      <div className='relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center'>
        {/* 左側: テキストコンテンツ */}
        <motion.div
          className='space-y-10'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className='space-y-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className='inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium mb-6'>
                <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></div>
                現在お仕事募集中
              </span>
            </motion.div>

            <motion.h1
              className='text-5xl lg:text-7xl font-bold tracking-tight'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className='block text-slate-900 dark:text-slate-100'>
                Creative
              </span>
              <span className='block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Developer
              </span>
            </motion.h1>

            <motion.p
              className='text-xl lg:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              美しいデザインと機能性を両立した
              <br />
              モダンWebアプリケーションを創造
            </motion.p>
          </div>

          {/* スキルタグ */}
          <motion.div
            className='space-y-4'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <h3 className='text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide'>
              Core Technologies
            </h3>
            <div className='flex flex-wrap gap-3'>
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  className='px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* CTAボタン */}
          <motion.div
            className='flex flex-col sm:flex-row gap-6'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <Link
              href='/projects'
              className='group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            >
              <span className='relative z-10 flex items-center gap-2'>
                プロジェクトを探索
                <ArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1' />
              </span>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </Link>

            <Link
              href='https://github.com/yamadatarousan'
              className='group inline-flex items-center justify-center px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-semibold rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            >
              <User className='mr-3 h-5 w-5' />
              私について
            </Link>
          </motion.div>

          {/* ソーシャルリンク */}
          <motion.div
            className='space-y-4'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            <h3 className='text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide'>
              Connect with me
            </h3>
            <div className='flex gap-4'>
              {socialLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md'
                    aria-label={link.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <IconComponent size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* 右側: プロフィール画像とステータス */}
        <motion.div
          className='relative flex flex-col items-center space-y-8'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* プロフィール画像 */}
          <motion.div
            className='relative'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full animate-pulse opacity-20'></div>
              <div className='relative w-80 h-80 rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-2 border-white/20 dark:border-slate-700/50 shadow-2xl'>
                <div className='w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 flex items-center justify-center'>
                  <motion.div
                    className='text-8xl'
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Code className='h-32 w-32 text-slate-600 dark:text-slate-300' />
                  </motion.div>
                </div>
              </div>
              {/* アクティブ状態のインジケーター */}
              <motion.div
                className='absolute bottom-8 right-8 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg'
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* ステータス情報 */}
          <motion.div
            className='text-center space-y-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className='inline-flex items-center gap-3 px-6 py-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg'>
              <motion.div
                className='w-3 h-3 bg-emerald-500 rounded-full'
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
                Available for Projects
              </span>
            </div>
            <p className='text-slate-500 dark:text-slate-400 font-medium'>
              Tokyo, Japan / Remote Worldwide
            </p>
          </motion.div>

          {/* 装飾的な浮遊要素 */}
          <motion.div
            className='absolute top-16 -left-16 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl'
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className='absolute bottom-16 -right-16 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl'
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
          <motion.div
            className='absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded-full blur-xl'
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
