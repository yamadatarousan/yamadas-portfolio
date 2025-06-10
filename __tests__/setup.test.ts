/**
 * Jest設定の確認テスト
 * 基本的なテスト環境が正しく動作することを確認
 */

describe('Jest設定確認', () => {
  test('基本的なアサーション', () => {
    expect(1 + 1).toBe(2);
  });

  test('非同期処理のテスト', async () => {
    const asyncFunction = () => Promise.resolve('success');
    const result = await asyncFunction();
    expect(result).toBe('success');
  });

  test('オブジェクトの検証', () => {
    const testObject = {
      name: 'テスト',
      version: '1.0.0',
      features: ['jest', 'typescript', 'react'],
    };

    expect(testObject).toEqual({
      name: 'テスト',
      version: '1.0.0',
      features: ['jest', 'typescript', 'react'],
    });
  });
});
