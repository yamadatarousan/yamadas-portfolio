import { cn, formatDate, slugify, truncate } from '../../lib/utils';

describe('ユーティリティ関数', () => {
    describe('cn', () => {
        test('クラス名を適切に結合する', () => {
            expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
        });

        test('条件付きクラス名を処理する', () => {
            expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
        });

        test('重複するクラス名をマージする', () => {
            expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
        });
    });

    describe('formatDate', () => {
        test('Dateオブジェクトを日本語形式でフォーマットする', () => {
            const date = new Date('2024-01-15');
            const formatted = formatDate(date);
            expect(formatted).toMatch(/2024年1月15日/);
        });

        test('文字列の日付を処理する', () => {
            const formatted = formatDate('2024-01-15');
            expect(formatted).toMatch(/2024年1月15日/);
        });
    });

    describe('slugify', () => {
        test('英語テキストをスラグ化する', () => {
            expect(slugify('Hello World')).toBe('hello-world');
        });

        test('日本語テキストをスラグ化する', () => {
            expect(slugify('こんにちは 世界')).toBe('こんにちは-世界');
        });

        test('特殊文字を除去する', () => {
            expect(slugify('Hello! @#$ World')).toBe('hello-world');
        });

        test('連続するスペースを単一のハイフンに変換する', () => {
            expect(slugify('Hello    World')).toBe('hello-world');
        });

        test('先頭と末尾のハイフンを削除する', () => {
            expect(slugify('  Hello World  ')).toBe('hello-world');
        });
    });

    describe('truncate', () => {
        test('短いテキストはそのまま返す', () => {
            expect(truncate('短いテキスト', 20)).toBe('短いテキスト');
        });

        test('長いテキストを切り詰める', () => {
            const longText = '非常に長いテキストです。これは切り詰められるべきです。';
            expect(truncate(longText, 10)).toBe('非常に長いテキストで...');
        });

        test('最大長と同じ長さの場合はそのまま返す', () => {
            expect(truncate('テスト', 3)).toBe('テスト');
        });
    });
}); 